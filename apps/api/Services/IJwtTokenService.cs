using LostNFound.Api.Models;

namespace LostNFound.Api.Services
{
    public interface IJwtTokenService
    {
        JwtTokenResult CreateToken(ApplicationUser user);
    }
    public record JwtTokenResult(string AccessToken, DateTime ExpiresAtUtc);
}
