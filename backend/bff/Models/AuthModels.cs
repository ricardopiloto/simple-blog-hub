using System.Text.Json.Serialization;

namespace BlogBff.Models;

public class LoginRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

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
    public AuthorInfo Author { get; set; } = null!;
}

public class AuthorInfo
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }

    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
}

public class AddCollaboratorRequest
{
    [JsonPropertyName("author_id")]
    public string? AuthorId { get; set; }
}
