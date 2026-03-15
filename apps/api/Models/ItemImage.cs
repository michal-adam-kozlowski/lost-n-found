namespace LostNFound.Api.Models;

public class ItemImage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ItemId { get; set; }

    public required string StorageBucket { get; set; }

    public required string ObjectKey { get; set; }

    public required string OriginalFileName { get; set; }

    public required string MimeType { get; set; }

    public long SizeBytes { get; set; }

    public int? Width { get; set; }

    public int? Height { get; set; }

    public int SortOrder { get; set; }

    public bool IsPrimary { get; set; }

    public UploadStatus UploadStatus { get; set; } = UploadStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // TODO: Make non-nullable once authentication is implemented and user identity is always available.
    public Guid? UploadedByUserId { get; set; }

    // Navigation properties
    public Item Item { get; set; } = null!;
    public ApplicationUser? UploadedBy { get; set; }
}
