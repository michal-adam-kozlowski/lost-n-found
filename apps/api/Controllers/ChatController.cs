using LostNFound.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using LostNFound.Api.Models;


namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatController(AppDbContext db) : ControllerBase
{

    /// <summary>
    /// Creates or gets a chat for a given item.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ChatResponse>> CreateOrGet([FromBody] CreateChatRequest req)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var item = await db.Items.FirstOrDefaultAsync(i => i.Id == req.ItemId && i.CreatedByUser.BlockedAt == null);
        if (item == null)
        {
            return NotFound();
        }

        if (item.CreatedByUserId == userId)
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Bad Request",
                detail: "You cannot start a chat with yourself.");
        }


        var chat = await db.Chats.FirstOrDefaultAsync(c => c.ItemId == req.ItemId && c.ItemOwnerId == item.CreatedByUserId && c.InquirerId == userId);
        if (chat == null)
        {
            chat = new Chat
            {
                ItemId = req.ItemId,
                ItemOwnerId = item.CreatedByUserId,
                InquirerId = userId
            };

            db.Chats.Add(chat);
            await db.SaveChangesAsync();
        }

        return await ChatResponses(userId).FirstAsync(c => c.Id == chat.Id);
    }

    /// <summary>
    /// Get's all chats of the authenticated user, both as an inquirer and as an item owner.
    /// </summary>

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<ChatResponse>>> GetMine()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        return await ChatResponses(userId).OrderByDescending(x => x.LastMessageAt ?? x.CreatedAt).ToListAsync();
    }

    private IQueryable<ChatResponse> ChatResponses(Guid userId) =>
          db.Chats.Where(x => x.ItemOwnerId == userId || x.InquirerId == userId)
        .Select(x => new ChatResponse(
              x.Id,
              x.ItemId,
              x.Item.Title,
              x.CreatedAt,
              x.LastMessageAt
          ));
}


public record CreateChatRequest(Guid ItemId);

//TODO: Check what else is needed on frontend
public record ChatResponse(
    Guid Id,
    Guid ItemId,
    string ItemTitle,
    DateTime CreatedAt,
    DateTime? LastMessageAt
    );