using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
/// <summary>
/// Dashboard statistics for the author area. Requires X-Author-Id.
/// </summary>
public class DashboardController : AuthorizedApiControllerBase
{
    private readonly BlogDbContext _db;

    public DashboardController(BlogDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/dashboard/stats — total posts, published, scheduled, total views, authors count.
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken cancellationToken = default)
    {
        if (GetAuthorIdFromHeader() == null)
            return Unauthorized();

        var totalPosts = await _db.Posts.CountAsync(cancellationToken);
        var publishedCount = await _db.Posts.CountAsync(p => p.Published, cancellationToken);
        var scheduledCount = await _db.Posts.CountAsync(p => p.ScheduledPublishAt != null, cancellationToken);
        var draftCount = await _db.Posts.CountAsync(p => !p.Published, cancellationToken);
        var totalViews = await _db.Posts.SumAsync(p => p.ViewCount, cancellationToken);
        var authorsCount = await _db.Authors.CountAsync(cancellationToken);

        return Ok(new DashboardStatsDto
        {
            TotalPosts = totalPosts,
            PublishedCount = publishedCount,
            ScheduledCount = scheduledCount,
            DraftCount = draftCount,
            TotalViews = totalViews,
            AuthorsCount = authorsCount,
        });
    }
}
