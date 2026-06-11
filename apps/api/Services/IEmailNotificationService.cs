namespace LostNFound.Api.Services;

public interface IEmailNotificationService
{
    Task EnqueueChatMessageNotificationAsync(Guid chatId, Guid senderId);
    Task EnqueueChatCreatedNotificationAsync(Guid chatId);
    Task EnqueueItemMatchNotificationsAsync(Guid newItemId);
    Task EnqueueEmailVerificationNotificationAsync(Guid userId, string token);
    Task EnqueuePasswordResetNotificationAsync(Guid userId, string token);
    Task EnqueueUserBlockedNotificationAsync(Guid userId);
    Task EnqueueItemRemovedNotificationAsync(Guid itemId, Guid ownerId);
    Task EnqueueItemRemovedNotificationAsync(string itemTitle, Guid ownerId);
}
