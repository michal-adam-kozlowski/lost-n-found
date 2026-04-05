using LostNFound.Api.Configuration;
using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace LostNFound.Api.Services;

public class ItemImageService(
    AppDbContext db,
    IFileStorageService storage,
    IImageProcessingService imageProcessing,
    IOptions<StorageOptions> storageOptions,
    IOptions<UploadOptions> uploadOptions,
    ILogger<ItemImageService> logger) : IItemImageService
{
    private const int ThumbnailMaxHeight = 200;
    private const int BlurMaxDimension = 10;
    private const int WebpQuality = 50;
    private static readonly Dictionary<string, string> MimeToExtension = new()
    {
        ["image/jpeg"] = "jpg",
        ["image/png"] = "png",
        ["image/webp"] = "webp",
    };

    /// <summary>
    /// Validates the request, creates a Pending database record, and returns a presigned upload URL.
    /// The frontend uploads the file directly to storage, then calls ConfirmUploadAsync.
    /// </summary>
    public async Task<PresignResult> CreatePresignedUploadAsync(
        Guid itemId, PresignRequest request, Guid userId, CancellationToken ct = default)
    {
        var upload = uploadOptions.Value;

        var item = await db.Items.FindAsync([itemId], ct)
            ?? throw new KeyNotFoundException("Item not found.");

        if (item.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to modify this item.");

        if (!upload.AllowedMimeTypes.Contains(request.ContentType))
            throw new ValidationException($"Content type '{request.ContentType}' is not allowed.");

        var maxBytes = (long)upload.MaxFileSizeMb * 1024 * 1024;
        if (request.SizeBytes <= 0 || request.SizeBytes > maxBytes)
            throw new ValidationException($"File size must be between 1 byte and {upload.MaxFileSizeMb} MB.");

        if (!MimeToExtension.TryGetValue(request.ContentType, out var extension))
            throw new ValidationException($"No known extension for content type '{request.ContentType}'.");

        var imageId = Guid.NewGuid();
        var objectKey = $"{upload.ObjectPrefix}/{itemId}/{imageId}/original.{extension}";

        var image = new ItemImage
        {
            Id = imageId,
            ItemId = itemId,
            StorageBucket = storageOptions.Value.BucketName,
            ObjectKey = objectKey,
            OriginalFileName = SanitizeFileName(request.FileName),
            MimeType = request.ContentType,
            SizeBytes = request.SizeBytes,
            UploadStatus = UploadStatus.Pending,
            UploadedByUserId = userId,
        };

        db.ItemImages.Add(image);
        await db.SaveChangesAsync(ct);

        var expirySeconds = upload.PresignedUrlExpirySeconds;
        var uploadUrl = storage.GeneratePresignedUploadUrl(objectKey, request.ContentType, expirySeconds);
        var expiresAt = DateTime.UtcNow.AddSeconds(expirySeconds);

        return new PresignResult(
            ImageId: imageId,
            ObjectKey: objectKey,
            UploadUrl: uploadUrl,
            ExpiresAt: expiresAt,
            Headers: new Dictionary<string, string> { ["Content-Type"] = request.ContentType }
        );
    }

    public async Task<ItemImage> ConfirmUploadAsync(
        Guid itemId, Guid imageId, Guid userId, CancellationToken ct = default)
    {
        var image = await db.ItemImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ItemId == itemId, ct)
            ?? throw new KeyNotFoundException("Image not found.");

        if (image.UploadedByUserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to confirm this upload.");

        if (image.UploadStatus != UploadStatus.Pending)
            throw new ValidationException($"Image is in '{image.UploadStatus}' state and cannot be confirmed.");

        image.UploadStatus = UploadStatus.Uploaded;
        await db.SaveChangesAsync(ct);

        try
        {
            await using var original = await storage.DownloadObjectAsync(image.ObjectKey, ct);

            await using var thumbStream = await imageProcessing.GenerateThumbnailAsync(original, ThumbnailMaxHeight, WebpQuality, ct);
            var thumbKey = image.ObjectKey.Replace("/original.", "/thumb.");

            thumbKey = Path.ChangeExtension(thumbKey, ".webp");
            await storage.UploadObjectAsync(thumbKey, thumbStream, "image/webp", ct);
            image.ThumbnailObjectKey = thumbKey;

            original.Position = 0;
            var blurDataUrl = await imageProcessing.GenerateBlurDataUrlAsync(original, BlurMaxDimension, WebpQuality, ct);
            image.BlurDataUrl = blurDataUrl;

            await db.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to generate thumbnail/blur for image {ImageId} on item {ItemId}.", imageId, itemId);
        }

        return image;
    }

    public async Task<DownloadUrlResult> GetDownloadUrlAsync(
        Guid itemId, Guid imageId, CancellationToken ct = default)
    {
        var image = await db.ItemImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ItemId == itemId && i.UploadStatus == UploadStatus.Uploaded, ct)
            ?? throw new KeyNotFoundException("Image not found.");

        var expirySeconds = uploadOptions.Value.PresignedUrlExpirySeconds;
        var downloadUrl = storage.GeneratePresignedDownloadUrl(image.ObjectKey, expirySeconds);

        return new DownloadUrlResult(downloadUrl, DateTime.UtcNow.AddSeconds(expirySeconds));
    }

    public async Task<DownloadUrlResult> GetThumbnailDownloadUrlAsync(
        Guid itemId, Guid imageId, CancellationToken ct = default)
    {
        var image = await db.ItemImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ItemId == itemId && i.UploadStatus == UploadStatus.Uploaded, ct)
            ?? throw new KeyNotFoundException("Image not found.");

        if (string.IsNullOrEmpty(image.ThumbnailObjectKey))
            throw new KeyNotFoundException("Thumbnail not available for this image.");

        var expirySeconds = uploadOptions.Value.PresignedUrlExpirySeconds;
        var downloadUrl = storage.GeneratePresignedDownloadUrl(image.ThumbnailObjectKey, expirySeconds);

        return new DownloadUrlResult(downloadUrl, DateTime.UtcNow.AddSeconds(expirySeconds));
    }

    /// <summary>
    /// Marks the image as Deleted and removes the object from storage.
    /// Structured so soft-delete vs hard-delete behavior can be changed later.
    /// </summary>
    public async Task DeleteAsync(
        Guid itemId, Guid imageId, Guid userId, CancellationToken ct = default)
    {
        var image = await db.ItemImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ItemId == itemId, ct)
            ?? throw new KeyNotFoundException("Image not found.");

        if (image.UploadedByUserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this image.");

        if (image.UploadStatus == UploadStatus.Deleted)
            throw new ValidationException("Image is already deleted.");

        // Delete from storage first; if this fails, the DB record remains unchanged.
        if (image.UploadStatus == UploadStatus.Uploaded)
        {
            await storage.DeleteObjectAsync(image.ObjectKey, ct);

            if (!string.IsNullOrEmpty(image.ThumbnailObjectKey))
                await storage.DeleteObjectAsync(image.ThumbnailObjectKey, ct);
        }

        image.UploadStatus = UploadStatus.Deleted;
        await db.SaveChangesAsync(ct);
    }

    private static string SanitizeFileName(string fileName)
    {
        var name = Path.GetFileName(fileName);
        if (string.IsNullOrWhiteSpace(name))
            return "unknown";
        return name.Length > 255 ? name[..255] : name;
    }
}

/// <summary>
/// Thrown when a business validation rule is violated.
/// Distinct from system exceptions to allow clean mapping to 400 responses.
/// </summary>
public class ValidationException(string message) : Exception(message);
