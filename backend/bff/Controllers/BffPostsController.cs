using Microsoft.AspNetCore.Mvc;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class PostsController : ControllerBase
{
    private readonly ApiClient _api;

    public PostsController(ApiClient api)
    {
        _api = api;
    }

    /// <summary>
    /// GET /bff/posts?order=date|story — lista posts publicados (delega à API).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] string order = "date", CancellationToken cancellationToken = default)
    {
        var response = await _api.GetPostsAsync(published: true, order: order, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// GET /bff/posts/{slug} — post por slug (delega à API).
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken = default)
    {
        var response = await _api.GetPostBySlugAsync(slug, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }
}
