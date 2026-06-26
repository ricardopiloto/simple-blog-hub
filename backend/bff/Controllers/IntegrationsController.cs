using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using BlogBff.Authorization;
using BlogBff.Models;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/integrations")]
[RequireIntegrationKey]
[EnableRateLimiting("Integrations")]
public class IntegrationsController : ControllerBase
{
    private readonly ApiClient _api;
    private readonly AdminAuthorResolver _adminAuthorResolver;
    private readonly PostCoverUploadService _coverUpload;
    private readonly OpenRouterImagesClient _openRouter;
    private readonly ILogger<IntegrationsController> _logger;

    public IntegrationsController(
        ApiClient api,
        AdminAuthorResolver adminAuthorResolver,
        PostCoverUploadService coverUpload,
        OpenRouterImagesClient openRouter,
        ILogger<IntegrationsController> logger)
    {
        _api = api;
        _adminAuthorResolver = adminAuthorResolver;
        _coverUpload = coverUpload;
        _openRouter = openRouter;
        _logger = logger;
    }

    [HttpPost("posts")]
    [RequestSizeLimit(PostCoverUploadService.MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = PostCoverUploadService.MaxFileSizeBytes)]
    public async Task<IActionResult> CreatePost(CancellationToken cancellationToken = default)
    {
        Guid adminAuthorId;
        try
        {
            adminAuthorId = await _adminAuthorResolver.ResolveAsync(cancellationToken);
        }
        catch (AdminAuthorResolutionException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = ex.Message });
        }

        var metadata = IntegrationPostMetadataParser.Parse(Request.Form);
        var coverUrl = metadata.CoverImage;

        var coverFile = Request.Form.Files.GetFile("cover");
        if (coverFile != null)
        {
            var (uploadResult, uploadError) = await _coverUpload.SaveCoverFileAsync(coverFile, cancellationToken);
            if (uploadError != null)
                return BadRequest(new { error = uploadError });
            coverUrl = uploadResult!.PublicUrl;
        }

        int? nextStoryOrder = null;
        if (!metadata.StoryOrder.HasValue)
        {
            var nextOrderResponse = await _api.GetNextStoryOrderAsync(adminAuthorId, cancellationToken);
            if (nextOrderResponse.IsSuccessStatusCode)
            {
                var nextOrderBody = await nextOrderResponse.Content.ReadFromJsonAsync<NextStoryOrderResponse>(cancellationToken);
                nextStoryOrder = nextOrderBody?.NextStoryOrder;
            }
        }

        var (payload, error) = IntegrationPostPayloadBuilder.BuildCreatePayload(metadata, coverUrl, nextStoryOrder);
        if (error != null)
            return BadRequest(new { error });

        var response = await _api.CreatePostAsync(payload!, adminAuthorId, cancellationToken);
        if (response.StatusCode == HttpStatusCode.Conflict)
            return Conflict(new { error = "Slug já em uso." });

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode, Content(content, "application/json"));

        _logger.LogInformation("Integration: PostCreated Slug={Slug}", payload!["slug"]);
        return StatusCode((int)response.StatusCode, Content(content, "application/json"));
    }

    [HttpPut("posts/{slug}")]
    [RequestSizeLimit(PostCoverUploadService.MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = PostCoverUploadService.MaxFileSizeBytes)]
    public async Task<IActionResult> UpdatePostBySlug(string slug, CancellationToken cancellationToken = default)
    {
        Guid adminAuthorId;
        try
        {
            adminAuthorId = await _adminAuthorResolver.ResolveAsync(cancellationToken);
        }
        catch (AdminAuthorResolutionException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = ex.Message });
        }

        var existing = await FindPostBySlugAsync(slug, adminAuthorId, cancellationToken);
        if (existing == null)
            return NotFound(new { error = "Post não encontrado. Use POST para criar." });

        var metadata = IntegrationPostMetadataParser.Parse(Request.Form);
        if (string.IsNullOrWhiteSpace(metadata.Slug))
            metadata.Slug = slug;

        var coverUrl = metadata.CoverImage;
        var coverFile = Request.Form.Files.GetFile("cover");
        if (coverFile != null)
        {
            var (uploadResult, uploadError) = await _coverUpload.SaveCoverFileAsync(coverFile, cancellationToken);
            if (uploadError != null)
                return BadRequest(new { error = uploadError });
            coverUrl = uploadResult!.PublicUrl;
        }

        var (payload, error) = IntegrationPostPayloadBuilder.BuildUpdatePayload(metadata, existing, coverUrl);
        if (error != null)
            return BadRequest(new { error });

        if (!Guid.TryParse(existing.Id, out var postId))
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Post inválido." });

        var response = await _api.UpdatePostAsync(postId, payload!, adminAuthorId, cancellationToken);
        if (response.StatusCode == HttpStatusCode.NotFound)
            return NotFound();
        if (response.StatusCode == HttpStatusCode.Conflict)
            return Conflict(new { error = "Slug já em uso." });

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode, Content(content, "application/json"));

        _logger.LogInformation("Integration: PostUpdated Slug={Slug}", slug);
        return Content(content, "application/json");
    }

    [HttpGet("posts/next-story-order")]
    public async Task<IActionResult> GetNextStoryOrder(CancellationToken cancellationToken = default)
    {
        Guid adminAuthorId;
        try
        {
            adminAuthorId = await _adminAuthorResolver.ResolveAsync(cancellationToken);
        }
        catch (AdminAuthorResolutionException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = ex.Message });
        }

        var response = await _api.GetNextStoryOrderAsync(adminAuthorId, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return Content(content, "application/json");
    }

    [HttpPost("image-generation/generate")]
    public async Task<IActionResult> GenerateImage(
        [FromBody] IntegrationGenerateImageRequest? body,
        [FromQuery] bool upload = false,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(body?.Prompt))
            return BadRequest(new { error = "prompt é obrigatório." });

        if (string.IsNullOrEmpty(_openRouter.GetConfiguredApiKey()))
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "OpenRouter não está configurado." });

        string imageBase64;
        try
        {
            imageBase64 = await _openRouter.GenerateImageBase64Async(body.Prompt.Trim(), body.Model, cancellationToken);
        }
        catch (OpenRouterImagesException ex)
        {
            var status = ex.StatusCode.HasValue ? (int)ex.StatusCode.Value : StatusCodes.Status502BadGateway;
            if (status is < 400 or > 599)
                status = StatusCodes.Status502BadGateway;
            return StatusCode(status, new { error = ex.Message });
        }

        if (!upload)
            return Ok(new { image = imageBase64 });

        var (uploadResult, uploadError) = await _coverUpload.SaveCoverFromBase64Async(imageBase64, cancellationToken);
        if (uploadError != null)
            return BadRequest(new { error = uploadError });

        return Ok(new { image = imageBase64, cover_url = uploadResult!.PublicUrl });
    }

    private async Task<IntegrationPostMetadata?> FindPostBySlugAsync(string slug, Guid adminAuthorId, CancellationToken cancellationToken)
    {
        var response = await _api.GetAllPostsForAuthorAreaAsync(adminAuthorId, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return null;

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(content);
        if (doc.RootElement.ValueKind != JsonValueKind.Array)
            return null;

        foreach (var item in doc.RootElement.EnumerateArray())
        {
            if (!item.TryGetProperty("slug", out var slugProp))
                continue;
            if (!string.Equals(slugProp.GetString(), slug, StringComparison.OrdinalIgnoreCase))
                continue;

            return new IntegrationPostMetadata
            {
                Id = item.TryGetProperty("id", out var idProp) ? idProp.GetString() : null,
                Title = item.TryGetProperty("title", out var titleProp) ? titleProp.GetString() : null,
                Slug = slugProp.GetString(),
                Content = item.TryGetProperty("content", out var contentProp) ? contentProp.GetString() : null,
                StoryType = item.TryGetProperty("story_type", out var storyTypeProp) ? storyTypeProp.GetString() : null,
                Excerpt = item.TryGetProperty("excerpt", out var excerptProp) ? excerptProp.GetString() : null,
                CoverImage = item.TryGetProperty("cover_image", out var coverProp) ? coverProp.GetString() : null,
                ScheduledPublishAt = item.TryGetProperty("scheduled_publish_at", out var scheduledProp) ? scheduledProp.GetString() : null,
                Published = item.TryGetProperty("published", out var publishedProp) && publishedProp.GetBoolean(),
                StoryOrder = item.TryGetProperty("story_order", out var storyOrderProp) ? storyOrderProp.GetInt32() : null,
                IncludeInStoryOrder = item.TryGetProperty("include_in_story_order", out var includeProp) && includeProp.GetBoolean()
            };
        }

        return null;
    }

    private sealed class NextStoryOrderResponse
    {
        [JsonPropertyName("next_story_order")]
        public int NextStoryOrder { get; set; }
    }
}
