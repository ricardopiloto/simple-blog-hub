namespace BlogApi.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    /// <summary>When true, user must change password on next login (e.g. default or reset password).</summary>
    public bool MustChangePassword { get; set; }

    public Author Author { get; set; } = null!;
}
