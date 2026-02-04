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

app.UseHttpsRedirection();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await db.Database.MigrateAsync();
    await SeedData.EnsureSeedAsync(db);
    await SeedData.EnsureInitialAdminUserAsync(db, config);
}

app.Run();
