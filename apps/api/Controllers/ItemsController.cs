using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.Security.Claims;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(AppDbContext db) : ControllerBase
{
    private static readonly HashSet<string> ValidTypes = ["lost", "found"];

    [HttpGet]
    public async Task<ActionResult<List<ItemResponse>>> GetAll()
    {
        var items = await db.Items.OrderByDescending(i => i.CreatedAt).ToListAsync();
        return items.Select(ToResponse).ToList();
    }


    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ItemResponse>> GetById(Guid id)
    {
        var item = await db.Items.FindAsync(id);
        if (item is null)
            return NotFound();

        return ToResponse(item);
    }

    [HttpPost]
    public async Task<ActionResult<ItemResponse>> Create([FromBody] CreateItemRequest req)
    {
        if (!ValidTypes.Contains(req.Type))
            return BadRequest(new { error = "type must be 'lost' or 'found'" });

        var categoryExists = await db.Categories.AnyAsync(c => c.Id == req.CategoryId);
        if (!categoryExists)
            return BadRequest(new { error = "invalid categoryId" });

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
    string Title,
    string Type,
    string? Description,    
    double? Longitude,
    double? Latitude,
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
