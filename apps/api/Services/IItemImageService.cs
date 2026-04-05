using LostNFound.Api.Models;

namespace LostNFound.Api.Services;

public interface IItemImageService
{
    Task<PresignResult> CreatePresignedUploadAsync(Guid itemId, PresignRequest request, Guid userId, CancellationToken ct = default);
    Task<ItemImage> ConfirmUploadAsync(Guid itemId, Guid imageId, Guid userId, CancellationToken ct = default);
    Task<DownloadUrlResult> GetDownloadUrlAsync(Guid itemId, Guid imageId, CancellationToken ct = default);
    Task<DownloadUrlResult> GetThumbnailDownloadUrlAsync(Guid itemId, Guid imageId, CancellationToken ct = default);
    Task DeleteAsync(Guid itemId, Guid imageId, Guid userId, CancellationToken ct = default);
}

public record PresignRequest(string FileName, string ContentType, long SizeBytes);

public record PresignResult(
    Guid ImageId,
    string ObjectKey,
    string UploadUrl,
    DateTime ExpiresAt,
    Dictionary<string, string> Headers
);

public record DownloadUrlResult(string DownloadUrl, DateTime ExpiresAt);
