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
    /// <summary>When set, post is scheduled to be published at this UTC time; remains draft until then.</summary>
    public DateTime? ScheduledPublishAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int StoryOrder { get; set; }
    /// <summary>Story line: velho_mundo or idade_das_trevas. Required.</summary>
    public string StoryType { get; set; } = "velho_mundo";
    /// <summary>When true, post appears in Índice da História and in prev/next sequence. Default true.</summary>
    public bool IncludeInStoryOrder { get; set; } = true;
    public Guid AuthorId { get; set; }
    /// <summary>Number of times the post has been viewed (public GET by slug). Only exposed to authenticated users via BFF.</summary>
    public int ViewCount { get; set; }

    public Author Author { get; set; } = null!;
    public ICollection<PostCollaborator> Collaborators { get; set; } = new List<PostCollaborator>();
}
