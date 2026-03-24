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
    public async Task<ActionResult<List<ItemResponse>>> GetAll() =>
        await db.Items.OrderByDescending(i => i.CreatedAt).Select(i => new ItemResponse(
            i.Id,
            i.CategoryId,
            i.Title,
            i.Type,
            i.Description,
            i.Location != null ? i.Location.X : null, // Longitude
            i.Location != null ? i.Location.Y : null, // Latitude            
            i.LocationLabel,
            i.OccurredAt,
            i.CreatedAt
            )
        {
            
        }).ToListAsync();

    [HttpPost]
    public async Task<ActionResult<Item>> Create([FromBody] CreateItemRequest req)
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

   
        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }
}

//TODO: add GET /categories


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
