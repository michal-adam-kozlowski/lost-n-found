using LostNFound.Api.Data;
using LostNFound.Api.Hubs;
using LostNFound.Api.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Services;

public class ItemDeletionService(AppDbContext db, IFileStorageService storage, IHubContext<ChatHub> chatHub, ILogger<ItemDeletionService> logger) : IItemDeletionService
{
    public async Task DeleteItemAsync(Guid itemId)
    {
        var item = await db.Items.FindAsync(itemId);
        if (item == null)
        {
            throw new KeyNotFoundException($"No item found with id {itemId}");
        }

        var chats = await db.Chats
            .Where(c => c.ItemId == itemId)
            .Select(c => new { c.Id, c.ItemOwnerId, c.InquirerId })
            .ToListAsync();

        var images = await db.ItemImages
            .Where(x => x.ItemId == itemId && x.UploadStatus != UploadStatus.Deleted)
            .Select(x => new { x.ObjectKey, x.ThumbnailObjectKey })
            .ToListAsync();

        db.Items.Remove(item);
        await db.SaveChangesAsync();

        foreach (var chat in chats)
        {
            try
            {
                var payload = new { chatId = chat.Id, itemId, itemTitle = item.Title };
                await chatHub.Clients
                    .Users(chat.ItemOwnerId.ToString(), chat.InquirerId.ToString())
                    .SendAsync("ChatDeleted", payload);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send ChatDeleted notification for chat {ChatId}", chat.Id);
            }
        }

        foreach (var image in images)
        {
            await DeleteStorageObjectAsync(image.ObjectKey, itemId);

            if (!string.IsNullOrWhiteSpace(image.ThumbnailObjectKey))
            {
                await DeleteStorageObjectAsync(image.ThumbnailObjectKey, itemId);
            }
        }
    }

    private async Task DeleteStorageObjectAsync(string objectKey, Guid itemId)
    {
        try
        {
            await storage.DeleteObjectAsync(objectKey);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete storage object {ObjectKey} for item {ItemId}", objectKey, itemId);
        }
    }

}

