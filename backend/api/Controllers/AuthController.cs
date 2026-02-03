using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BlogDbContext _db;

    public AuthController(BlogDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/auth/login — validate credentials; returns user/author data (no token; BFF issues JWT).
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest();

        var user = await _db.Users
            .Include(u => u.Author)
            .FirstOrDefaultAsync(u => u.Email == request.Email.Trim(), cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized();

        return Ok(new LoginResponse
        {
            UserId = user.Id.ToString(),
            AuthorId = user.AuthorId.ToString(),
            Email = user.Email,
            Author = new AuthorDto
            {
                Name = user.Author.Name,
                Avatar = user.Author.AvatarUrl,
                Bio = user.Author.Bio
            }
        });
    }
}
