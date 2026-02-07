namespace BlogApi.Models;

public class Post
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public bool Published { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int StoryOrder { get; set; }
    public Guid AuthorId { get; set; }
    /// <summary>Number of times the post has been viewed (public GET by slug). Only exposed to authenticated users via BFF.</summary>
    public int ViewCount { get; set; }

    public Author Author { get; set; } = null!;
    public ICollection<PostCollaborator> Collaborators { get; set; } = new List<PostCollaborator>();
}
