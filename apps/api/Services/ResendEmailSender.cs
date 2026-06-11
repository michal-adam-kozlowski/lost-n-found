using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using LostNFound.Api.Configuration;
using Microsoft.Extensions.Options;

namespace LostNFound.Api.Services;

public class ResendEmailSender(HttpClient httpClient, IOptions<ResendOptions> options, ILogger<ResendEmailSender> logger) : IEmailSender
{
    private readonly ResendOptions _options = options.Value;

    public async Task<bool> SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default)
    {
        var payload = new
        {
            from = $"{_options.FromName} <{_options.FromEmail}>",
            to = new[] { to },
            subject,
            html = htmlBody
        };

        var json = JsonSerializer.Serialize(payload);

        var request = new HttpRequestMessage(HttpMethod.Post, "/emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            logger.LogError("Resend API error {StatusCode}: {Body}", response.StatusCode, body);
            return false;
        }

        return true;
    }
}
