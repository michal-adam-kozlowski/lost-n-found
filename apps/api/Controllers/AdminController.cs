using System.Security.Claims;
using LostNFound.Api.Constants;
using LostNFound.Api.Data;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = AuthConstants.AdminOnlyPolicy)]
public class AdminController(AppDbContext db, IItemDeletionService itemDeletionService, UserManager<ApplicationUser> userManager) : ControllerBase
{
    //only for testing 
    /*
    [HttpGet]
    public ActionResult<string> GetAdminData()
    {
        return Ok("admin access");
    }
    */

    /// <summary>
    /// Returns all items ordered from newest to oldest.
    /// </summary>
    [HttpGet("items")]
    [ProducesResponseType<List<ItemResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<ItemResponse>>> GetItems()
    {
        var items = await db.Items.OrderByDescending(i => i.CreatedAt).ToListAsync();
        return items.Select(item => ItemsController.ToResponse(item, [])).ToList();
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

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet("users/")]
    [ProducesResponseType<List<GetUserResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<GetUserResponse>>> GetUsers()
    {
        var usersWithRoles = await db.Users
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.BlockedAt,
                Roles = db.UserRoles
                    .Where(ur => ur.UserId == u.Id)
                    .Join(db.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                    .ToList()
            })
            .ToListAsync();

        var response = usersWithRoles
            .Select(x => new GetUserResponse(x.Id, x.Email!, x.BlockedAt, x.Roles!))
            .ToList();

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

        var userRoles = await userManager.GetRolesAsync(user);
        if (userRoles.Contains(AuthConstants.AdminRole))
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Bad Request",
                detail: "Nie można zablokować administratorów.");
        }

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var currentUserId))
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Bad Request",
                detail: "Nieprawidłowy identyfikator użytkownika w tokenie.");
        }

        if (currentUserId == user.Id)
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Bad Request",
                detail: "Użytkownik nie może zablokować samego siebie.");
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

