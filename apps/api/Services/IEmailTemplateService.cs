namespace LostNFound.Api.Services;

public record EmailTemplate(string Subject, string HtmlBody);

public interface IEmailTemplateService
{
    EmailTemplate Render(string notificationType, string payloadJson);
}
