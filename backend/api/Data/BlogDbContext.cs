using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Data;

public class BlogDbContext : DbContext
{
    public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options) { }

    public DbSet<Author> Authors => Set<Author>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<User> Users => Set<User>();
    public DbSet<PostCollaborator> PostCollaborators => Set<PostCollaborator>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .HasIndex(p => p.Slug)
            .IsUnique();
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(a => a.Posts)
            .HasForeignKey(p => p.AuthorId);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Author)
            .WithOne(a => a.User)
            .HasForeignKey<User>(u => u.AuthorId);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<PostCollaborator>()
            .HasKey(pc => new { pc.PostId, pc.AuthorId });
        modelBuilder.Entity<PostCollaborator>()
            .HasOne(pc => pc.Post)
            .WithMany(p => p.Collaborators)
            .HasForeignKey(pc => pc.PostId);
        modelBuilder.Entity<PostCollaborator>()
            .HasOne(pc => pc.Author)
            .WithMany(a => a.Collaborations)
            .HasForeignKey(pc => pc.AuthorId);
    }
}
