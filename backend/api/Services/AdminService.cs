using Microsoft.EntityFrameworkCore;
using BlogApi.Data;

namespace BlogApi.Services;

public class AdminService : IAdminService
{
    private readonly BlogDbContext _db;
    private readonly string? _adminEmail;

    public AdminService(BlogDbContext db, IConfiguration configuration)
    {
        _db = db;
        var configured = configuration["Admin:Email"]?.Trim();
        _adminEmail = string.IsNullOrEmpty(configured) ? BlogApi.Data.SeedData.DefaultAdminEmail : configured;
    }

    public async Task<bool> IsAdminAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(_adminEmail))
            return false;
        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.AuthorId == authorId, cancellationToken);
        return user != null && string.Equals(user.Email.Trim(), _adminEmail, StringComparison.OrdinalIgnoreCase);
    }
}
