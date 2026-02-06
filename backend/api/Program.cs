using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var connectionString = builder.Configuration.GetValue<string>("ConnectionStrings:DefaultConnection")
    ?? "Data Source=blog.db";
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddScoped<IAdminService, AdminService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    await db.Database.MigrateAsync();
    await SeedData.EnsureSeedAsync(db, config);
    await SeedData.EnsureInitialAdminUserAsync(db, config);
    await SeedData.TryResetAdminPasswordByTriggerFileAsync(db, config, logger);
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
