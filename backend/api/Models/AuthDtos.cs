using System.Text.Json.Serialization;

namespace BlogApi.Models;

public class LoginRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>Response from API auth/login (no token; BFF issues JWT).</summary>
public class LoginResponse
{
    [JsonPropertyName("user_id")]
    public string UserId { get; set; } = string.Empty;

    [JsonPropertyName("author_id")]
    public string AuthorId { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("is_admin")]
    public bool IsAdmin { get; set; }

    [JsonPropertyName("must_change_password")]
    public bool MustChangePassword { get; set; }

    [JsonPropertyName("author")]
    public AuthorDto Author { get; set; } = null!;
}
