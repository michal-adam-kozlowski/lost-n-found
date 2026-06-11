using LostNFound.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Services;

public class EmailProcessingBackgroundService(
    IServiceScopeFactory scopeFactory,
    IEmailTemplateService templateService,
    ILogger<EmailProcessingBackgroundService> logger) : BackgroundService
{
    private static readonly TimeSpan PollingInterval = TimeSpan.FromSeconds(10);
    private static readonly int[] BackoffSeconds = [0, 10, 30, 90];

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Email processing background service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingNotificationsAsync(stoppingToken);
                await Task.Delay(PollingInterval, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in email processing loop");
                await Task.Delay(PollingInterval, stoppingToken);
            }
        }
    }

    private async Task ProcessPendingNotificationsAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

        var pending = await db.NotificationQueue
            .Where(n => n.Status == "pending" && n.Attempts < 3)
            .OrderBy(n => n.CreatedAt)
            .Take(20)
            .ToListAsync(ct);

        foreach (var notification in pending)
        {
            // Exponential backoff check
            if (notification.LastAttemptAt.HasValue && notification.Attempts < BackoffSeconds.Length)
            {
                var backoff = TimeSpan.FromSeconds(BackoffSeconds[notification.Attempts]);
                if (DateTime.UtcNow - notification.LastAttemptAt.Value < backoff)
                    continue;
            }

            try
            {
                var template = templateService.Render(notification.Type, notification.Payload);
                var sent = await emailSender.SendAsync(
                    notification.RecipientEmail,
                    template.Subject,
                    template.HtmlBody,
                    ct);

                notification.LastAttemptAt = DateTime.UtcNow;

                if (sent)
                {
                    notification.Status = "sent";
                    notification.ProcessedAt = DateTime.UtcNow;
                    logger.LogInformation("Sent {Type} email to {Email}", notification.Type, notification.RecipientEmail);
                }
                else
                {
                    notification.Attempts++;
                    notification.Error = "Resend API returned non-success status";
                    if (notification.Attempts >= 3)
                    {
                        notification.Status = "failed";
                        notification.ProcessedAt = DateTime.UtcNow;
                    }
                    logger.LogWarning("Failed to send {Type} email to {Email} (attempt {Attempt})",
                        notification.Type, notification.RecipientEmail, notification.Attempts);
                }
            }
            catch (Exception ex)
            {
                notification.Attempts++;
                notification.LastAttemptAt = DateTime.UtcNow;
                notification.Error = ex.Message;
                if (notification.Attempts >= 3)
                {
                    notification.Status = "failed";
                    notification.ProcessedAt = DateTime.UtcNow;
                }
                logger.LogError(ex, "Exception sending {Type} email to {Email} (attempt {Attempt})",
                    notification.Type, notification.RecipientEmail, notification.Attempts);
            }
        }

        await db.SaveChangesAsync(ct);
    }
}
