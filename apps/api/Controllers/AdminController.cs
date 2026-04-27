using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "AdminOnly")]
public class AdminController(IItemDeletionService itemDeletionService) : ControllerBase
{
    [HttpGet]
    public ActionResult<string> GetAdminData()
    {
        return Ok("admin access");
    }

    [HttpDelete("items/{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteItem(Guid itemId)
    {
        try
        {
            await itemDeletionService.DeleteItemAsync(itemId);
            return NoContent();
        }
        catch (KeyNotFoundException e)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Not Found",
                detail: e.Message);
        }

    }

}


