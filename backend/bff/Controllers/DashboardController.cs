using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Extensions;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApiClient _api;

    public DashboardController(ApiClient api)
    {
        _api = api;
    }

    /// <summary>
    /// GET /bff/dashboard/stats — dashboard statistics (total posts, published, scheduled, views, authors). Protected.
    /// </summary>
    [HttpGet("stats")]
    [Authorize]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetDashboardStatsAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }
}
