namespace LostNFound.Api.Configuration;

public class UploadOptions
{
    public const string SectionName = "Upload";

    public int MaxFileSizeMb { get; set; } = 10;
    public string[] AllowedMimeTypes { get; set; } = ["image/jpeg", "image/png", "image/webp"];
    public int PresignedUrlExpirySeconds { get; set; } = 300;
    public string ObjectPrefix { get; set; } = "items";
}
