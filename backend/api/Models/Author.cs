namespace BlogApi.Models;

public class Author
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User? User { get; set; }
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<PostCollaborator> Collaborations { get; set; } = new List<PostCollaborator>();
}
