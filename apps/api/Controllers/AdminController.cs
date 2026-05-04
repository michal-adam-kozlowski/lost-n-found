using LostNFound.Api.Constants;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = AuthConstants.AdminOnlyPolicy)]
public class AdminController(IItemDeletionService itemDeletionService, UserManager<ApplicationUser> userManager) : ControllerBase
{
    //only for testing 
    /*
    [HttpGet]
    public ActionResult<string> GetAdminData()
    {
        return Ok("admin access");
    }
    */
   


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

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet("users/")]
    [ProducesResponseType<List<GetUserResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<GetUserResponse>>> GetUsers()
    {
        var users = userManager.Users.ToList();
        if (users.Count == 0)
        {
            return NoContent();
        }

        var response = new List<GetUserResponse>();
        foreach (var user in users)        {
            var roles = await userManager.GetRolesAsync(user);
            response.Add(new GetUserResponse(user.Id, user.Email!, user.BlockedAt, roles.ToList()));
        }

        return Ok(response);
    }


    /// <summary>
    /// Blocks a user.
    /// </summary>
    [HttpPost("users/{userId:guid}/block")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> BlockUser(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

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

    /// <summary>
    /// Unblocks a user.
    /// </summary>
    [HttpPost("users/{userId:guid}/unblock")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UnblockUser(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

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


public record GetUserResponse(Guid Id, string Email, DateTime? BlockedAt, List<string>? Roles);

