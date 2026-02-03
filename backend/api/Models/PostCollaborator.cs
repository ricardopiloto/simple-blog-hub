namespace BlogApi.Models;

public class PostCollaborator
{
    public Guid PostId { get; set; }
    public Guid AuthorId { get; set; }

    public Post Post { get; set; } = null!;
    public Author Author { get; set; } = null!;
}
