using Amazon.S3;
using LostNFound.Api.Configuration;
using LostNFound.Api.Constants;
using LostNFound.Api.Data;
using LostNFound.Api.Models;
using LostNFound.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using LostNFound.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Build-time tools (GetDocument.Insider for OpenAPI generation, dotnet-ef for migrations)
// load this assembly and invoke its entry point inside the tool's own host process.
// Assembly.GetEntryAssembly() returns the tool (not this app) in that scenario, which
// lets us gate side effects like database access and options validation.
// Note: builder.Environment.ApplicationName cannot be used here because the tool
// overrides it to match the target project name.
var isDesignTime = Assembly.GetEntryAssembly()?.GetName().Name != "LostNFound.Api";

// Railway injects PORT at runtime; falls back to 8080 locally.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var connectionString = ResolveConnectionString(builder.Configuration, isDesignTime);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, o => o.UseNetTopologySuite()));

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

var jwtSection = builder.Configuration.GetSection("JWT");

builder.Services
    .AddOptions<JwtOptions>()
    .Bind(jwtSection)
    .Validate(o => !string.IsNullOrWhiteSpace(o.Key), "JWT:Key is required.")
    .Validate(o => o.Key.Length >= 32, "JWT:Key must be at least 32 characters.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.Issuer), "JWT:Issuer is required.")
    .Validate(o => !string.IsNullOrWhiteSpace(o.Audience), "JWT:Audience is required.")
    .Validate(o => o.DurationInMinutes > 0, "JWT:DurationInMinutes must be greater than 0.")
    .ValidateOnStart(); //app won't boot if JWT config is missing or invalid

var jwtSettings = jwtSection.Get<JwtOptions>()
    ?? throw new InvalidOperationException("JWT configuration section is missing.");

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            RoleClaimType = ClaimTypes.Role
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Allow JWT in query string for SignalR requests (e.g. /hubs/chat?access_token=...)
                var accessToken = context.Request.Query["access_token"];
                // If the request is for our hub
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthConstants.AdminOnlyPolicy, policy => policy.RequireRole(AuthConstants.AdminRole));
});

// ── Storage (S3-compatible) ───────────────────────────────────────────────
var storageOptionsBuilder = builder.Services.AddOptions<StorageOptions>()
    .Configure(o =>
    {
        o.EndpointUrl = Environment.GetEnvironmentVariable("AWS_ENDPOINT_URL") ?? "";
        o.BucketName = Environment.GetEnvironmentVariable("AWS_S3_BUCKET_NAME") ?? "";
        o.Region = Environment.GetEnvironmentVariable("AWS_DEFAULT_REGION") ?? "";
        o.AccessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? "";
        o.SecretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? "";
    });

if (!isDesignTime)
{
    storageOptionsBuilder
        .Validate(o => !string.IsNullOrWhiteSpace(o.EndpointUrl), "AWS_ENDPOINT_URL is required.")
        .Validate(o => !string.IsNullOrWhiteSpace(o.BucketName), "AWS_S3_BUCKET_NAME is required.")
        .Validate(o => !string.IsNullOrWhiteSpace(o.AccessKeyId), "AWS_ACCESS_KEY_ID is required.")
        .Validate(o => !string.IsNullOrWhiteSpace(o.SecretAccessKey), "AWS_SECRET_ACCESS_KEY is required.")
        .ValidateOnStart();
}

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
builder.Services.AddSingleton<IImageProcessingService, ImageProcessingService>();
builder.Services.AddScoped<IItemImageService, ItemImageService>();
builder.Services.AddScoped<IItemDeletionService, ItemDeletionService>();

// CORS_ORIGINS accepts a comma-separated list of allowed origins (e.g. the Railway frontend URL).
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS") ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddOptions<MapTilerOptions>()
    .Configure(o =>
    {
        o.ApiKey = Environment.GetEnvironmentVariable("MAPTILER_API_KEY") ?? builder.Configuration["MapTiler:ApiKey"] ?? "";
    });
builder.Services.AddHttpClient<IMapTilerService, MapTilerService>(client =>
{
    var referer = corsOrigins.FirstOrDefault() ?? "http://localhost:3000";
    client.DefaultRequestHeaders.Referrer = new Uri(referer);
});

builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Built-in OpenAPI document — used by Microsoft.Extensions.ApiDescription.Server
// to generate openapi/v1.json at build time.
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
    options.AddOperationTransformer((operation, context, cancellationToken) =>
    {
        if (context.Description.ActionDescriptor.EndpointMetadata.OfType<IAuthorizeData>().Any())
        {
            var schemeReference = new OpenApiSecuritySchemeReference("Bearer", context.Document);
            operation.Security = [new OpenApiSecurityRequirement { [schemeReference] = [] }];
        }
        return Task.CompletedTask;
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

// Database migration and seeding — skip during build-time document generation and EF tooling.
if (!isDesignTime)
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        var pending = (await db.Database.GetPendingMigrationsAsync()).ToList();
        app.Logger.LogInformation("Pending EF migrations: {Count} ({Names})",
            pending.Count,
            pending.Count == 0 ? "none" : string.Join(", ", pending));

        await db.Database.MigrateAsync();
        await DbSeeder.SeedAsync(db, userManager, roleManager);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Swagger"));
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ChatHub>("/hubs/chat");

app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
app.MapControllers();

app.Run();


static string ResolveConnectionString(IConfiguration config, bool isDesignTime)
{
    var connStr = config.GetConnectionString("Default");
    if (!string.IsNullOrWhiteSpace(connStr))
        return connStr.Trim();

    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrWhiteSpace(databaseUrl))
    {
        // During build-time document generation, a real database is not needed.
        // Return a placeholder so service registration (AddDbContext) succeeds.
        if (isDesignTime)
            return "Host=localhost;Database=placeholder";

        throw new InvalidOperationException(
            "No database connection string found. " +
            "Set either 'ConnectionStrings__Default' (Npgsql key=value format) " +
            "or 'DATABASE_URL' (postgres:// URI) as an environment variable.");
    }

    return ConvertDatabaseUrl(databaseUrl);
}

static string ConvertDatabaseUrl(string databaseUrl)
{
    databaseUrl = databaseUrl.Trim();

    // Strip surrounding quotes that some platforms inject around env var values.
    if ((databaseUrl.StartsWith('"') && databaseUrl.EndsWith('"')) ||
        (databaseUrl.StartsWith('\'') && databaseUrl.EndsWith('\'')))
    {
        databaseUrl = databaseUrl[1..^1].Trim();
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

internal sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider) : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
    {
        var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();

        if (authenticationSchemes.Any(authScheme => authScheme.Name == "Bearer"))
        {
            // Add the security scheme at the document level
            var securitySchemes = new Dictionary<string, IOpenApiSecurityScheme>
            {
                ["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer", 
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT"
                }
            };
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes = securitySchemes;
            
        }
    }
}
    
