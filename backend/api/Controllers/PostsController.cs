using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly BlogDbContext _db;

    public PostsController(BlogDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/posts?published=true&amp;order=date|story
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts(
        [FromQuery] bool? published = true,
        [FromQuery] string order = "date",
        CancellationToken cancellationToken = default)
    {
        var query = _db.Posts.Include(p => p.Author).AsQueryable();

        if (published.HasValue)
            query = query.Where(p => p.Published == published.Value);

        query = order.ToLowerInvariant() switch
        {
            "story" => query.OrderBy(p => p.StoryOrder),
            _ => query.OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
        };

        var posts = await query.ToListAsync(cancellationToken);
        return Ok(posts.Select(ToDto));
    }

    /// <summary>
    /// GET /api/posts/{slug}
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<ActionResult<PostDto>> GetBySlug(string slug, CancellationToken cancellationToken = default)
    {
        var post = await _db.Posts
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);

        if (post == null)
            return NotFound();

        return Ok(ToDto(post));
    }

    private static PostDto ToDto(Post p)
    {
        return new PostDto
        {
            Id = p.Id.ToString(),
            Title = p.Title,
            Slug = p.Slug,
            Excerpt = p.Excerpt,
            Content = p.Content,
            CoverImage = p.CoverImageUrl,
            Published = p.Published,
            PublishedAt = p.PublishedAt?.ToString("O"),
            CreatedAt = p.CreatedAt.ToString("O"),
            UpdatedAt = p.UpdatedAt.ToString("O"),
            StoryOrder = p.StoryOrder,
            Author = new AuthorDto
            {
                Name = p.Author.Name,
                Avatar = p.Author.AvatarUrl,
                Bio = p.Author.Bio
            }
        };
    }
}
