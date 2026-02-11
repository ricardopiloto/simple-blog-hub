using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using BlogApi.Data;
using BlogApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var connectionString = builder.Configuration.GetValue<string>("ConnectionStrings:DefaultConnection")
    ?? "Data Source=blog.db";
// Resolve relative Data Source path against Content Root so MigrateAsync() and runtime use the same file
// regardless of process working directory (fixes "migrations not applying" when running from different cwd).
var csb = new SqliteConnectionStringBuilder(connectionString);
if (!string.IsNullOrEmpty(csb.DataSource) && !Path.IsPathRooted(csb.DataSource))
{
    csb.DataSource = Path.Combine(builder.Environment.ContentRootPath, csb.DataSource);
    connectionString = csb.ToString();
}
var resolvedConnectionString = connectionString;
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite(resolvedConnectionString));
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddHostedService<ScheduledPublishBackgroundService>();

var app = builder.Build();

// Production: require API:InternalKey
if (app.Environment.IsProduction())
{
    var key = app.Configuration["API:InternalKey"]?.Trim();
    if (string.IsNullOrEmpty(key))
        throw new InvalidOperationException("In production, API:InternalKey must be configured (shared secret between BFF and API).");
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    await db.Database.MigrateAsync();
    var dbPath = new SqliteConnectionStringBuilder(resolvedConnectionString).DataSource;
    logger.LogInformation("Database migrations applied. Database file: {DbPath}", dbPath);
    await SeedData.EnsureSeedAsync(db, config);
    await SeedData.EnsureInitialAdminUserAsync(db, config);
    await SeedData.TryResetAdminPasswordByTriggerFileAsync(db, config, logger);
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

// Optional shared key between BFF and API: when API:InternalKey is set, require X-Api-Key header (constant-time comparison).
var internalKey = app.Configuration["API:InternalKey"]?.Trim();
if (!string.IsNullOrEmpty(internalKey))
{
    var expectedHash = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(internalKey));
    app.Use(async (context, next) =>
    {
        var provided = context.Request.Headers["X-Api-Key"].FirstOrDefault();
        if (string.IsNullOrEmpty(provided))
        {
            context.Response.StatusCode = 401;
            return;
        }
        var providedHash = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(provided));
        if (!CryptographicOperations.FixedTimeEquals(expectedHash, providedHash))
        {
            context.Response.StatusCode = 401;
            return;
        }
        await next(context);
    });
}

app.MapControllers();

app.Run();
