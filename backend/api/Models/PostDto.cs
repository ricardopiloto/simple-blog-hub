using System.Text.Json.Serialization;

namespace BlogApi.Models;

/// <summary>
/// Response DTO aligned with frontend Post type (snake_case in JSON).
/// </summary>
public class PostDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("excerpt")]
    public string? Excerpt { get; set; }

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("cover_image")]
    public string? CoverImage { get; set; }

    [JsonPropertyName("published")]
    public bool Published { get; set; }

    [JsonPropertyName("published_at")]
    public string? PublishedAt { get; set; }

    [JsonPropertyName("created_at")]
    public string CreatedAt { get; set; } = string.Empty;

    [JsonPropertyName("updated_at")]
    public string UpdatedAt { get; set; } = string.Empty;

    [JsonPropertyName("story_order")]
    public int StoryOrder { get; set; }

    [JsonPropertyName("author_id")]
    public string? AuthorId { get; set; }

    [JsonPropertyName("view_count")]
    public int ViewCount { get; set; }

    [JsonPropertyName("author")]
    public AuthorDto Author { get; set; } = null!;

    [JsonPropertyName("collaborators")]
    public List<CollaboratorDto>? Collaborators { get; set; }
}

/// <summary>
/// Response for GET /api/posts/next-story-order (snake_case in JSON).
/// </summary>
public class NextStoryOrderResponse
{
    [JsonPropertyName("next_story_order")]
    public int NextStoryOrder { get; set; }
}

public class CollaboratorDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

public class AddCollaboratorRequest
{
    [JsonPropertyName("author_id")]
    public string AuthorId { get; set; } = string.Empty;
}

public class StoryOrderItemRequest
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("story_order")]
    public int StoryOrder { get; set; }
}

public class CreateOrUpdatePostRequest
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("excerpt")]
    public string? Excerpt { get; set; }

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("cover_image")]
    public string? CoverImage { get; set; }

    [JsonPropertyName("published")]
    public bool Published { get; set; }

    [JsonPropertyName("story_order")]
    public int StoryOrder { get; set; }
}

public class AuthorDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }

    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
}
