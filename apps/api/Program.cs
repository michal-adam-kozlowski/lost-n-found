using LostNFound.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Kestrel: honour Railway's PORT env var (falls back to 8080 locally) ──────
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── Database ──────────────────────────────────────────────────────────────────
var connectionString = ResolveConnectionString(builder.Configuration);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ── CORS ──────────────────────────────────────────────────────────────────────
// Set CORS_ORIGINS in Railway to your frontend URL (comma-separated if multiple).
// Example: https://my-app.up.railway.app,https://custom-domain.com
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS") ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()));

// ── MVC + Swagger ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Auto-migrate + seed on startup ───────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await DbSeeder.SeedAsync(db);
}

// ── Middleware ────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// ── Routes ────────────────────────────────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
app.MapControllers();

app.Run();

// ── Helpers ───────────────────────────────────────────────────────────────────

/// <summary>
/// Resolves an Npgsql-compatible connection string from configuration.
/// Priority:
///   1. ConnectionStrings:Default  (env var: ConnectionStrings__Default)
///   2. DATABASE_URL               (Railway's auto-provisioned postgres:// URI)
/// </summary>
static string ResolveConnectionString(IConfiguration config)
{
    var connStr = config.GetConnectionString("Default");
    if (!string.IsNullOrWhiteSpace(connStr))
        return connStr;

    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrWhiteSpace(databaseUrl))
        throw new InvalidOperationException(
            "No database connection string found. " +
            "Set either 'ConnectionStrings__Default' (Npgsql key=value format) " +
            "or 'DATABASE_URL' (postgres:// URI) as an environment variable.");

    return ConvertDatabaseUrl(databaseUrl);
}

/// <summary>
/// Converts a postgres:// or postgresql:// URI into an Npgsql key=value connection string.
/// Handles URL-encoded passwords and adds SSL settings required by Railway.
/// </summary>
static string ConvertDatabaseUrl(string databaseUrl)
{
    // If it doesn't look like a URI, assume it's already a valid Npgsql string.
    if (!databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !databaseUrl.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return databaseUrl;
    }

    var uri = new Uri(databaseUrl);

    // UserInfo is "username:password" — split on the first colon only.
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;

    var host     = uri.Host;
    var port     = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');

    // Railway PostgreSQL requires SSL; Trust Server Certificate avoids cert-chain issues.
    return $"Host={host};Port={port};Database={database};" +
           $"Username={username};Password={password};" +
           "Ssl Mode=Require;Trust Server Certificate=true";
}
