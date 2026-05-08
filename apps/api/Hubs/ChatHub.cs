using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using LostNFound.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Hubs;

[Authorize]
public class ChatHub(AppDbContext db) : Hub
{
    public async Task JoinChat(Guid chatId)
    {
        var userIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new HubException("Unauthorized");
        }

        var canJoin = await db.Chats.AnyAsync(c => c.Id == chatId && (c.InquirerId == userId || c.ItemOwnerId == userId));
        if (!canJoin)
        {
            throw new HubException("Chat not found.");  
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString()); 

    }

    public async Task LeaveChat(Guid chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
    }
}
