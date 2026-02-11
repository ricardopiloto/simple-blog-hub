using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Extensions;
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

    /// <summary>
    /// GET /bff/authors — protegido; lista autores para convite.
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAuthors(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetAuthorsAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }
}
