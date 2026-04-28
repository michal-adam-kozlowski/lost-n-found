using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "AdminOnly")]
public class AdminController(IItemDeletionService itemDeletionService, UserManager<ApplicationUser> userManager) : ControllerBase
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


    [HttpPost("users/{userId:guid}/block")]
    public async Task<ActionResult> BlockUser(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        user.IsBlocked = true;
        user.BlockedAt = DateTime.UtcNow;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
           foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        return NoContent();
    }


    [HttpPost("users/{userId:guid}/unblock")]
    public async Task<ActionResult> UnblockUser(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        user.IsBlocked = false;
        user.BlockedAt = null;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        return  NoContent();
    }


}


