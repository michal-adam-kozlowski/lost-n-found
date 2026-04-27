namespace LostNFound.Api.Services;

public interface IItemDeletionService
{
    Task DeleteItemAsync(Guid itemId);
}
