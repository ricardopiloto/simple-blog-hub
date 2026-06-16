using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;
using BlogApi.Services;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : AuthorizedApiControllerBase
{
    private readonly BlogDbContext _db;
    private readonly IAdminService _adminService;
    private readonly ICloudflareTokenEncryptionService _cloudflareEncryption;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        BlogDbContext db,
        IAdminService adminService,
        ICloudflareTokenEncryptionService cloudflareEncryption,
        ILogger<UsersController> logger)
    {
        _db = db;
        _adminService = adminService;
        _cloudflareEncryption = cloudflareEncryption;
        _logger = logger;
    }

    private static UserListDto MapToUserListDto(User user) => new()
    {
        Id = user.Id.ToString(),
        Email = user.Email,
        AuthorId = user.AuthorId.ToString(),
        AuthorName = user.Author?.Name ?? string.Empty,
        AuthorBio = user.Author?.Bio,
        CloudflareAccountId = user.Author?.CloudflareAccountId,
        HasCloudflareApiToken = !string.IsNullOrEmpty(user.Author?.CloudflareApiTokenEncrypted),
        CloudflareImageModel = user.Author?.CloudflareImageModel
    };

    /// <summary>GET /api/users — list users (Admin only).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId.Value, cancellationToken))
            return Forbid();

        var users = await _db.Users
            .Include(u => u.Author)
            .OrderBy(u => u.Email)
            .ToListAsync(cancellationToken);
        return Ok(users.Select(MapToUserListDto));
    }

    /// <summary>GET /api/users/me — current user (any authenticated user).</summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserListDto>> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.Author)
            .FirstOrDefaultAsync(u => u.AuthorId == authorId.Value, cancellationToken);
        if (user == null)
            return Unauthorized();

        return Ok(MapToUserListDto(user));
    }

    /// <summary>POST /api/users — create user (Admin only).</summary>
    [HttpPost]
    public async Task<ActionResult<UserListDto>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("CreateUser validation failed: {ValidationErrors}", FormatValidationErrorsForLog());
            return BadRequest(GetFirstValidationErrorMessage());
        }

        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId.Value, cancellationToken))
            return Forbid();

        var email = request.Email.Trim();
        var authorName = request.AuthorName.Trim();
        var passwordProvided = request.Password != null && request.Password.Trim().Length > 0;
        var password = string.IsNullOrWhiteSpace(request.Password) ? SeedData.InitialAdminDefaultPassword : request.Password!.Trim();
        if (passwordProvided && !PasswordValidation.IsValid(password))
            return BadRequest(PasswordValidation.ErrorMessage);

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
        _logger.LogInformation("Audit: UserCreated By={AuthorId} TargetUserId={UserId} TargetEmail={Email}", authorId.Value, user.Id, email);

        return CreatedAtAction(nameof(GetUsers), (object?)null, MapToUserListDto(user));
    }

    /// <summary>PUT /api/users/{id} — Admin: email and/or password; self: password only.</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();

        var callerUser = await _db.Users.FirstOrDefaultAsync(u => u.AuthorId == authorId.Value, cancellationToken);
        if (callerUser == null)
            return Unauthorized();

        var isAdmin = await _adminService.IsAdminAsync(authorId.Value, cancellationToken);
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

        if ((isAdmin || isSelf) && user.Author != null)
        {
            if (request.CloudflareAccountId != null)
            {
                var accountId = CloudflareCredentialsNormalizer.NormalizeAccountId(request.CloudflareAccountId);
                user.Author.CloudflareAccountId = accountId;
            }

            if (request.CloudflareApiToken != null && request.CloudflareApiToken.Trim().Length > 0)
            {
                try
                {
                    var token = CloudflareCredentialsNormalizer.NormalizeApiToken(request.CloudflareApiToken);
                    if (!CloudflareApiTokenValidator.TryValidate(token, out var tokenError))
                        return BadRequest(tokenError);
                    user.Author.CloudflareApiTokenEncrypted = _cloudflareEncryption.Encrypt(token);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            if (request.CloudflareImageModel != null)
            {
                if (!CloudflareImageModelValidator.TryNormalize(request.CloudflareImageModel, out var imageModel, out var modelError))
                    return BadRequest(modelError);
                user.Author.CloudflareImageModel = imageModel;
            }

            if (request.CloudflareAccountId != null
                || (request.CloudflareApiToken != null && request.CloudflareApiToken.Trim().Length > 0)
                || request.CloudflareImageModel != null)
                user.Author.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>POST /api/users/{id}/reset-password — Admin only; set target user password to default and require change on next login.</summary>
    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId.Value, cancellationToken))
            return Forbid();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(SeedData.InitialAdminDefaultPassword);
        user.MustChangePassword = true;
        await _db.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Audit: PasswordReset By={AuthorId} TargetUserId={UserId}", authorId.Value, id);
        return NoContent();
    }

    /// <summary>DELETE /api/users/{id} — Admin only.</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        if (!await _adminService.IsAdminAsync(authorId.Value, cancellationToken))
            return Forbid();

        var user = await _db.Users.Include(u => u.Author).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
            return NotFound();

        _db.Users.Remove(user);
        await _db.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Audit: UserDeleted By={AuthorId} TargetUserId={UserId}", authorId.Value, id);
        return NoContent();
    }

    private string GetFirstValidationErrorMessage()
    {
        foreach (var state in ModelState.Values)
        {
            var error = state.Errors.FirstOrDefault(e => !string.IsNullOrWhiteSpace(e.ErrorMessage));
            if (error != null)
                return error.ErrorMessage;
        }
        return "Dados inválidos.";
    }

    private string FormatValidationErrorsForLog()
    {
        return string.Join("; ", ModelState
            .Where(kv => kv.Value?.Errors.Count > 0)
            .Select(kv => $"{kv.Key}: {string.Join(", ", kv.Value!.Errors.Select(e => e.ErrorMessage))}"));
    }
}
