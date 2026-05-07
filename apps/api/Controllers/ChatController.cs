using LostNFound.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using LostNFound.Api.Models;


namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateChatResponse>> CreateChat([FromBody] CreateChatRequest req)
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
        if (chat != null)
        {
            return new CreateChatResponse(chat.Id);
        }


        chat = new Chat{
            ItemId = req.ItemId,
            ItemOwnerId = item.CreatedByUserId,
            InquirerId = userId
        };

        db.Chats.Add(chat);
        await db.SaveChangesAsync();

        return new CreateChatResponse(chat.Id);
    }
}


public record CreateChatRequest(Guid ItemId);
public record CreateChatResponse(Guid ChatId);