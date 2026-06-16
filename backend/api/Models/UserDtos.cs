using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlogApi.Models;

public class UserListDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("author_id")]
    public string AuthorId { get; set; } = string.Empty;

    [JsonPropertyName("author_name")]
    public string AuthorName { get; set; } = string.Empty;

    [JsonPropertyName("author_bio")]
    public string? AuthorBio { get; set; }

    [JsonPropertyName("cloudflare_account_id")]
    public string? CloudflareAccountId { get; set; }

    [JsonPropertyName("has_cloudflare_api_token")]
    public bool HasCloudflareApiToken { get; set; }

    [JsonPropertyName("cloudflare_image_model")]
    public string? CloudflareImageModel { get; set; }
}

public class CreateUserRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    /// <summary>Optional; when omitted or empty, API uses SeedData.InitialAdminDefaultPassword.</summary>
    [JsonPropertyName("password")]
    public string? Password { get; set; }

    [Required]
    [MaxLength(200)]
    [JsonPropertyName("author_name")]
    public string AuthorName { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    [EmailAddress]
    [MaxLength(256)]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("password")]
    public string? Password { get; set; }

    [MaxLength(200)]
    [JsonPropertyName("author_name")]
    public string? AuthorName { get; set; }

    [MaxLength(500)]
    [JsonPropertyName("author_bio")]
    public string? Bio { get; set; }

    [MaxLength(64)]
    [JsonPropertyName("cloudflare_account_id")]
    public string? CloudflareAccountId { get; set; }

    [JsonPropertyName("cloudflare_api_token")]
    public string? CloudflareApiToken { get; set; }

    [JsonPropertyName("cloudflare_image_model")]
    public string? CloudflareImageModel { get; set; }
}
