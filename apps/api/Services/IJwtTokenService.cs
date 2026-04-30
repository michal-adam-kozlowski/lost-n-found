using LostNFound.Api.Models;

namespace LostNFound.Api.Services
{
    public interface IJwtTokenService
    {
        Task<JwtTokenResult> CreateTokenAsync(ApplicationUser user);
    }
    public record JwtTokenResult(string AccessToken, DateTime ExpiresAtUtc);
}
