using System.Net;
using System.Text.Json;

namespace LostNFound.Api.Services;

public class EmailTemplateService(IConfiguration configuration) : IEmailTemplateService
{
    private string FrontendUrl => configuration["FRONTEND_URL"] ?? "http://localhost:3000";

    public EmailTemplate Render(string notificationType, string payloadJson)
    {
        var payload = JsonSerializer.Deserialize<JsonElement>(payloadJson);

        return notificationType switch
        {
            "chat_message" => RenderChatMessage(payload),
            "chat_created" => RenderChatCreated(payload),
            "item_match" => RenderItemMatch(payload),
            "email_verification" => RenderEmailVerification(payload),
            "password_reset" => RenderPasswordReset(payload),
            "user_blocked" => RenderUserBlocked(),
            "item_removed" => RenderItemRemoved(payload),
            _ => throw new ArgumentException($"Unknown notification type: {notificationType}")
        };
    }

    private static EmailTemplate RenderChatMessage(JsonElement p)
    {
        var rawSenderName = p.GetProperty("senderEmail").GetString()!;
        var rawItemTitle = p.GetProperty("itemTitle").GetString()!;
        var rawMessagePreview = p.GetProperty("messagePreview").GetString()!;

        var senderName = WebUtility.HtmlEncode(rawSenderName);
        var itemTitle = WebUtility.HtmlEncode(rawItemTitle);
        var messagePreview = WebUtility.HtmlEncode(rawMessagePreview);

        var subject = $"Nowa wiadomość w sprawie: {rawItemTitle}";
        var html = WrapHtml($"""
            <h2>Nowa wiadomość</h2>
            <p><strong>{senderName}</strong> wysłał(a) Ci wiadomość w sprawie: <strong>{itemTitle}</strong></p>
            <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">{messagePreview}</blockquote>
            <p>Zaloguj się, aby odpowiedzieć.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private static EmailTemplate RenderChatCreated(JsonElement p)
    {
        var rawItemTitle = p.GetProperty("itemTitle").GetString()!;
        var rawInquirerEmail = p.GetProperty("inquirerEmail").GetString()!;

        var itemTitle = WebUtility.HtmlEncode(rawItemTitle);
        var inquirerEmail = WebUtility.HtmlEncode(rawInquirerEmail);

        var subject = $"Ktoś zainteresował się Twoim przedmiotem: {rawItemTitle}";
        var html = WrapHtml($"""
            <h2>Nowy czat</h2>
            <p>Użytkownik <strong>{inquirerEmail}</strong> zainteresował się Twoim przedmiotem: <strong>{itemTitle}</strong></p>
            <p>Zaloguj się, aby sprawdzić wiadomość.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private static EmailTemplate RenderItemMatch(JsonElement p)
    {
        var rawNewItemTitle = p.GetProperty("newItemTitle").GetString()!;
        var rawMatchedItemTitle = p.GetProperty("matchedItemTitle").GetString()!;
        var newItemType = p.GetProperty("newItemType").GetString()!;

        var newItemTitle = WebUtility.HtmlEncode(rawNewItemTitle);
        var matchedItemTitle = WebUtility.HtmlEncode(rawMatchedItemTitle);

        var typeLabel = newItemType == "found" ? "znaleziony" : "zgubiony";
        var subject = $"Znaleźliśmy podobny przedmiot do Twojego: {rawNewItemTitle}";
        var html = WrapHtml($"""
            <h2>Możliwe dopasowanie</h2>
            <p>Nowy {typeLabel} przedmiot <strong>{newItemTitle}</strong> pasuje do Twojego ogłoszenia <strong>{matchedItemTitle}</strong>.</p>
            <p>Zaloguj się, aby sprawdzić szczegóły.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private EmailTemplate RenderEmailVerification(JsonElement p)
    {
        var userId = p.GetProperty("userId").GetString()!;
        var token = p.GetProperty("token").GetString()!;
        var encodedToken = Uri.EscapeDataString(token);
        var link = $"{FrontendUrl}/confirm-email?userId={userId}&token={encodedToken}";

        var subject = "Potwierdź swój adres email — LostNFound";
        var html = WrapHtml($"""
            <h2>Weryfikacja email</h2>
            <p>Kliknij poniższy link, aby potwierdzić swój adres email:</p>
            <p><a href="{link}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Potwierdź email</a></p>
            <p style="color: #888; font-size: 12px;">Jeśli nie zakładałeś/aś konta, zignoruj tę wiadomość.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private EmailTemplate RenderPasswordReset(JsonElement p)
    {
        var email = p.GetProperty("email").GetString()!;
        var token = p.GetProperty("token").GetString()!;
        var encodedToken = Uri.EscapeDataString(token);
        var link = $"{FrontendUrl}/reset-password?email={Uri.EscapeDataString(email)}&token={encodedToken}";

        var subject = "Reset hasła — LostNFound";
        var html = WrapHtml($"""
            <h2>Reset hasła</h2>
            <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
            <p><a href="{link}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Resetuj hasło</a></p>
            <p style="color: #888; font-size: 12px;">Jeśli nie prosiłeś/aś o reset hasła, zignoruj tę wiadomość.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private static EmailTemplate RenderUserBlocked()
    {
        var subject = "Twoje konto zostało zablokowane — LostNFound";
        var html = WrapHtml("""
            <h2>Konto zablokowane</h2>
            <p>Twoje konto w serwisie LostNFound zostało zablokowane przez administratora.</p>
            <p>Jeśli uważasz, że to pomyłka, skontaktuj się z administracją.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private static EmailTemplate RenderItemRemoved(JsonElement p)
    {
        var rawItemTitle = p.GetProperty("itemTitle").GetString()!;
        var itemTitle = WebUtility.HtmlEncode(rawItemTitle);

        var subject = $"Twoje ogłoszenie zostało usunięte: {rawItemTitle}";
        var html = WrapHtml($"""
            <h2>Ogłoszenie usunięte</h2>
            <p>Twoje ogłoszenie <strong>{itemTitle}</strong> zostało usunięte przez administratora.</p>
            <p>Jeśli uważasz, że to pomyłka, skontaktuj się z administracją.</p>
            """);

        return new EmailTemplate(subject, html);
    }

    private static string WrapHtml(string content)
    {
        return $"""
            <!DOCTYPE html>
            <html lang="pl">
            <head><meta charset="utf-8"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            {content}
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;">
            <p style="color: #999; font-size: 12px;">LostNFound — wirtualne biuro rzeczy znalezionych</p>
            </body>
            </html>
            """;
    }
}
