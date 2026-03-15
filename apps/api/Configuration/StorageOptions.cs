namespace LostNFound.Api.Configuration;

public class StorageOptions
{
    public const string SectionName = "Storage";

    public required string EndpointUrl { get; set; }
    public required string BucketName { get; set; }
    public required string Region { get; set; }
    public required string AccessKeyId { get; set; }
    public required string SecretAccessKey { get; set; }
}
