using Amazon.Runtime.Internal.Util;
using Amazon.S3.Model;
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
public class ItemsController(AppDbContext db, IFileStorageService storage, ILogger<ItemsController> logger) : ControllerBase
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

   
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, ToResponse(item));
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

        
        var imageObjectKeys = await db.ItemImages
            .Where(x => x.ItemId == id && x.UploadStatus != UploadStatus.Deleted)
            .Select(x => x.ObjectKey)
            .Distinct()
            .ToListAsync();

        //ItemImage rows will cascade delete with the item
        db.Items.Remove(item);
        await db.SaveChangesAsync();

        foreach (var objectKey in imageObjectKeys)
        {
            try
            {
                await storage.DeleteObjectAsync(objectKey);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete ItemImage {ObjectKey} for item {ItemId}", objectKey, id);
            }
        }

        return NoContent(); 
    }

    /// <summary>
    /// Updates an item. Only user who created the item can update it. All fields are optional, only provided fields will be updated. To clear description or location label set ClearDescription or ClearLocationLabel to true.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemResponse>> Update([FromBody] UpdateItemRequest req, Guid id)
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

        
        if (req.CategoryId != null)
        {
            if (!await db.Categories.AnyAsync(c => c.Id == req.CategoryId.Value))
            {
                ModelState.AddModelError(nameof(req.CategoryId), "invalid categoryId");
                return ValidationProblem(ModelState);
            }
            item.CategoryId = req.CategoryId.Value;
        }
        
        if (req.Title != null)
            item.Title = req.Title;
        
        if (req.Type != null)
        {
            if (!ValidTypes.Contains(req.Type))
            {
                ModelState.AddModelError(nameof(req.Type), "type must be 'lost' or 'found'");
                return ValidationProblem(ModelState);
            }
            item.Type = req.Type;
        }

        if (req.ClearDescription)
        {
            item.Description = null;
        }
        else if (req.Description != null)
        {
            item.Description = req.Description;
        }

        // from map we always get both 
        if (req.Longitude != null && req.Latitude != null)
        {
            item.Location = new Point(req.Longitude.Value, req.Latitude.Value) { SRID = 4326 };
        }

        if (req.ClearLocationLabel)
        {
            item.LocationLabel = null;
        }
        else if (req.LocationLabel != null)
        {
            item.LocationLabel = req.LocationLabel;
        }


        if (req.OccurredAt != null)
            item.OccurredAt = req.OccurredAt.Value;



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
//no clear for location for now. For circular area both point and radius will be required.
//If we allow storing location in a diffrent way we might need to clear it as a point
public record UpdateItemRequest(
    Guid? CategoryId,
    string? Title,
    string? Type,
    string? Description,
    [Range(-180, 180)] double? Longitude,
    [Range(-90, 90)] double? Latitude,      
    string? LocationLabel,
    DateTime? OccurredAt,
    bool ClearLocationLabel = false, //if on update the previous value should be cleared send true, otherwise omit 
    bool ClearDescription = false
);