namespace LostNFound.Api.Services;

public interface IFileStorageService
{
    /// <summary>
    /// Generates a presigned URL that allows the client to upload a file directly to storage.
    /// </summary>
    string GeneratePresignedUploadUrl(string objectKey, string contentType, int expirySeconds);

    /// <summary>
    /// Generates a presigned URL that allows the client to download a file from storage.
    /// </summary>
    string GeneratePresignedDownloadUrl(string objectKey, int expirySeconds);

    /// <summary>
    /// Deletes an object from storage.
    /// </summary>
    Task DeleteObjectAsync(string objectKey, CancellationToken ct = default);
}
