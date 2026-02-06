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
}

public class CreateUserRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string? Password { get; set; }

    [JsonPropertyName("author_name")]
    public string AuthorName { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("password")]
    public string? Password { get; set; }

    [JsonPropertyName("author_name")]
    public string? AuthorName { get; set; }

    [JsonPropertyName("author_bio")]
    public string? Bio { get; set; }
}
