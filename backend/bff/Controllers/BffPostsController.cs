using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Models;
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

    private static Guid? GetAuthorId(ClaimsPrincipal user)
    {
        var value = user.FindFirst("author_id")?.Value ?? user.FindFirst(c => c.Type.EndsWith("/author_id", StringComparison.Ordinal))?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
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
    /// GET /bff/posts/editable — protegido; lista posts que o autor pode editar.
    /// </summary>
    [HttpGet("editable")]
    [Authorize]
    public async Task<IActionResult> GetEditable(CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetEditablePostsAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// GET /bff/posts/edit/{id} — protegido; post para edição (conteúdo em Markdown).
    /// </summary>
    [HttpGet("edit/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetByIdForEdit(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetPostByIdForEditAsync(id, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// POST /bff/posts — protegido; criar post.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.CreatePostAsync(body, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, Content(content, "application/json"));
    }

    /// <summary>
    /// PUT /bff/posts/{id} — protegido; atualizar post.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdatePost(Guid id, [FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.UpdatePostAsync(id, body, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// DELETE /bff/posts/{id} — protegido; apenas dono pode excluir.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        var response = await _api.DeletePostAsync(id, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        return response.IsSuccessStatusCode ? NoContent() : StatusCode((int)response.StatusCode);
    }

    /// <summary>
    /// POST /bff/posts/{id}/collaborators — protegido; apenas dono adiciona colaborador.
    /// </summary>
    [HttpPost("{id:guid}/collaborators")]
    [Authorize]
    public async Task<IActionResult> AddCollaborator(Guid id, [FromBody] AddCollaboratorRequest body, CancellationToken cancellationToken = default)
    {
        var authorId = GetAuthorId(User);
        if (authorId == null)
            return Unauthorized();
        if (string.IsNullOrWhiteSpace(body?.AuthorId))
            return BadRequest();
        if (!Guid.TryParse(body.AuthorId.Trim(), out var collaboratorId))
            return BadRequest();
        var response = await _api.AddCollaboratorAsync(id, collaboratorId, authorId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            return Conflict();
        return response.IsSuccessStatusCode ? NoContent() : StatusCode((int)response.StatusCode);
    }

    /// <summary>
    /// DELETE /bff/posts/{id}/collaborators/{authorId} — protegido; apenas dono remove colaborador.
    /// </summary>
    [HttpDelete("{id:guid}/collaborators/{authorId:guid}")]
    [Authorize]
    public async Task<IActionResult> RemoveCollaborator(Guid id, Guid authorId, CancellationToken cancellationToken = default)
    {
        var callerId = GetAuthorId(User);
        if (callerId == null)
            return Unauthorized();
        var response = await _api.RemoveCollaboratorAsync(id, authorId, callerId.Value, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            return Forbid();
        return response.IsSuccessStatusCode ? NoContent() : StatusCode((int)response.StatusCode);
    }

    /// <summary>
    /// GET /bff/posts/{slug} — post por slug (público; conteúdo em HTML).
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken = default)
    {
        if (slug.Equals("editable", StringComparison.OrdinalIgnoreCase) || slug.Equals("edit", StringComparison.OrdinalIgnoreCase))
            return NotFound();
        var response = await _api.GetPostBySlugAsync(slug, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound();
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }
}
