using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(AppDbContext db) : ControllerBase
{
    private static readonly HashSet<string> ValidTypes = ["lost", "found"];

    /// <summary>
    /// Returns all items ordered from newest to oldest.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ItemResponse>>> GetAll()
    {
        var items = await db.Items.OrderByDescending(i => i.CreatedAt).ToListAsync();
        return items.Select(ToResponse).ToList();
    }

    /// <summary>
    /// Returns the item from id.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemResponse>> GetById(Guid id)
    {
        var item = await db.Items.FindAsync(id);
        if (item is null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Not Found",
                detail: $"No item found with id {id}");
        }

        return ToResponse(item);
    }

    /// <summary>
    /// Creates a new item.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemResponse>> Create([FromBody] CreateItemRequest req)
    {
        if (!ValidTypes.Contains(req.Type))
        {
            ModelState.AddModelError(nameof(req.Type), "type must be 'lost' or 'found'");
            return ValidationProblem(ModelState);
        }
            
        var categoryExists = await db.Categories.AnyAsync(c => c.Id == req.CategoryId);
        if (!categoryExists)
        {
            ModelState.AddModelError(nameof(req.CategoryId), "invalid categoryId");
            return ValidationProblem(ModelState);
        }
            
        Point? location = null;
        if (req.Latitude.HasValue && req.Longitude.HasValue)
            location = new Point(req.Longitude.Value, req.Latitude.Value) { SRID = 4326 }; //WGS84
       

        var item = new Item
        {
            //CreatedByUserId  // TODO: auth and get user id from token
            CategoryId = req.CategoryId,
            Title = req.Title,
            Type = req.Type,
            Description = req.Description,
            LocationLabel = req.LocationLabel,
            Location = location,
            OccurredAt = req.OccurredAt
        };

        db.Items.Add(item);
        await db.SaveChangesAsync();

   
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, ToResponse(item));
    }

    private static ItemResponse ToResponse (Item item) => new ItemResponse(
        item.Id,
        item.CategoryId,
        item.Title,
        item.Type,
        item.Description,
        item.Location != null ? item.Location.X : null, // Longitude
        item.Location != null ? item.Location.Y : null, // Latitude            
        item.LocationLabel,
        item.OccurredAt,
        item.CreatedAt
    );
}


public record CreateItemRequest(
    Guid CategoryId,
    [Required] string Title,
    [Required] string Type,
    string? Description,    
    [Range(-180, 180)] double? Longitude,
    [Range(-90, 90)] double? Latitude,
    string? LocationLabel,
    DateTime OccurredAt
);

public record ItemResponse(
    Guid Id,
    Guid CategoryId,
    string Title,
    string Type,
    string? Description,
    double? Longitude,
    double? Latitude,
    string? LocationLabel,
    DateTime OccurredAt,
    DateTime CreatedAt
);
