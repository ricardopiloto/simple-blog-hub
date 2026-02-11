using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;
using BlogApi.Services;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BlogDbContext _db;
    private readonly IAdminService _adminService;

    public AuthController(BlogDbContext db, IAdminService adminService)
    {
        _db = db;
        _adminService = adminService;
    }

    /// <summary>
    /// POST /api/auth/login — validate credentials; returns user/author data (no token; BFF issues JWT).
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _db.Users
            .Include(u => u.Author)
            .FirstOrDefaultAsync(u => u.Email == request.Email.Trim(), cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized();

        var isAdmin = await _adminService.IsAdminAsync(user.AuthorId, cancellationToken);

        return Ok(new LoginResponse
        {
            UserId = user.Id.ToString(),
            AuthorId = user.AuthorId.ToString(),
            Email = user.Email,
            IsAdmin = isAdmin,
            MustChangePassword = user.MustChangePassword,
            Author = new AuthorDto
            {
                Name = user.Author.Name,
                Avatar = user.Author.AvatarUrl,
                Bio = user.Author.Bio
            }
        });
    }
}
