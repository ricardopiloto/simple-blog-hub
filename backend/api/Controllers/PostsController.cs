using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;
using BlogApi.Services;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private const string AuthorIdHeader = "X-Author-Id";
    private readonly BlogDbContext _db;

    public PostsController(BlogDbContext db)
    {
        _db = db;
    }

    private Guid? GetAuthorIdFromHeader()
    {
        if (!Request.Headers.TryGetValue(AuthorIdHeader, out var value) || string.IsNullOrWhiteSpace(value))
            return null;
        return Guid.TryParse(value.ToString().Trim(), out var id) ? id : null;
    }

    /// <summary>
    /// GET /api/posts?published=true&amp;order=date|story or ?editable=true (requires X-Author-Id)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts(
        [FromQuery] bool? published = true,
        [FromQuery] string order = "date",
        [FromQuery] bool editable = false,
        CancellationToken cancellationToken = default)
    {
        if (editable)
        {
            var authorId = GetAuthorIdFromHeader();
            if (authorId == null)
                return Unauthorized();
            var postIdsCollaborator = await _db.PostCollaborators
                .Where(pc => pc.AuthorId == authorId)
                .Select(pc => pc.PostId)
                .ToListAsync(cancellationToken);
            var query = _db.Posts
                .Include(p => p.Author)
                .Include(p => p.Collaborators).ThenInclude(c => c.Author)
                .Where(p => p.AuthorId == authorId || postIdsCollaborator.Contains(p.Id));
            var posts = await query.OrderBy(p => p.UpdatedAt).ThenBy(p => p.CreatedAt).ToListAsync(cancellationToken);
            return Ok(posts.Select(p => ToDto(p, contentAsHtml: false, includeAuthorId: true, includeCollaborators: true)));
        }

        var baseQuery = _db.Posts.Include(p => p.Author).AsQueryable();
        if (published.HasValue)
            baseQuery = baseQuery.Where(p => p.Published == published.Value);
        baseQuery = order.ToLowerInvariant() switch
        {
            "story" => baseQuery.OrderBy(p => p.StoryOrder),
            _ => baseQuery.OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
        };
        var list = await baseQuery.ToListAsync(cancellationToken);
        return Ok(list.Select(p => ToDto(p, contentAsHtml: true, includeAuthorId: false, includeCollaborators: false)));
    }

    /// <summary>
    /// GET /api/posts/edit/{id} — for area autoral; returns content as Markdown. Requires X-Author-Id and permission.
    /// </summary>
    [HttpGet("edit/{id:guid}")]
    public async Task<ActionResult<PostDto>> GetByIdForEdit(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var post = await _db.Posts
            .Include(p => p.Author)
            .Include(p => p.Collaborators).ThenInclude(c => c.Author)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (post == null)
            return NotFound();
        if (!await CanEditAsync(post.Id, authorId.Value, cancellationToken))
            return Forbid();
        return Ok(ToDto(post, contentAsHtml: false, includeAuthorId: true, includeCollaborators: true));
    }

    /// <summary>
    /// GET /api/posts/{slug} — public; returns content as HTML.
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<ActionResult<PostDto>> GetBySlug(string slug, CancellationToken cancellationToken = default)
    {
        if (slug.Equals("edit", StringComparison.OrdinalIgnoreCase))
            return NotFound();
        var post = await _db.Posts
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);
        if (post == null)
            return NotFound();
        return Ok(ToDto(post, contentAsHtml: true, includeAuthorId: false, includeCollaborators: false));
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost([FromBody] CreateOrUpdatePostRequest request, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var author = await _db.Authors.FindAsync(new object[] { authorId.Value }, cancellationToken);
        if (author == null)
            return Unauthorized();
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
            return BadRequest();
        if (await _db.Posts.AnyAsync(p => p.Slug == request.Slug.Trim(), cancellationToken))
            return Conflict("Slug already in use");
        var now = DateTime.UtcNow;
        var post = new Post
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim(),
            Excerpt = request.Excerpt?.Trim(),
            Content = request.Content ?? string.Empty,
            CoverImageUrl = request.CoverImage?.Trim(),
            Published = request.Published,
            PublishedAt = request.Published ? now : null,
            CreatedAt = now,
            UpdatedAt = now,
            StoryOrder = request.StoryOrder,
            AuthorId = authorId.Value
        };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync(cancellationToken);
        await _db.Entry(post).Reference(p => p.Author).LoadAsync(cancellationToken);
        return CreatedAtAction(nameof(GetByIdForEdit), new { id = post.Id }, ToDto(post, contentAsHtml: false, includeAuthorId: true, includeCollaborators: false));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PostDto>> UpdatePost(Guid id, [FromBody] CreateOrUpdatePostRequest request, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var post = await _db.Posts.Include(p => p.Author).FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (post == null)
            return NotFound();
        if (!await CanEditAsync(post.Id, authorId.Value, cancellationToken))
            return Forbid();
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
            return BadRequest();
        var slugTaken = await _db.Posts.AnyAsync(p => p.Slug == request.Slug.Trim() && p.Id != id, cancellationToken);
        if (slugTaken)
            return Conflict("Slug already in use");
        post.Title = request.Title.Trim();
        post.Slug = request.Slug.Trim();
        post.Excerpt = request.Excerpt?.Trim();
        post.Content = request.Content ?? string.Empty;
        post.CoverImageUrl = request.CoverImage?.Trim();
        post.Published = request.Published;
        post.PublishedAt = request.Published ? (post.PublishedAt ?? DateTime.UtcNow) : null;
        post.StoryOrder = request.StoryOrder;
        post.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        await _db.Entry(post).Collection(p => p.Collaborators).Query().Include(c => c.Author).LoadAsync(cancellationToken);
        return Ok(ToDto(post, contentAsHtml: false, includeAuthorId: true, includeCollaborators: true));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var post = await _db.Posts.FindAsync(new object[] { id }, cancellationToken);
        if (post == null)
            return NotFound();
        if (post.AuthorId != authorId.Value)
            return Forbid();
        _db.Posts.Remove(post);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private async Task<bool> CanEditAsync(Guid postId, Guid authorId, CancellationToken cancellationToken)
    {
        var post = await _db.Posts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == postId, cancellationToken);
        if (post == null) return false;
        if (post.AuthorId == authorId) return true;
        return await _db.PostCollaborators.AnyAsync(pc => pc.PostId == postId && pc.AuthorId == authorId, cancellationToken);
    }

    [HttpPost("{id:guid}/collaborators")]
    public async Task<IActionResult> AddCollaborator(Guid id, [FromBody] AddCollaboratorRequest request, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var post = await _db.Posts.FindAsync(new object[] { id }, cancellationToken);
        if (post == null)
            return NotFound();
        if (post.AuthorId != authorId.Value)
            return Forbid();
        if (!Guid.TryParse(request.AuthorId, out var collaboratorAuthorId))
            return BadRequest();
        if (collaboratorAuthorId == authorId.Value)
            return BadRequest();
        var author = await _db.Authors.FindAsync(new object[] { collaboratorAuthorId }, cancellationToken);
        if (author == null)
            return NotFound();
        if (await _db.PostCollaborators.AnyAsync(pc => pc.PostId == id && pc.AuthorId == collaboratorAuthorId, cancellationToken))
            return Conflict();
        _db.PostCollaborators.Add(new PostCollaborator { PostId = id, AuthorId = collaboratorAuthorId });
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}/collaborators/{authorId:guid}")]
    public async Task<IActionResult> RemoveCollaborator(Guid id, Guid authorId, CancellationToken cancellationToken = default)
    {
        var callerId = GetAuthorIdFromHeader();
        if (callerId == null)
            return Unauthorized();
        var post = await _db.Posts.FindAsync(new object[] { id }, cancellationToken);
        if (post == null)
            return NotFound();
        if (post.AuthorId != callerId.Value)
            return Forbid();
        var pc = await _db.PostCollaborators.FindAsync(new object[] { id, authorId }, cancellationToken);
        if (pc == null)
            return NotFound();
        _db.PostCollaborators.Remove(pc);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static PostDto ToDto(Post p, bool contentAsHtml, bool includeAuthorId, bool includeCollaborators = false)
    {
        var content = contentAsHtml ? MarkdownService.ToHtml(p.Content) : p.Content;
        var dto = new PostDto
        {
            Id = p.Id.ToString(),
            Title = p.Title,
            Slug = p.Slug,
            Excerpt = p.Excerpt,
            Content = content,
            CoverImage = p.CoverImageUrl,
            Published = p.Published,
            PublishedAt = p.PublishedAt?.ToString("O"),
            CreatedAt = p.CreatedAt.ToString("O"),
            UpdatedAt = p.UpdatedAt.ToString("O"),
            StoryOrder = p.StoryOrder,
            Author = new AuthorDto { Name = p.Author.Name, Avatar = p.Author.AvatarUrl, Bio = p.Author.Bio }
        };
        if (includeAuthorId)
            dto.AuthorId = p.AuthorId.ToString();
        if (includeCollaborators && p.Collaborators != null)
            dto.Collaborators = p.Collaborators
                .Where(c => c.AuthorId != p.AuthorId)
                .Select(c => new CollaboratorDto { Id = c.AuthorId.ToString(), Name = c.Author.Name })
                .ToList();
        return dto;
    }
}
