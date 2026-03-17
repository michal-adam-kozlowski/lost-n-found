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
    [ProducesResponseType<RegisterUserResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RegisterUserResponse>> Register([FromBody] RegisterUserRequest req)
    {
        var user = new ApplicationUser
        {
            Email = req.Email,
            UserName = req.Email
        };

        var result = await userManager.CreateAsync(user, req.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        return Created("/api/auth/register", new RegisterUserResponse(user.Id, req.Email));
    }

    [ProducesResponseType<LoginUserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [HttpPost("login")]
    public async Task<ActionResult<LoginUserResponse>> Login([FromBody] LoginUserRequest req)
    {
        var user = await userManager.FindByEmailAsync(req.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, req.Password))
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Invalid email or password");
        }

        return Ok(new LoginUserResponse(user.Id, user.Email!));
    }
}

public record RegisterUserRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);
public record RegisterUserResponse(Guid Id, string Email);

public record LoginUserRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
public record LoginUserResponse(Guid Id, string Email);