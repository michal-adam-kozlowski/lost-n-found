namespace LostNFound.Api.Models;

public class NotificationQueue
{
    public Guid Id { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public Guid RecipientUserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Payload { get; set; } = "{}";
    public string Status { get; set; } = "pending";
    public int Attempts { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public DateTime? LastAttemptAt { get; set; }
    public string? Error { get; set; }

    // Navigation
    public ApplicationUser RecipientUser { get; set; } = null!;
}
