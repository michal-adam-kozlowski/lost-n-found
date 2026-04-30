using Microsoft.AspNetCore.Identity;

namespace LostNFound.Api.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public DateTime? BlockedAt { get; set; } 
    }
}
