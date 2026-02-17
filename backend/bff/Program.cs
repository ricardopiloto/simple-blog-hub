using System.Threading.RateLimiting;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BlogBff.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<JwtService>();

var apiBaseUrl = builder.Configuration["API:BaseUrl"] ?? "http://localhost:5001";
var apiInternalKey = builder.Configuration["API:InternalKey"]?.Trim();
builder.Services.AddHttpClient<ApiClient>(client =>
{
    client.BaseAddress = new Uri(apiBaseUrl.TrimEnd('/') + "/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    if (!string.IsNullOrEmpty(apiInternalKey))
        client.DefaultRequestHeaders.Add("X-Api-Key", apiInternalKey);
});

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "dev-secret-change-in-production-min-32-chars";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "blog-bff";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "blog-frontend";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.AddPolicy("Login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { Window = TimeSpan.FromMinutes(1), PermitLimit = 10 }));
    options.AddPolicy("Uploads", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { Window = TimeSpan.FromMinutes(1), PermitLimit = 20 }));
    options.AddPolicy("Users", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { Window = TimeSpan.FromMinutes(1), PermitLimit = 60 }));
});

var corsAllowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Trim();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (!string.IsNullOrEmpty(corsAllowedOrigins))
        {
            var origins = corsAllowedOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            if (origins.Length > 0)
                policy.WithOrigins(origins).AllowAnyMethod().AllowAnyHeader();
            else
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
        else
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Production: require CORS and strong JWT secret
if (app.Environment.IsProduction())
{
    var cors = app.Configuration["Cors:AllowedOrigins"]?.Trim();
    if (string.IsNullOrEmpty(cors))
        throw new InvalidOperationException("In production, Cors:AllowedOrigins must be configured (e.g. semicolon-separated list of allowed origins).");
    var secret = app.Configuration["Jwt:Secret"] ?? "";
    if (secret.Length < 32)
        throw new InvalidOperationException("In production, Jwt:Secret must be at least 32 characters.");
}

app.UseHttpsRedirection();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    if (app.Environment.IsProduction() && context.Request.IsHttps)
        context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    await next(context);
});

// Content-Security-Policy (optional): set Security:CspHeader in config; use Security:CspReportOnly=true for report-only
var cspHeader = app.Configuration["Security:CspHeader"]?.Trim();
if (!string.IsNullOrEmpty(cspHeader))
{
    var reportOnly = string.Equals(app.Configuration["Security:CspReportOnly"]?.Trim(), "true", StringComparison.OrdinalIgnoreCase);
    var headerName = reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
    app.Use(async (context, next) =>
    {
        context.Response.Headers[headerName] = cspHeader;
        await next(context);
    });
}

app.UseRateLimiter();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
