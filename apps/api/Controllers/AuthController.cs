using LostNFound.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(UserManager<ApplicationUser> userManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest req)
    {
        var user = new ApplicationUser
        {
            Email = req.Email,
            UserName = req.Email
        };

        var result = await userManager.CreateAsync(user, req.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { errors });
        }

        return Created("/api/auth/register", new RegisterUserResponse(user.Id, req.Email));
    }
}

public record RegisterUserRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);
public record RegisterUserResponse(Guid Id, string Email);
