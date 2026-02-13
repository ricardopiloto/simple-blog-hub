using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Extensions;
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

    /// <summary>
    /// GET /bff/posts?order=date|story or ?page=1&amp;pageSize=6&amp;search= — lista posts publicados (delega à API).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] string order = "date", [FromQuery] int? page = null, [FromQuery] int? pageSize = null, [FromQuery] string? search = null, [FromQuery] string? fromDate = null, [FromQuery] string? toDate = null, CancellationToken cancellationToken = default)
    {
        var response = await _api.GetPostsAsync(published: true, order: order, page: page, pageSize: pageSize, search: search, fromDate: fromDate, toDate: toDate, cancellationToken);
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
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetEditablePostsAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// GET /bff/posts/author-area — protegido; lista todos os posts para a Área do Autor (com autor e colaboradores).
    /// </summary>
    [HttpGet("author-area")]
    [Authorize]
    public async Task<IActionResult> GetForAuthorArea(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetAllPostsForAuthorAreaAsync(authorId.Value, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    /// <summary>
    /// GET /bff/posts/next-story-order — protegido; próxima ordem narrativa sugerida para novo post.
    /// </summary>
    [HttpGet("next-story-order")]
    [Authorize]
    public async Task<IActionResult> GetNextStoryOrder(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.GetNextStoryOrderAsync(authorId.Value, cancellationToken);
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
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
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
    /// PUT /bff/posts/story-order — protegido; atualizar ordem narrativa de vários posts.
    /// </summary>
    [HttpPut("story-order")]
    [Authorize]
    public async Task<IActionResult> UpdateStoryOrder([FromBody] object body, CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();
        var response = await _api.UpdateStoryOrderAsync(body, authorId.Value, cancellationToken);
        return response.IsSuccessStatusCode ? NoContent() : StatusCode((int)response.StatusCode);
    }

    /// <summary>
    /// DELETE /bff/posts/{id} — protegido; apenas dono pode excluir.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(Guid id, CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
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
        var authorId = User.GetAuthorId();
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
        var callerId = User.GetAuthorId();
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
    /// GET /bff/posts/{slug} — post por slug (público; conteúdo em HTML). view_count only when authenticated.
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
        if (!(User.Identity?.IsAuthenticated == true))
        {
            try
            {
                using var doc = JsonDocument.Parse(content);
                var root = doc.RootElement;
                var writer = new System.IO.MemoryStream();
                using (var jsonWriter = new Utf8JsonWriter(writer, new JsonWriterOptions { Indented = false }))
                {
                    jsonWriter.WriteStartObject();
                    foreach (var prop in root.EnumerateObject())
                    {
                        if (prop.Name.Equals("view_count", StringComparison.OrdinalIgnoreCase))
                            continue;
                        prop.WriteTo(jsonWriter);
                    }
                    jsonWriter.WriteEndObject();
                }
                content = System.Text.Encoding.UTF8.GetString(writer.ToArray());
            }
            catch
            {
                // If parse fails, return original content (view_count may still be present)
            }
        }
        return Content(content, "application/json");
    }
}
