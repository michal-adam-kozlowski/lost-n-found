using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LostNFound.Api.Controllers;

// TODO: Add [Authorize] once authentication middleware is configured.
[ApiController]
[Route("api/items/{itemId:guid}/images")]
public class ItemImagesController(IItemImageService imageService) : ControllerBase
{
    /// <summary>
    /// Requests a presigned URL for uploading an image to the specified item.
    /// The frontend should upload the file directly to the returned URL, then call the confirm endpoint.
    /// </summary>
    [HttpPost("presign")]
    public async Task<IActionResult> Presign(Guid itemId, [FromBody] PresignImageRequest req, CancellationToken ct)
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
    public async Task<IActionResult> Confirm(Guid itemId, Guid imageId, CancellationToken ct)
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
    public async Task<IActionResult> GetDownloadUrl(Guid itemId, Guid imageId, CancellationToken ct)
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
    public async Task<IActionResult> Delete(Guid itemId, Guid imageId, CancellationToken ct)
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

    // TODO: Once authentication middleware is configured, extract the real user ID:
    //   return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    // Until then, returns null — authorization checks in the service layer are skipped.
    private Guid? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}

public record PresignImageRequest(
    [Required] string FileName,
    [Required] string ContentType,
    [Required, Range(1, long.MaxValue)] long SizeBytes
);

public record ConfirmImageResponse(Guid ImageId, string Status);
