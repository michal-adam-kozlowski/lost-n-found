using LostNFound.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using LostNFound.Api.Models;
using System.ComponentModel.DataAnnotations;


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

        return await ChatResponses(db.Chats
            .Where(c => c.ItemOwnerId == userId || c.InquirerId == userId)
            .Where(c => c.Id == chat.Id))
            .FirstAsync();
    }

    /// <summary>
    /// Gets all chats of the authenticated user, both as an inquirer and as an item owner.
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

        return await ChatResponses(db.Chats
            .Where(c => c.ItemOwnerId == userId || c.InquirerId == userId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt))
            .ToListAsync();
    }

    /// <summary>
    /// Sends a message in a chat. Only the inquirer and the item owner can send messages in the chat.
    /// </summary>
    [HttpPost("{chatId:guid}/messages")]
    [Authorize]
    public async Task<ActionResult<ChatMessageResponse>> SendMessage([FromBody] SendMessageRequest req, Guid chatId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var chat = await db.Chats.FirstOrDefaultAsync(c => c.Id == chatId);
        if (chat == null)
        {
            return NotFound();
        }

        if (chat.ItemOwnerId != userId && chat.InquirerId != userId)
        {
            return Forbid();
        }

        var body = req.Body.Trim();
        if (body.Length == 0)
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Bad Request",
                detail: "Message can't be empty."
                );
        }
        var message = new ChatMessage
        {
            Body = body,
            SenderId = userId,
            ChatId = chatId
        };
        chat.LastMessageAt = message.CreatedAt;

        db.ChatMessages.Add(message);
        await db.SaveChangesAsync();

        return new ChatMessageResponse(
            message.Id,
            message.ChatId,
            message.SenderId,
            message.Body,
            message.CreatedAt
            );
    }

    //todo: add pagination

    /// <summary>
    /// Gets all messages of a chat. Only the inquirer and the item owner can see the messages in the chat.
    /// </summary>
    [HttpGet("{chatId:guid}/messages")]
    [Authorize]
    public async Task<ActionResult<List<ChatMessageResponse>>> GetMessages(Guid chatId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        var chat = await db.Chats.FirstOrDefaultAsync(c => c.Id == chatId);

        if (chat == null)
        {
            return NotFound();
        }

        if (chat.ItemOwnerId != userId && chat.InquirerId != userId)
        {
            return Forbid();
        }

        var messages = await db.ChatMessages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.CreatedAt)
            .ThenBy(m => m.Id)
            .Select(m => new ChatMessageResponse(
                m.Id,
                m.ChatId,
                m.SenderId,
                m.Body,
                m.CreatedAt
            ))
            .ToListAsync();

        return messages;


    }
    private static IQueryable<ChatResponse> ChatResponses(IQueryable<Chat> chats) =>
         chats.Select(c => new ChatResponse(
             c.Id,
             c.ItemId,
             c.Item.Title,
             c.CreatedAt,
             c.LastMessageAt
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

public record SendMessageRequest(
     [Required, MaxLength(2000)] string Body
 );

public record ChatMessageResponse(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Body,
    DateTime CreatedAt
    );