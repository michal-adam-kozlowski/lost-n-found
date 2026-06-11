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
public class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IJwtTokenService jwtTokenService,
    IEmailNotificationService emailNotificationService) : ControllerBase
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

        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        await emailNotificationService.EnqueueEmailVerificationNotificationAsync(user.Id, emailToken);

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

        if (user == null || user.BlockedAt != null)
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

    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        // Always return 200 to prevent email enumeration
        if (user is null) return Ok();

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        await emailNotificationService.EnqueuePasswordResetNotificationAsync(user.Id, token);

        return Ok();
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Problem(statusCode: 400, title: "Błąd", detail: "Nieprawidłowy token resetowania hasła.");

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);
            return ValidationProblem(ModelState);
        }

        return Ok();
    }

    [HttpGet("confirm-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmEmail([FromQuery] Guid userId, [FromQuery] string token)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Problem(statusCode: 400, title: "Błąd", detail: "Nieprawidłowy link weryfikacyjny.");

        var result = await userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
            return Problem(statusCode: 400, title: "Błąd", detail: "Nieprawidłowy lub wygasły token weryfikacyjny.");

        return Ok();
    }

    private ObjectResult UnauthorizedProblem()
    {
        return Problem(
            statusCode: StatusCodes.Status401Unauthorized,
            title: "Unauthorized",
            detail: "Nieprawidłowy adres e-mail lub hasło");
    }

}

public record RegisterUserRequest(
    [Required(ErrorMessage = "Pole jest wymagane."), EmailAddress(ErrorMessage = "Nieprawidłowy adres e-mail.")] string Email,
    [Required(ErrorMessage = "Pole jest wymagane."), MinLength(6, ErrorMessage = "Hasło musi mieć co najmniej 6 znaków.")] string Password
);

public record LoginUserRequest(
    [Required(ErrorMessage = "Pole jest wymagane."), EmailAddress(ErrorMessage = "Nieprawidłowy adres e-mail.")] string Email,
    [Required(ErrorMessage = "Pole jest wymagane.")] string Password
);
public record LoginUserResponse(string AccessToken, DateTime ExpiresAtUtc, Guid Id, string Email);

public record CurrentUserResponse(Guid UserId, string Email);

public record ForgotPasswordRequest([Required, EmailAddress] string Email);
public record ResetPasswordRequest([Required, EmailAddress] string Email, [Required] string Token, [Required, MinLength(6)] string NewPassword);
