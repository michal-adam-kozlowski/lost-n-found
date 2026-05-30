using LostNFound.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using LostNFound.Api.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;
using LostNFound.Api.Hubs;


namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatController(AppDbContext db, IHubContext<ChatHub> chatHub, ILogger<ChatController> logger) : ControllerBase
{

    /// <summary>
    /// Returns the total count of unread messages across all the authenticated user's chats.
    /// </summary>
    [HttpGet("unread-count")]
    [Authorize]
    [ProducesResponseType<UnreadCountResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UnreadCountResponse>> GetUnreadCount()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var count = await db.ChatMessages
            .Where(m => m.SenderId != userId && m.ReadAt == null &&
                        (m.Chat.ItemOwnerId == userId || m.Chat.InquirerId == userId))
            .CountAsync();

        return new UnreadCountResponse(count);
    }

    /// <summary>
    /// Marks all unread messages in a chat (sent by the other participant) as read.
    /// </summary>
    [HttpPost("{chatId:guid}/messages/read")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkMessagesRead(Guid chatId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var chat = await db.Chats.FirstOrDefaultAsync(c => c.Id == chatId);
        if (chat == null)
            return NotFound();

        if (chat.ItemOwnerId != userId && chat.InquirerId != userId)
            return Forbid();

        var now = DateTime.UtcNow;
        await db.ChatMessages
            .Where(m => m.ChatId == chatId && m.SenderId != userId && m.ReadAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.ReadAt, now));

        return NoContent();
    }

    /// <summary>
    /// Creates or gets a chat for a given item.
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType<ChatResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
        
        var chatWasCreated = false;

        if (chat == null)
        {
            var nextNumber = await db.Chats.Where(c => c.ItemId == req.ItemId).CountAsync() + 1;
            chat = new Chat
            {
                ItemId = req.ItemId,
                ItemOwnerId = item.CreatedByUserId,
                InquirerId = userId,
                ItemChatCount = nextNumber
            };

            db.Chats.Add(chat);
            await db.SaveChangesAsync();

            chatWasCreated = true;
        }

        var inquirerResponse = await GetChatResponseAsync(chat.Id, userId);

        if (chatWasCreated)
        {
            try
            {
                var ownerResponse = await GetChatResponseAsync(chat.Id, chat.ItemOwnerId);

                await chatHub.Clients.User(chat.ItemOwnerId.ToString()).SendAsync("ChatCreated", ownerResponse);

                await chatHub.Clients.User(chat.InquirerId.ToString()).SendAsync("ChatCreated", inquirerResponse);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send chat {ChatId} to SignalR clients for item {ItemId}", chat.Id, req.ItemId);
            }
        }

        return inquirerResponse;
    }

    private async Task<ChatResponse> GetChatResponseAsync(Guid chatId, Guid currentUserId)
    {
        return await ChatResponses(db.Chats
            .Where(c => c.Id == chatId), currentUserId)
            .FirstAsync();
    }

    /// <summary>
    /// Gets all chats of the authenticated user, both as an inquirer and as an item owner.
    /// </summary>

    [HttpGet]
    [Authorize]
    [ProducesResponseType<List<ChatResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<ChatResponse>>> GetMine()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        return await ChatResponses(db.Chats
            .Where(c => c.ItemOwnerId == userId || c.InquirerId == userId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt), userId)
            .ToListAsync();
    }

    /// <summary>
    /// Sends a message in a chat. Only the inquirer and the item owner can send messages in the chat.
    /// </summary>
    [HttpPost("{chatId:guid}/messages")]
    [Authorize]
    [ProducesResponseType<ChatMessageResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ChatMessageResponse>> SendMessage([FromBody] SendMessageRequest req, Guid chatId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var chat = await db.Chats
            .Include(c => c.Item)
            .FirstOrDefaultAsync(c => c.Id == chatId);
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

        var response = new ChatMessageResponse(
            message.Id,
            message.ChatId,
            message.SenderId,
            message.Body,
            message.CreatedAt,
            chat.Item.Title
            );

        try
        {
            await chatHub.Clients.Users(new[]
            { 
                chat.ItemOwnerId.ToString(), 
                chat.InquirerId.ToString() 
            }).SendAsync("MessageCreated", response);
        }
        catch (Exception ex )
        {
            logger.LogError(ex, "Failed to send message {MessageId} to SignalR clients for chat {ChatId}", message.Id, chatId);
        }

        return response;
    }

    /// <summary>
    /// Gets all messages of a chat. Only the inquirer and the item owner can see the messages in the chat.
    /// </summary>
    [HttpGet("{chatId:guid}/messages")]
    [Authorize]
    [ProducesResponseType<List<ChatMessageResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
                m.CreatedAt,
                m.Chat.Item.Title
            ))
            .ToListAsync();

        return messages;


    }

      private IQueryable<ChatResponse> ChatResponses(IQueryable<Chat> chats, Guid currentUserId) =>
         chats.Select(c => new ChatResponse(
             c.Id,
             c.ItemId,
             c.Item.Title,
             c.Item.Type,
             c.Item.LocationLabel,
             c.Item.OccurredAt,
             c.ItemOwnerId == currentUserId,
             c.ItemOwnerId == currentUserId ? c.ItemChatCount : null,
             c.CreatedAt,
             c.LastMessageAt,
             c.Messages.Count(m => m.SenderId != currentUserId && m.ReadAt == null),
             db.ItemImages
                 .Where(i => i.ItemId == c.ItemId && i.UploadStatus == UploadStatus.Uploaded)
                 .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id)
                 .Select(i => (Guid?)i.Id)
                 .FirstOrDefault(),
             db.ItemImages
                 .Where(i => i.ItemId == c.ItemId && i.UploadStatus == UploadStatus.Uploaded)
                 .OrderBy(i => i.CreatedAt).ThenBy(i => i.Id)
                 .Select(i => i.BlurDataUrl)
                 .FirstOrDefault()
             ));
}


public record CreateChatRequest(Guid ItemId);

public record ChatResponse(
    Guid Id,
    Guid ItemId,
    string ItemTitle,
    string ItemType,
    string? ItemLocationLabel,
    DateOnly ItemOccurredAt,
    bool IsItemOwner,
    int? ItemChatCount, 
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    int? UnreadCount,
    Guid? ImageId,
    string? ImageBlurDataUrl
    );

public record SendMessageRequest(
     [Required, MaxLength(2000)] string Body
 );

public record ChatMessageResponse(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Body,
    DateTime CreatedAt,
    string ItemTitle
    );

public record UnreadCountResponse(int? Count);
