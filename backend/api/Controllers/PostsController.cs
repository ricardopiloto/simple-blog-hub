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
    private static readonly HashSet<string> AllowedStoryTypes = new(StringComparer.OrdinalIgnoreCase) { "velho_mundo", "idade_das_trevas" };
    private readonly BlogDbContext _db;
    private readonly IAdminService _adminService;

    public PostsController(BlogDbContext db, IAdminService adminService)
    {
        _db = db;
        _adminService = adminService;
    }

    private Guid? GetAuthorIdFromHeader()
    {
        if (!Request.Headers.TryGetValue(AuthorIdHeader, out var value) || string.IsNullOrWhiteSpace(value))
            return null;
        return Guid.TryParse(value.ToString().Trim(), out var id) ? id : null;
    }

    /// <summary>
    /// GET /api/posts?published=true&amp;order=date|story or ?page=1&amp;pageSize=6&amp;search= (paginated) or ?editable=true or ?forAuthorArea=true.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetPosts(
        [FromQuery] bool? published = true,
        [FromQuery] string order = "date",
        [FromQuery] int? page = null,
        [FromQuery] int? pageSize = null,
        [FromQuery] string? search = null,
        [FromQuery] bool editable = false,
        [FromQuery] bool forAuthorArea = false,
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

        if (forAuthorArea)
        {
            var authorId = GetAuthorIdFromHeader();
            if (authorId == null)
                return Unauthorized();

            var query = _db.Posts
                .Include(p => p.Author)
                .Include(p => p.Collaborators).ThenInclude(c => c.Author);

            // Full catalog for author area: all posts (published or not), ordered by last update / creation.
            var posts = await query
                .OrderByDescending(p => p.UpdatedAt)
                .ThenByDescending(p => p.PublishedAt ?? p.CreatedAt)
                .ToListAsync(cancellationToken);

            return Ok(posts.Select(p => ToDto(p, contentAsHtml: false, includeAuthorId: true, includeCollaborators: true)));
        }

        var baseQuery = _db.Posts.Include(p => p.Author).AsQueryable();
        if (published.HasValue)
            baseQuery = baseQuery.Where(p => p.Published == published.Value);
        if (order.Equals("story", StringComparison.OrdinalIgnoreCase))
            baseQuery = baseQuery.Where(p => p.IncludeInStoryOrder);
        baseQuery = order.ToLowerInvariant() switch
        {
            "story" => baseQuery.OrderBy(p => p.StoryOrder),
            _ => baseQuery.OrderByDescending(p => p.CreatedAt)
        };
        var list = await baseQuery.ToListAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue && page.Value >= 1 && pageSize.Value >= 1)
        {
            var searchTrim = search?.Trim();
            if (!string.IsNullOrEmpty(searchTrim))
            {
                var q = searchTrim.ToLowerInvariant();
                list = list.Where(p =>
                    (p.Title != null && p.Title.Contains(q, StringComparison.OrdinalIgnoreCase)) ||
                    (p.Author?.Name != null && p.Author.Name.Contains(q, StringComparison.OrdinalIgnoreCase)) ||
                    FormatDateForSearch(p).Contains(q, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            var total = list.Count;
            var skip = (page.Value - 1) * pageSize.Value;
            var pageList = list.Skip(skip).Take(pageSize.Value).ToList();
            var items = pageList.Select(p => ToDto(p, contentAsHtml: true, includeAuthorId: false, includeCollaborators: false)).ToList();
            return Ok(new PagedPostsResponse { Items = items, Total = total });
        }

        return Ok(list.Select(p => ToDto(p, contentAsHtml: true, includeAuthorId: false, includeCollaborators: false)));
    }

    private static string FormatDateForSearch(Post p)
    {
        var d = p.PublishedAt ?? p.CreatedAt;
        return d.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
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
    /// GET /api/posts/next-story-order — next suggested story_order (max over published posts + 1, or 1). Requires X-Author-Id.
    /// </summary>
    [HttpGet("next-story-order")]
    public async Task<ActionResult<NextStoryOrderResponse>> GetNextStoryOrder(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        var maxOrder = await _db.Posts
            .Where(p => p.Published)
            .Select(p => (int?)p.StoryOrder)
            .MaxAsync(cancellationToken);
        var next = (maxOrder ?? 0) + 1;
        return Ok(new NextStoryOrderResponse { NextStoryOrder = next });
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
        post.ViewCount++;
        await _db.SaveChangesAsync(cancellationToken);
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
        if (string.IsNullOrWhiteSpace(request.StoryType) || !AllowedStoryTypes.Contains(request.StoryType.Trim()))
            return BadRequest("story_type must be 'velho_mundo' or 'idade_das_trevas'");
        if (await _db.Posts.AnyAsync(p => p.Slug == request.Slug.Trim(), cancellationToken))
            return Conflict("Slug already in use");
        var now = DateTime.UtcNow;
        var scheduledAt = ParseScheduledPublishAt(request.ScheduledPublishAt);
        var useSchedule = scheduledAt.HasValue && scheduledAt.Value > now;
        var storyType = request.StoryType.Trim().ToLowerInvariant();
        var post = new Post
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim(),
            Excerpt = request.Excerpt?.Trim(),
            Content = request.Content ?? string.Empty,
            CoverImageUrl = request.CoverImage?.Trim(),
            Published = useSchedule ? false : request.Published,
            PublishedAt = useSchedule ? null : (request.Published ? now : null),
            ScheduledPublishAt = useSchedule ? scheduledAt : null,
            CreatedAt = now,
            UpdatedAt = now,
            StoryOrder = request.StoryOrder,
            StoryType = storyType,
            IncludeInStoryOrder = request.IncludeInStoryOrder ?? true,
            AuthorId = authorId.Value,
            ViewCount = 0
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
        if (string.IsNullOrWhiteSpace(request.StoryType) || !AllowedStoryTypes.Contains(request.StoryType.Trim()))
            return BadRequest("story_type must be 'velho_mundo' or 'idade_das_trevas'");
        var slugTaken = await _db.Posts.AnyAsync(p => p.Slug == request.Slug.Trim() && p.Id != id, cancellationToken);
        if (slugTaken)
            return Conflict("Slug already in use");
        post.StoryType = request.StoryType.Trim().ToLowerInvariant();
        post.Title = request.Title.Trim();
        post.Slug = request.Slug.Trim();
        post.Excerpt = request.Excerpt?.Trim();
        post.Content = request.Content ?? string.Empty;
        post.CoverImageUrl = request.CoverImage?.Trim();
        var scheduledAt = ParseScheduledPublishAt(request.ScheduledPublishAt);
        var useSchedule = scheduledAt.HasValue && scheduledAt.Value > DateTime.UtcNow;
        if (useSchedule)
        {
            post.Published = false;
            post.PublishedAt = null;
            post.ScheduledPublishAt = scheduledAt;
        }
        else
        {
            post.ScheduledPublishAt = null;
            post.Published = request.Published;
            post.PublishedAt = request.Published ? (post.PublishedAt ?? DateTime.UtcNow) : null;
        }
        post.StoryOrder = request.StoryOrder;
        if (request.IncludeInStoryOrder.HasValue)
            post.IncludeInStoryOrder = request.IncludeInStoryOrder.Value;
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
        var isAdmin = await _adminService.IsAdminAsync(authorId.Value, cancellationToken);
        if (post.AuthorId != authorId.Value && !isAdmin)
            return Forbid();
        _db.Posts.Remove(post);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// PUT /api/posts/story-order — update story_order for multiple posts (authenticated).
    /// Body: array of { id, story_order }.
    /// </summary>
    [HttpPut("story-order")]
    public async Task<IActionResult> UpdateStoryOrder([FromBody] IEnumerable<StoryOrderItemRequest>? request, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorIdFromHeader();
        if (authorId == null)
            return Unauthorized();
        if (request == null)
            return BadRequest();
        var items = request.ToList();
        foreach (var item in items)
        {
            if (string.IsNullOrWhiteSpace(item.Id) || !Guid.TryParse(item.Id.Trim(), out var id))
                continue;
            var post = await _db.Posts.FindAsync(new object[] { id }, cancellationToken);
            if (post != null)
            {
                post.StoryOrder = item.StoryOrder;
                post.UpdatedAt = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private async Task<bool> CanEditAsync(Guid postId, Guid authorId, CancellationToken cancellationToken)
    {
        if (await _adminService.IsAdminAsync(authorId, cancellationToken))
            return true;
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
            ScheduledPublishAt = p.ScheduledPublishAt?.ToString("O"),
            CreatedAt = p.CreatedAt.ToString("O"),
            UpdatedAt = p.UpdatedAt.ToString("O"),
            StoryOrder = p.StoryOrder,
            StoryType = p.StoryType,
            IncludeInStoryOrder = p.IncludeInStoryOrder,
            ViewCount = p.ViewCount,
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

    private static DateTime? ParseScheduledPublishAt(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        if (DateTime.TryParse(value, null, System.Globalization.DateTimeStyles.RoundtripKind, out var dt))
            return dt.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(dt, DateTimeKind.Utc) : dt.ToUniversalTime();
        return null;
    }
}
