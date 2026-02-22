using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(AppDbContext db) : ControllerBase
{
    private static readonly HashSet<string> ValidTypes = ["lost", "found"];

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Items.OrderByDescending(i => i.CreatedAt).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemRequest req)
    {
        if (!ValidTypes.Contains(req.Type))
            return BadRequest(new { error = "type must be 'lost' or 'found'" });

        var item = new Item
        {
            Title = req.Title,
            Type = req.Type,
            Description = req.Description,
            Latitude = req.Latitude,
            Longitude = req.Longitude,
        };

        db.Items.Add(item);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }
}

public record CreateItemRequest(
    string Title,
    string Type,
    string? Description,
    decimal? Latitude,
    decimal? Longitude
);
