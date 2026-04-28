using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtTokenService jwtTokenService) : ControllerBase
{
    /// <summary>
    /// Registers a new user and returns a JWT access token.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType<LoginUserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginUserResponse>> Register([FromBody] RegisterUserRequest req)
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

        var token = await jwtTokenService.CreateTokenAsync(user);

        return Ok(new LoginUserResponse(token.AccessToken, token.ExpiresAtUtc, user.Id, user.Email!));
    }

    /// <summary>
    /// Logs in a user and returns a JWT access token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType<LoginUserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginUserResponse>> Login([FromBody] LoginUserRequest req)
    {
        var user = await userManager.FindByEmailAsync(req.Email);

        if (user == null || user.IsBlocked)
            return UnauthorizedProblem();

        var signInResult = await signInManager.CheckPasswordSignInAsync(user, req.Password, false);

        if (!signInResult.Succeeded)
            return UnauthorizedProblem();

        var token = await jwtTokenService.CreateTokenAsync(user);

        return Ok(new LoginUserResponse(token.AccessToken, token.ExpiresAtUtc, user.Id, user.Email!));
    }

    /// <summary>
    /// Test endpoint that verifies the bearer token and returns the current user.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<CurrentUserResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<CurrentUserResponse> Me()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var emailClaim = User.FindFirstValue(ClaimTypes.Email);

        if (!Guid.TryParse(userIdClaim, out var userId) || string.IsNullOrWhiteSpace(emailClaim))
        {
            return UnauthorizedProblem();
        }

        return Ok(new CurrentUserResponse(userId, emailClaim));
    }

    private ObjectResult UnauthorizedProblem()
    {
        return Problem(
            statusCode: StatusCodes.Status401Unauthorized,
            title: "Unauthorized",
            detail: "Invalid email or password");
    }

}

public record RegisterUserRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);

public record LoginUserRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
public record LoginUserResponse(string AccessToken, DateTime ExpiresAtUtc, Guid Id, string Email);

public record CurrentUserResponse(Guid UserId, string Email);