using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using BlogBff.Extensions;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
[EnableRateLimiting("Users")]
public class UsersController : ControllerBase
{
    private readonly ApiClient _api;

    public UsersController(ApiClient api)
    {
        _api = api;
    }

    /// <summary>GET /bff/users — list users (Admin only; API enforces).</summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.CreateUserAsync(body, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(errorContent))
                return StatusCode((int)response.StatusCode);
            return new ContentResult
            {
                StatusCode = (int)response.StatusCode,
                Content = errorContent,
                ContentType = response.Content.Headers.ContentType?.MediaType ?? "application/json"
            };
        }
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, Content(content, "application/json"));
    }

    /// <summary>PUT /bff/users/{id} — update user (Admin: email/password; self: password only).</summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
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
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(content))
                return StatusCode((int)response.StatusCode);
            return new ContentResult
            {
                StatusCode = (int)response.StatusCode,
                Content = content,
                ContentType = response.Content.Headers.ContentType?.MediaType ?? "application/json"
            };
        }
        return NoContent();
    }

    /// <summary>POST /bff/users/{id}/reset-password — reset user password to default (Admin only).</summary>
    [HttpPost("{id:guid}/reset-password")]
    [Authorize]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
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
