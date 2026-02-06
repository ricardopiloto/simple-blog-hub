using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApiClient _api;

    public UsersController(ApiClient api)
    {
        _api = api;
    }

    private static Guid? GetAuthorId(ClaimsPrincipal user)
    {
        var value = user.FindFirst("author_id")?.Value ?? user.FindFirst(c => c.Type.EndsWith("/author_id", StringComparison.Ordinal))?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }

    /// <summary>GET /bff/users — list users (Admin only; API enforces).</summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetUsersAsync(authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>GET /bff/users/me — current user (any authenticated user).</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetCurrentUserAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>POST /bff/users — create user (Admin only).</summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateUser([FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.CreateUserAsync(body, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, Content(content, "application/json"));
    }

    /// <summary>PUT /bff/users/{id} — update user (Admin: email/password; self: password only).</summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.UpdateUserAsync(id, body, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        return NoContent();
    }

    /// <summary>POST /bff/users/{id}/reset-password — reset user password to default (Admin only).</summary>
    [HttpPost("{id:guid}/reset-password")]
    [Authorize]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.ResetUserPasswordAsync(id, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        return NoContent();
    }

    /// <summary>DELETE /bff/users/{id} — delete user (Admin only).</summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.DeleteUserAsync(id, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        return NoContent();
    }
}
