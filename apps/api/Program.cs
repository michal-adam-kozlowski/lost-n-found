using Amazon.S3;
using LostNFound.Api.Configuration;
using LostNFound.Api.Data;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Railway injects PORT at runtime; falls back to 8080 locally.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var connectionString = ResolveConnectionString(builder.Configuration);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddIdentityCore<ApplicationUser>(options =>
      {
          options.User.RequireUniqueEmail = true;

          // change password reqs and lockout policy
          options.Password.RequireDigit = false;
          options.Password.RequireLowercase = false;
          options.Password.RequireUppercase = false;
          options.Password.RequireNonAlphanumeric = false;
          options.Password.RequiredLength = 6;
      })
      .AddRoles<IdentityRole<Guid>>()
      .AddEntityFrameworkStores<AppDbContext>()
      .AddSignInManager();

// ── Storage (S3-compatible) ───────────────────────────────────────────────
builder.Services.AddOptions<StorageOptions>()
    .Configure(o =>
    {
        o.EndpointUrl = Environment.GetEnvironmentVariable("AWS_ENDPOINT_URL") ?? "";
        o.BucketName = Environment.GetEnvironmentVariable("AWS_S3_BUCKET_NAME") ?? "";
        o.Region = Environment.GetEnvironmentVariable("AWS_DEFAULT_REGION") ?? "";
        o.AccessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? "";
        o.SecretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? "";
    })
    .Validate(o => !string.IsNullOrWhiteSpace(o.EndpointUrl), "AWS_ENDPOINT_URL is required.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.BucketName), "AWS_S3_BUCKET_NAME is required.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.AccessKeyId), "AWS_ACCESS_KEY_ID is required.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.SecretAccessKey), "AWS_SECRET_ACCESS_KEY is required.")
    .ValidateOnStart();

builder.Services.AddOptions<UploadOptions>()
    .Configure(o =>
    {
        var maxSize = Environment.GetEnvironmentVariable("UPLOAD_MAX_FILE_SIZE_MB");
        if (int.TryParse(maxSize, out var mb)) o.MaxFileSizeMb = mb;
        var mimeTypes = Environment.GetEnvironmentVariable("UPLOAD_ALLOWED_MIME_TYPES");
        if (!string.IsNullOrWhiteSpace(mimeTypes))
            o.AllowedMimeTypes = mimeTypes.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var expiry = Environment.GetEnvironmentVariable("UPLOAD_PRESIGNED_URL_EXPIRY_SECONDS");
        if (int.TryParse(expiry, out var s)) o.PresignedUrlExpirySeconds = s;
        var prefix = Environment.GetEnvironmentVariable("UPLOAD_OBJECT_PREFIX");
        if (!string.IsNullOrWhiteSpace(prefix)) o.ObjectPrefix = prefix;
    });

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var opts = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<StorageOptions>>().Value;
    var config = new AmazonS3Config
    {
        ServiceURL = opts.EndpointUrl,
        ForcePathStyle = true, // Required for S3-compatible providers (Railway, MinIO, etc.)
    };
    return new AmazonS3Client(opts.AccessKeyId, opts.SecretAccessKey, config);
});

builder.Services.AddSingleton<IFileStorageService, S3FileStorageService>();
builder.Services.AddScoped<IItemImageService, ItemImageService>();

// CORS_ORIGINS accepts a comma-separated list of allowed origins (e.g. the Railway frontend URL).
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS") ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlPath = Path.Combine(AppContext.BaseDirectory, "LostNFound.Api.xml");
    options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var pending = (await db.Database.GetPendingMigrationsAsync()).ToList();
    app.Logger.LogInformation("Pending EF migrations: {Count} ({Names})",
        pending.Count,
        pending.Count == 0 ? "none" : string.Join(", ", pending));

    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
app.MapControllers();

app.Run();


static string ResolveConnectionString(IConfiguration config)
{
    var connStr = config.GetConnectionString("Default");
    if (!string.IsNullOrWhiteSpace(connStr))
        return connStr.Trim();

    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrWhiteSpace(databaseUrl))
        throw new InvalidOperationException(
            "No database connection string found. " +
            "Set either 'ConnectionStrings__Default' (Npgsql key=value format) " +
            "or 'DATABASE_URL' (postgres:// URI) as an environment variable.");

    return ConvertDatabaseUrl(databaseUrl);
}

static string ConvertDatabaseUrl(string databaseUrl)
{
    databaseUrl = databaseUrl.Trim();

    // Strip surrounding quotes that some platforms inject around env var values.
    if ((databaseUrl.StartsWith("\"") && databaseUrl.EndsWith("\"")) ||
        (databaseUrl.StartsWith("'") && databaseUrl.EndsWith("'")))
    {
        databaseUrl = databaseUrl.Substring(1, databaseUrl.Length - 2).Trim();
    }

    if (!databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !databaseUrl.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return databaseUrl;
    }

    var uri = new Uri(databaseUrl);

    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;

    var host     = uri.Host;
    var port     = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');

    return $"Host={host};Port={port};Database={database};" +
           $"Username={username};Password={password};" +
           "Ssl Mode=Require;Trust Server Certificate=true";
}
