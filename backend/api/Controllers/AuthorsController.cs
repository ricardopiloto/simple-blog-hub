using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : AuthorizedApiControllerBase
{
    private readonly BlogDbContext _db;

    public AuthorsController(BlogDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/authors — lista autores para seletor de convite (protegido por X-Author-Id).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuthorListDto>>> GetAuthors(CancellationToken cancellationToken = default)
    {
        if (GetAuthorIdFromHeader() == null)
            return Unauthorized();
        var authors = await _db.Authors
            .OrderBy(a => a.Name)
            .Select(a => new AuthorListDto
            {
                Id = a.Id.ToString(),
                Name = a.Name,
                Avatar = a.AvatarUrl,
                Bio = a.Bio
            })
            .ToListAsync(cancellationToken);
        return Ok(authors);
    }
}

public class AuthorListDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }

    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
}
