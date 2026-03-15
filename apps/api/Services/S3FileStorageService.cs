using Amazon.S3;
using Amazon.S3.Model;
using LostNFound.Api.Configuration;
using Microsoft.Extensions.Options;

namespace LostNFound.Api.Services;

public class S3FileStorageService : IFileStorageService
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;

    public S3FileStorageService(IAmazonS3 s3, IOptions<StorageOptions> storageOptions)
    {
        _s3 = s3;
        _bucketName = storageOptions.Value.BucketName;
    }

    public string GeneratePresignedUploadUrl(string objectKey, string contentType, int expirySeconds)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddSeconds(expirySeconds),
            ContentType = contentType,
        };

        return _s3.GetPreSignedURL(request);
    }

    public string GeneratePresignedDownloadUrl(string objectKey, int expirySeconds)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddSeconds(expirySeconds),
        };

        return _s3.GetPreSignedURL(request);
    }

    public async Task DeleteObjectAsync(string objectKey, CancellationToken ct = default)
    {
        await _s3.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
        }, ct);
    }
}
