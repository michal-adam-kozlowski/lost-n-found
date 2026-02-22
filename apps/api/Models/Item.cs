namespace LostNFound.Api.Models;

public class Item
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>"lost" | "found"</summary>
    public required string Title { get; set; }

    public required string Type { get; set; }

    public string? Description { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
