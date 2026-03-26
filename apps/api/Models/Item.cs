using NetTopologySuite.Geometries;
namespace LostNFound.Api.Models;

public class Item
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CreatedByUserId { get; set; }
    public Guid CategoryId { get; set; }
    public required string Title { get; set; }

    /// <summary>"lost" | "found"</summary>
    public required string Type { get; set; }
    public string? Description { get; set; }
    public string? LocationLabel { get; set; }
    public Point? Location { get; set; }
    public DateTime OccurredAt { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public ApplicationUser CreatedByUser { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
