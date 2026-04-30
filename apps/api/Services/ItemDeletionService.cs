using LostNFound.Api.Data;
using LostNFound.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Services;

public class ItemDeletionService(AppDbContext db, IFileStorageService storage, ILogger<ItemDeletionService> logger) : IItemDeletionService
{
    public async Task DeleteItemAsync(Guid itemId)
    {
        var item = await db.Items.FindAsync(itemId);
        if (item == null)
        {
            throw new KeyNotFoundException($"No item found with id {itemId}");
        }

        var images = await db.ItemImages
            .Where(x => x.ItemId == itemId && x.UploadStatus != UploadStatus.Deleted)
            .Select(x => new { x.ObjectKey, x.ThumbnailObjectKey })
            .ToListAsync();

        //ItemImage rows will cascade delete with the item
        db.Items.Remove(item);
        await db.SaveChangesAsync();

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

