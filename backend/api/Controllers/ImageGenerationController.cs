using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;
using BlogApi.Services;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/image-generation")]
public class ImageGenerationController : ControllerBase
{
    private readonly BlogDbContext _db;
    private readonly ICloudflareTokenEncryptionService _encryption;

    public ImageGenerationController(BlogDbContext db, ICloudflareTokenEncryptionService encryption)
    {
        _db = db;
        _encryption = encryption;
    }

    /// <summary>GET /api/image-generation/credentials/{authorId} — internal (BFF only).</summary>
    [HttpGet("credentials/{authorId:guid}")]
    public async Task<ActionResult<CloudflareCredentialsDto>> GetCredentials(Guid authorId, CancellationToken cancellationToken = default)
    {
        var author = await _db.Authors.AsNoTracking().FirstOrDefaultAsync(a => a.Id == authorId, cancellationToken);
        if (author == null)
            return NotFound();

        if (string.IsNullOrWhiteSpace(author.CloudflareAccountId) || string.IsNullOrEmpty(author.CloudflareApiTokenEncrypted))
            return UnprocessableEntity(new { error = "no_credentials" });

        string apiToken;
        try
        {
            apiToken = _encryption.Decrypt(author.CloudflareApiTokenEncrypted);
        }
        catch (InvalidOperationException)
        {
            return StatusCode(500, new { error = "encryption_not_configured" });
        }
        catch (CryptographicException)
        {
            return UnprocessableEntity(new { error = "token_decrypt_failed" });
        }
        catch (FormatException)
        {
            return UnprocessableEntity(new { error = "token_decrypt_failed" });
        }

        return Ok(new CloudflareCredentialsDto
        {
            AccountId = CloudflareCredentialsNormalizer.NormalizeAccountId(author.CloudflareAccountId) ?? string.Empty,
            ApiToken = CloudflareCredentialsNormalizer.NormalizeApiToken(apiToken),
            ImageModel = CloudflareWorkersAiDefaults.ResolveImageModel(author.CloudflareImageModel)
        });
    }
}

public class CloudflareCredentialsDto
{
    [System.Text.Json.Serialization.JsonPropertyName("accountId")]
    public string AccountId { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("apiToken")]
    public string ApiToken { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("imageModel")]
    public string ImageModel { get; set; } = string.Empty;
}
