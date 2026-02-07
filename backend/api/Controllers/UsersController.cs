using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;
using BlogApi.Services;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private const string AuthorIdHeader = "X-Author-Id";
    private readonly BlogDbContext _db;
    private readonly IAdminService _adminService;

    public UsersController(BlogDbContext db, IAdminService adminService)
    {
        _db = db;
        _adminService = adminService;
    }

    private bool TryGetAuthorId(out Guid authorId)
    {
        authorId = default;
        if (!Request.Headers.TryGetValue(AuthorIdHeader, out var value) || string.IsNullOrWhiteSpace(value))
            return false;
        return Guid.TryParse(value.ToString().Trim(), out authorId);
    }

    /// <summary>GET /api/users — list users (Admin only).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers(CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId, cancellationToken))
            return Forbid();

        var users = await _db.Users
            .Include(u => u.Author)
            .OrderBy(u => u.Email)
            .Select(u => new UserListDto
            {
                Id = u.Id.ToString(),
                Email = u.Email,
                AuthorId = u.AuthorId.ToString(),
                AuthorName = u.Author.Name,
                AuthorBio = u.Author.Bio
            })
            .ToListAsync(cancellationToken);
        return Ok(users);
    }

    /// <summary>GET /api/users/me — current user (any authenticated user).</summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserListDto>> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.Author)
            .FirstOrDefaultAsync(u => u.AuthorId == authorId, cancellationToken);
        if (user == null)
            return Unauthorized();

        return Ok(new UserListDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            AuthorId = user.AuthorId.ToString(),
            AuthorName = user.Author.Name,
            AuthorBio = user.Author.Bio
        });
    }

    /// <summary>POST /api/users — create user (Admin only).</summary>
    [HttpPost]
    public async Task<ActionResult<UserListDto>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId, cancellationToken))
            return Forbid();

        var email = request.Email?.Trim() ?? string.Empty;
        var authorName = request.AuthorName?.Trim() ?? string.Empty;
        var passwordProvided = request.Password != null && request.Password.Trim().Length > 0;
        var password = string.IsNullOrWhiteSpace(request.Password) ? SeedData.InitialAdminDefaultPassword : request.Password!.Trim();
        if (passwordProvided && !PasswordValidation.IsValid(password))
            return BadRequest(PasswordValidation.ErrorMessage);
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(authorName))
            return BadRequest();

        if (await _db.Users.AnyAsync(u => u.Email == email, cancellationToken))
            return Conflict();

        var newAuthorId = Guid.NewGuid();
        var author = new Author
        {
            Id = newAuthorId,
            Name = authorName,
            AvatarUrl = null,
            Bio = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Authors.Add(author);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            AuthorId = newAuthorId,
            CreatedAt = DateTime.UtcNow,
            MustChangePassword = true
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetUsers), (object?)null, new UserListDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            AuthorId = user.AuthorId.ToString(),
            AuthorName = author.Name
        });
    }

    /// <summary>PUT /api/users/{id} — Admin: email and/or password; self: password only.</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();

        var callerUser = await _db.Users.FirstOrDefaultAsync(u => u.AuthorId == authorId, cancellationToken);
        if (callerUser == null)
            return Unauthorized();

        var isAdmin = await _adminService.IsAdminAsync(authorId, cancellationToken);
        var isSelf = callerUser.Id == id;

        if (!isAdmin && !isSelf)
            return Forbid();

        var user = await _db.Users.Include(u => u.Author).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound();

        if (request.Password != null)
        {
            var pwd = request.Password.Trim();
            if (pwd.Length > 0)
            {
                if (!PasswordValidation.IsValid(pwd))
                    return BadRequest(PasswordValidation.ErrorMessage);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(pwd);
                user.MustChangePassword = false;
            }
        }

        if (request.Email != null && isAdmin)
        {
            var email = request.Email.Trim();
            if (string.IsNullOrEmpty(email))
                return BadRequest();
            if (await _db.Users.AnyAsync(u => u.Email == email && u.Id != id, cancellationToken))
                return Conflict();
            user.Email = email;
        }

        if (request.AuthorName != null && (isAdmin || isSelf))
        {
            var name = request.AuthorName.Trim();
            if (name.Length > 0 && user.Author != null)
                user.Author.Name = name;
        }

        if (request.Bio != null && (isAdmin || isSelf))
        {
            var bioTrimmed = request.Bio.Trim();
            if (bioTrimmed.Length > 70)
                return BadRequest("Bio must be at most 70 characters.");
            if (user.Author != null)
                user.Author.Bio = string.IsNullOrWhiteSpace(request.Bio) ? null : bioTrimmed;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>POST /api/users/{id}/reset-password — Admin only; set target user password to default and require change on next login.</summary>
    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId, cancellationToken))
            return Forbid();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(SeedData.InitialAdminDefaultPassword);
        user.MustChangePassword = true;
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>DELETE /api/users/{id} — Admin only.</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken = default)
    {
        if (!TryGetAuthorId(out var authorId))
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId, cancellationToken))
            return Forbid();

        var user = await _db.Users.Include(u => u.Author).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound();

        _db.Users.Remove(user);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
