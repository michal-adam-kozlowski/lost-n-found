using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace LostNFound.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
}
