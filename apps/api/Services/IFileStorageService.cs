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
    /// Downloads an object from storage and returns its content as a stream.
    /// </summary>
    Task<Stream> DownloadObjectAsync(string objectKey, CancellationToken ct = default);

    /// <summary>
    /// Uploads a stream to storage with the specified content type.
    /// </summary>
    Task UploadObjectAsync(string objectKey, Stream content, string contentType, CancellationToken ct = default);

    /// <summary>
    /// Deletes an object from storage.
    /// </summary>
    Task DeleteObjectAsync(string objectKey, CancellationToken ct = default);
}
