using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly ApiClient _api;

    public AuthorsController(ApiClient api)
    {
        _api = api;
    }

    private static Guid? GetAuthorId(ClaimsPrincipal user)
    {
        var value = user.FindFirst("author_id")?.Value ?? user.FindFirst(c => c.Type.EndsWith("/author_id", StringComparison.Ordinal))?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }

    /// <summary>
    /// GET /bff/authors — protegido; lista autores para convite.
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAuthors(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetAuthorsAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }
}
