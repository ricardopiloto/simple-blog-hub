using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/integration")]
public class IntegrationSupportController : ControllerBase
{
    private readonly BlogDbContext _db;
    private readonly IConfiguration _configuration;

    public IntegrationSupportController(BlogDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    /// <summary>GET /api/integration/admin-author-id — resolve Admin user AuthorId by Admin:Email (BFF integration only; requires X-Api-Key).</summary>
    [HttpGet("admin-author-id")]
    public async Task<ActionResult<AdminAuthorIdResponse>> GetAdminAuthorId(CancellationToken cancellationToken = default)
    {
        var email = _configuration["Admin:Email"]?.Trim();
        if (string.IsNullOrEmpty(email))
            email = SeedData.DefaultAdminEmail;

        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), cancellationToken);
        if (user == null)
            return NotFound(new { error = "Admin user not found." });

        return Ok(new AdminAuthorIdResponse { AuthorId = user.AuthorId.ToString() });
    }

    /// <summary>GET /api/integration/authors/{authorId}/exists — verify author exists (BFF integration only; requires X-Api-Key).</summary>
    [HttpGet("authors/{authorId:guid}/exists")]
    public async Task<IActionResult> AuthorExists(Guid authorId, CancellationToken cancellationToken = default)
    {
        var exists = await _db.Authors.AsNoTracking().AnyAsync(a => a.Id == authorId, cancellationToken);
        return exists ? Ok() : NotFound();
    }
}

public class AdminAuthorIdResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("author_id")]
    public string AuthorId { get; set; } = string.Empty;
}
