using System.Text.Json;
using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Services;

public class EmailNotificationService(AppDbContext db, ILogger<EmailNotificationService> logger) : IEmailNotificationService
{
    public async Task EnqueueChatMessageNotificationAsync(Guid chatId, Guid senderId)
    {
        var chat = await db.Chats
            .Include(c => c.Item)
            .Include(c => c.ItemOwner)
            .Include(c => c.Inquirer)
            .FirstOrDefaultAsync(c => c.Id == chatId);

        if (chat is null) return;

        var recipientId = chat.ItemOwnerId == senderId ? chat.InquirerId : chat.ItemOwnerId;
        var recipient = chat.ItemOwnerId == senderId ? chat.Inquirer : chat.ItemOwner;

        // Dedup: skip if a pending chat_message notification already exists for this recipient
        // (any pending chat_message for the same recipient is enough — avoids email spam)
        var alreadyPending = await db.NotificationQueue.AnyAsync(n =>
            n.Type == "chat_message" &&
            n.RecipientUserId == recipientId &&
            n.Status == "pending");

        if (alreadyPending) return;

        var lastMessage = await db.ChatMessages
            .Where(m => m.ChatId == chatId && m.SenderId == senderId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => m.Body)
            .FirstOrDefaultAsync();

        var sender = chat.ItemOwnerId == senderId ? chat.ItemOwner : chat.Inquirer;

        await EnqueueAsync(recipientId, recipient.Email!, "chat_message", new
        {
            chatId,
            senderEmail = sender.Email,
            itemTitle = chat.Item.Title,
            messagePreview = lastMessage?.Length > 100 ? lastMessage[..100] + "..." : lastMessage ?? ""
        });
    }

    public async Task EnqueueChatCreatedNotificationAsync(Guid chatId)
    {
        var chat = await db.Chats
            .Include(c => c.Item)
            .Include(c => c.ItemOwner)
            .Include(c => c.Inquirer)
            .FirstOrDefaultAsync(c => c.Id == chatId);

        if (chat is null) return;

        await EnqueueAsync(chat.ItemOwnerId, chat.ItemOwner.Email!, "chat_created", new
        {
            itemTitle = chat.Item.Title,
            inquirerEmail = chat.Inquirer.Email
        });
    }

    public async Task EnqueueItemMatchNotificationsAsync(Guid newItemId)
    {
        var newItem = await db.Items
            .Include(i => i.CreatedByUser)
            .FirstOrDefaultAsync(i => i.Id == newItemId);

        if (newItem?.Location is null) return;

        var oppositeType = newItem.Type == "lost" ? "found" : "lost";

        // Raw SQL for trigram similarity + geography distance — not expressible in EF LINQ
        var matches = await db.Database.SqlQueryRaw<ItemMatchResult>(
            """
            SELECT i."Id" AS "ItemId", i."Title" AS "ItemTitle", i."CreatedByUserId", u."Email"
            FROM "Items" i
            JOIN "AspNetUsers" u ON u."Id" = i."CreatedByUserId"
            WHERE i."Type" = {0}
              AND i."Id" != {1}
              AND i."CreatedByUserId" != {2}
              AND i."Location" IS NOT NULL
              AND (
                similarity(i."Title", {3}) >= 0.3
                OR (i."Description" IS NOT NULL AND similarity(i."Description", {4}) >= 0.3)
              )
              AND u."BlockedAt" IS NULL
              AND ST_DWithin(i."Location"::geography, {5}::geography, 1000)
            """,
            oppositeType,
            newItemId,
            newItem.CreatedByUserId,
            newItem.Title,
            newItem.Description ?? "",
            newItem.Location
        ).ToListAsync();

        foreach (var match in matches)
        {
            await EnqueueAsync(match.CreatedByUserId, match.Email, "item_match", new
            {
                newItemTitle = newItem.Title,
                matchedItemTitle = match.ItemTitle,
                newItemType = newItem.Type
            });
        }
    }

    public async Task EnqueueEmailVerificationNotificationAsync(Guid userId, string token)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return;

        await EnqueueAsync(userId, user.Email!, "email_verification", new
        {
            userId = userId.ToString(),
            token
        });
    }

    public async Task EnqueuePasswordResetNotificationAsync(Guid userId, string token)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return;

        await EnqueueAsync(userId, user.Email!, "password_reset", new
        {
            email = user.Email,
            token
        });
    }

    public async Task EnqueueUserBlockedNotificationAsync(Guid userId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return;

        await EnqueueAsync(userId, user.Email!, "user_blocked", new { });
    }

    public async Task EnqueueItemRemovedNotificationAsync(Guid itemId, Guid ownerId)
    {
        var item = await db.Items.FindAsync(itemId);
        var user = await db.Users.FindAsync(ownerId);
        if (item is null || user is null) return;

        await EnqueueAsync(ownerId, user.Email!, "item_removed", new
        {
            itemTitle = item.Title
        });
    }

    public async Task EnqueueItemRemovedNotificationAsync(string itemTitle, Guid ownerId)
    {
        var user = await db.Users.FindAsync(ownerId);
        if (user is null) return;

        await EnqueueAsync(ownerId, user.Email!, "item_removed", new
        {
            itemTitle
        });
    }

    private async Task EnqueueAsync(Guid recipientUserId, string recipientEmail, string type, object payload)
    {
        var notification = new NotificationQueue
        {
            Id = Guid.NewGuid(),
            RecipientUserId = recipientUserId,
            RecipientEmail = recipientEmail,
            Type = type,
            Payload = JsonSerializer.Serialize(payload),
            Status = "pending",
            Attempts = 0,
            CreatedAt = DateTime.UtcNow
        };

        db.NotificationQueue.Add(notification);
        await db.SaveChangesAsync();

        logger.LogInformation("Enqueued {Type} notification for {Email}", type, recipientEmail);
    }
}

// Internal DTO for the raw SQL item match query result
public class ItemMatchResult
{
    public Guid ItemId { get; set; }
    public string ItemTitle { get; set; } = string.Empty;
    public Guid CreatedByUserId { get; set; }
    public string Email { get; set; } = string.Empty;
}
