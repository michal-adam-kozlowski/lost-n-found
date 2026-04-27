using LostNFound.Api.Data;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(AppDbContext db, IItemDeletionService itemDeletionService, IMapTilerService mapTiler) : ControllerBase
{
    private static readonly HashSet<string> ValidTypes = ["lost", "found"];

    /// <summary>
    /// Returns all items ordered from newest to oldest.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<List<ItemResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<ItemResponse>>> GetAll(
        [FromQuery] bool mine = false,
        [FromQuery] string? type = null,
        [FromQuery] List<Guid>? categoryIds = null,
        [FromQuery] DateOnly? occurredAtFrom = null,
        [FromQuery] DateOnly? occurredAtTo = null,
        [FromQuery] string? locationId = null)
    {
        IQueryable<Item> query = db.Items;

        if (mine)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Problem(
                    statusCode: StatusCodes.Status401Unauthorized,
                    title: "Unauthorized",
                    detail: "mine filter requires login");
            }
            query = query.Where(i => i.CreatedByUserId == userId);
        }

        if (!string.IsNullOrEmpty(type))
        {
            if (!ValidTypes.Contains(type))
            {
                ModelState.AddModelError(nameof(type), "type filter must be 'lost' or 'found'");
                return ValidationProblem(ModelState);
            }
            query = query.Where(i => i.Type == type);
        }

        if (categoryIds != null)
        {
            query = query.Where(i => categoryIds.Contains(i.CategoryId));
        }

        if (occurredAtFrom.HasValue && occurredAtTo.HasValue && occurredAtFrom.Value > occurredAtTo.Value)
        {
            ModelState.AddModelError(nameof(occurredAtFrom), "occurredAtFrom must be earlier than or equal to occurredAtTo");
            return ValidationProblem(ModelState);
        }

        if (occurredAtFrom.HasValue)
        {
            query = query.Where(i => i.OccurredAt >= occurredAtFrom.Value);
        }
        if (occurredAtTo.HasValue)
        {
            query = query.Where(i => i.OccurredAt <= occurredAtTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(locationId))
        {
            var polygon = await mapTiler.FetchPolygonAsync(locationId);
            if (polygon != null)
            {
                query = query.Where(i => i.Location != null && polygon.Contains(i.Location));
            }
        }

        var items = await query.OrderByDescending(i => i.CreatedAt).ToListAsync();

        
        var itemIds = items.Select(i => i.Id).ToList();
        
        //Load uploaded image IDs for all items at once and group them by itemId 
        var uploadedImages = await db.ItemImages
            .Where(i => itemIds.Contains(i.ItemId) && i.UploadStatus == UploadStatus.Uploaded)
            .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id)
            .Select(i => new { i.ItemId, i.Id, i.BlurDataUrl })
            .ToListAsync();

        var imagesByItemId = uploadedImages
            .GroupBy(x => x.ItemId)
            .ToDictionary( g => g.Key, g => g.Select(x => new ItemImageInfo(x.Id, x.BlurDataUrl)).ToArray()
);

        return items.Select(item => ToResponse(item, imagesByItemId.TryGetValue(item.Id, out var images) ? images : [])).ToList();
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
        var images = await db.ItemImages
            .Where(i => i.ItemId == id && i.UploadStatus == UploadStatus.Uploaded)
            .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id) 
            .Select(i => new ItemImageInfo(i.Id, i.BlurDataUrl))
            .ToArrayAsync();

        return ToResponse(item, images);
    }

    /// <summary>
    /// Creates a new item.
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ItemResponse>> Create([FromBody] CreateItemRequest req)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "UserId claim is invalid");
        }

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
       
        if (req.OccurredAt == default || req.OccurredAt > DateOnly.FromDateTime(DateTime.Now))
        {
            ModelState.AddModelError(nameof(req.OccurredAt), "OccurredAt in invalid");
            return ValidationProblem(ModelState);
        }

        var item = new Item
        {
            CreatedByUserId = userId,
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

        //TODO: check how to return img at creation, for now return empty
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, ToResponse(item, []));
    }


    /// <summary>
    /// Deletes item and connected images. Only user who created the item can delete it.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "UserId claim is invalid");
        }

        var item = await db.Items.FindAsync(id);
        if (item == null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Not Found",
                detail: $"No item found with id {id}");
        }

        if (userId != item.CreatedByUserId)
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Item can only be deleted by its owner");
        }

        
        await itemDeletionService.DeleteItemAsync(id);

        return NoContent(); 
    }

    /// <summary>
    /// Updates an item. Only user who created the item can update it.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemResponse>> Update([FromBody] CreateItemRequest req, Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "UserId claim is invalid");
        }

        var item = await db.Items.FindAsync(id);
        if (item == null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Not Found",
                detail: $"No item found with id {id}");
        }

        if (userId != item.CreatedByUserId)
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Item can only be modified by its owner");
        }

        if (!await db.Categories.AnyAsync(c => c.Id == req.CategoryId))
        {
            ModelState.AddModelError(nameof(req.CategoryId), "invalid categoryId");
            return ValidationProblem(ModelState);
        }

        if (!ValidTypes.Contains(req.Type))
        {
            ModelState.AddModelError(nameof(req.Type), "type must be 'lost' or 'found'");
            return ValidationProblem(ModelState);
        }

        Point? location = null;
        if (req.Latitude.HasValue && req.Longitude.HasValue)
            location = new Point(req.Longitude.Value, req.Latitude.Value) { SRID = 4326 };

        if (req.OccurredAt == default || req.OccurredAt > DateOnly.FromDateTime(DateTime.Now))
        {
            ModelState.AddModelError(nameof(req.OccurredAt), "OccurredAt in invalid");
            return ValidationProblem(ModelState);
        }

        item.CategoryId = req.CategoryId;
        item.Title = req.Title;
        item.Type = req.Type;
        item.Description = req.Description;
        item.Location = location;
        item.LocationLabel = req.LocationLabel;
        item.OccurredAt = req.OccurredAt;

        await db.SaveChangesAsync();

        var images = await db.ItemImages
           .Where(i => i.ItemId == id && i.UploadStatus == UploadStatus.Uploaded)
           .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id)
           .Select(i => new ItemImageInfo(i.Id, i.BlurDataUrl))
           .ToArrayAsync();

        return ToResponse(item, images);
    }

    
    private static ItemResponse ToResponse (Item item, ItemImageInfo[] images) => new ItemResponse(
        item.Id,
        item.CategoryId,
        item.Title,
        item.Type,
        item.Description,
        item.Location != null ? item.Location.X : null, // Longitude
        item.Location != null ? item.Location.Y : null, // Latitude            
        item.LocationLabel,
        item.OccurredAt,
        item.CreatedAt,
        item.CreatedByUserId,
        images
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
    DateOnly OccurredAt
);

public record ItemImageInfo(Guid Id, string? BlurDataUrl);

public record ItemResponse(
    Guid Id,
    Guid CategoryId,
    string Title,
    string Type,
    string? Description,
    double? Longitude,
    double? Latitude,
    string? LocationLabel,
    DateOnly OccurredAt,
    DateTime CreatedAt,
    Guid? CreatedByUserId,
    ItemImageInfo[] Images
);
