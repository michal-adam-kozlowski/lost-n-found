using Microsoft.AspNetCore.Identity;

namespace LostNFound.Api.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public bool IsBlocked { get; set; }
        public DateTime? BlockedAt { get; set; } 
    }
}
