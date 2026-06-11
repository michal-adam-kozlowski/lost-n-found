namespace LostNFound.Api.Services;

public class LoggingEmailSender(ILogger<LoggingEmailSender> logger) : IEmailSender
{
    public Task<bool> SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default)
    {
        logger.LogInformation(
            "📧 [DEV] Email to: {To}\n   Subject: {Subject}\n   Body length: {Length} chars",
            to, subject, htmlBody.Length);

        return Task.FromResult(true);
    }
}
