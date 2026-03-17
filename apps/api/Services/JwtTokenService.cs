using LostNFound.Api.Configuration;
using LostNFound.Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LostNFound.Api.Services
{
    public class JwtTokenService(IOptions<JwtOptions> jwtOptions) : IJwtTokenService
    {
        private readonly JwtOptions jwt = jwtOptions.Value;

        public JwtTokenResult CreateToken(ApplicationUser user)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new InvalidOperationException("User email is required to issue a JWT.");
            }

            var expiresAtUtc = DateTime.UtcNow.AddMinutes(jwt.DurationInMinutes);

            var claims = new List<Claim>
          {
              new(ClaimTypes.NameIdentifier, user.Id.ToString()),
              new(ClaimTypes.Email, user.Email)
          };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwt.Issuer,
                audience: jwt.Audience,
                claims: claims,
                expires: expiresAtUtc,
                signingCredentials: signingCredentials);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new JwtTokenResult(accessToken, expiresAtUtc);
        }
    }
}
