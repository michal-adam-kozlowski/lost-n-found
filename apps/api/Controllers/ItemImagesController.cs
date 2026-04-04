using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LostNFound.Api.Controllers;


[ApiController]
[Route("api/items/{itemId:guid}/images")]
[Authorize]
public class ItemImagesController(IItemImageService imageService) : ControllerBase
{
    /// <summary>
    /// Requests a presigned URL for uploading an image to the specified item.
    /// The frontend should upload the file directly to the returned URL, then call the confirm endpoint.
    /// </summary>
    [HttpPost("presign")]
    public async Task<ActionResult<PresignResult>> Presign(Guid itemId, [FromBody] PresignImageRequest req, CancellationToken ct)
    {
        try
        {
            var result = await imageService.CreatePresignedUploadAsync(
                itemId, new PresignRequest(req.FileName, req.ContentType, req.SizeBytes), GetUserId(), ct);
            return Ok(result);
        }
        catch (KeyNotFoundException e) { return NotFound(new { error = e.Message }); }
        catch (UnauthorizedAccessException e) { return StatusCode(403, new { error = e.Message }); }
        catch (Services.ValidationException e) { return BadRequest(new { error = e.Message }); }
    }

    /// <summary>
    /// Confirms that the frontend has successfully uploaded the file to storage.
    /// Transitions the image record from Pending to Uploaded.
    /// </summary>
    [HttpPost("{imageId:guid}/confirm")]
    public async Task<ActionResult<ItemImage>> Confirm(Guid itemId, Guid imageId, CancellationToken ct)
    {
        try
        {
            var image = await imageService.ConfirmUploadAsync(itemId, imageId, GetUserId(), ct);
            return Ok(new ConfirmImageResponse(image.Id, image.UploadStatus.ToString()));
        }
        catch (KeyNotFoundException e) { return NotFound(new { error = e.Message }); }
        catch (UnauthorizedAccessException e) { return StatusCode(403, new { error = e.Message }); }
        catch (Services.ValidationException e) { return BadRequest(new { error = e.Message }); }
    }

    /// <summary>
    /// Returns a time-limited presigned download URL for the specified image.
    /// </summary>
    
    [HttpGet("{imageId:guid}/download-url")]
    [AllowAnonymous]
    public async Task<ActionResult<DownloadUrlResult>> GetDownloadUrl(Guid itemId, Guid imageId, CancellationToken ct)
    {
        try
        {
            var result = await imageService.GetDownloadUrlAsync(itemId, imageId, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException e) { return NotFound(new { error = e.Message }); }
    }

    /// <summary>
    /// Deletes the specified image. Marks the DB record as Deleted and removes the object from storage.
    /// </summary>
    [HttpDelete("{imageId:guid}")]
    public async Task<ActionResult> Delete(Guid itemId, Guid imageId, CancellationToken ct)
    {
        try
        {
            await imageService.DeleteAsync(itemId, imageId, GetUserId(), ct);
            return NoContent();
        }
        catch (KeyNotFoundException e) { return NotFound(new { error = e.Message }); }
        catch (UnauthorizedAccessException e) { return StatusCode(403, new { error = e.Message }); }
        catch (Services.ValidationException e) { return BadRequest(new { error = e.Message }); }
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(claim, out var id))
            throw new UnauthorizedAccessException("UserId claim is invalid");
        return id;
    }
}

public record PresignImageRequest(
    [Required] string FileName,
    [Required] string ContentType,
    [Required, Range(1, long.MaxValue)] long SizeBytes
);

public record ConfirmImageResponse(Guid ImageId, string Status);
