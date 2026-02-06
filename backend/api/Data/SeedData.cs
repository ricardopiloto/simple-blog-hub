using System.IO;
using BlogApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BlogApi.Data;

public static class SeedData
{
    /// <summary>Default filename for admin password reset trigger (placed in current directory if path not configured).</summary>
    public const string DefaultAdminPasswordResetTriggerFileName = "admin-password-reset.trigger";
    /// <summary>Default seed user: ana@example.com / senha123</summary>
    public const string SeedUserEmail = "ana@example.com";
    public const string SeedUserPassword = "senha123";

    /// <summary>Default password for the initial admin account created from Admin:Email.</summary>
    public const string InitialAdminDefaultPassword = "senha123";

    /// <summary>Default admin email when Admin:Email is not configured (e.g. first-time deploy).</summary>
    public const string DefaultAdminEmail = "admin@admin.com";

    public static async Task EnsureSeedAsync(BlogDbContext db, IConfiguration configuration, CancellationToken cancellationToken = default)
    {
        if (!configuration.GetValue<bool>("Seed:EnableDemoData"))
            return;
        if (!await db.Authors.AnyAsync(cancellationToken))
        {
        var authorId = Guid.NewGuid();
        var author = new Author
        {
            Id = authorId,
            Name = "Ana Silva",
            AvatarUrl = null,
            Bio = "Escritora e sonhadora. Apaixonada por histórias que tocam a alma.",
            CreatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc)
        };
        db.Authors.Add(author);

        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = SeedUserEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(SeedUserPassword),
            AuthorId = authorId,
            CreatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
            MustChangePassword = true
        };
        db.Users.Add(user);

        var posts = new[]
        {
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "O Início da Jornada",
                Slug = "o-inicio-da-jornada",
                Excerpt = "Tudo começou em uma manhã de primavera, quando o destino cruzou nossos caminhos de maneira inesperada.",
                Content = @"<p>Tudo começou em uma manhã de primavera, quando o destino cruzou nossos caminhos de maneira inesperada. O sol nascia preguiçoso no horizonte, pintando o céu com tons de laranja e rosa.</p><p>Naquele momento, eu não sabia que minha vida estava prestes a mudar completamente. As ruas ainda estavam silenciosas, com apenas o som distante de pássaros anunciando um novo dia.</p><h2>O Encontro</h2><p>Foi então que vi pela primeira vez. Uma figura enigmática, parada na esquina, como se esperasse por algo — ou alguém. Nossos olhares se cruzaram por um breve instante, e naquele segundo, algo mudou dentro de mim.</p><p>Essa é a história que preciso contar. Uma história sobre amor, perdas, descobertas e, acima de tudo, sobre encontrar o caminho de volta para casa.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
                Published = true,
                PublishedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
                StoryOrder = 1,
                AuthorId = authorId
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "Atravessando o Deserto",
                Slug = "atravessando-o-deserto",
                Excerpt = "O caminho mais difícil às vezes é o único que nos leva aonde precisamos estar.",
                Content = @"<p>O caminho mais difícil às vezes é o único que nos leva aonde precisamos estar. O deserto se estendia infinito diante de mim, um mar de areia dourada sob o sol impiedoso.</p><p>Cada passo era uma batalha contra o cansaço, contra a dúvida, contra a vontade de desistir. Mas havia algo dentro de mim que se recusava a parar.</p><h2>A Prova de Fogo</h2><p>O deserto não perdoa os fracos, mas também não recompensa apenas os fortes. Ele ensina que a verdadeira força está na persistência, na capacidade de dar mais um passo quando todos os seus instintos gritam para você parar.</p><p>Foi nesse momento que entendi: a jornada não era sobre o destino, mas sobre quem eu me tornava no caminho.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
                Published = true,
                PublishedAt = new DateTime(2024, 2, 20, 14, 30, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 2, 20, 14, 30, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 2, 20, 14, 30, 0, DateTimeKind.Utc),
                StoryOrder = 2,
                AuthorId = authorId
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "O Oásis Escondido",
                Slug = "o-oasis-escondido",
                Excerpt = "Em meio à aridez, encontrei um refúgio que mudaria para sempre minha perspectiva.",
                Content = @"<p>Em meio à aridez, encontrei um refúgio que mudaria para sempre minha perspectiva. O oásis surgiu como uma miragem, mas dessa vez era real — tão real quanto o alívio que inundou meu coração.</p><p>Palmeiras verdejantes emolduravam um lago cristalino, e pela primeira vez em semanas, senti esperança renovada.</p><h2>Renovação</h2><p>Ali, encontrei outros viajantes. Cada um com sua própria história, suas próprias cicatrizes. Descobri que não estava sozinha nessa jornada, e que às vezes, a companhia certa pode fazer toda a diferença.</p><p>O oásis me ensinou sobre gratidão e sobre a importância de pausar para reconhecer as bênçãos ao longo do caminho.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop",
                Published = true,
                PublishedAt = new DateTime(2024, 3, 10, 9, 15, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 3, 10, 9, 15, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 3, 10, 9, 15, 0, DateTimeKind.Utc),
                StoryOrder = 3,
                AuthorId = authorId
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "A Montanha Sagrada",
                Slug = "a-montanha-sagrada",
                Excerpt = "Subir a montanha foi o maior desafio até então, mas a vista do topo compensou cada sacrifício.",
                Content = @"<p>Subir a montanha foi o maior desafio até então, mas a vista do topo compensou cada sacrifício. A Montanha Sagrada erguia-se imponente, seus picos nevados tocando as nuvens.</p><p>Cada metro de altitude era conquistado com suor e determinação. O ar rarefeito desafiava meus pulmões, mas meu espírito permanecia inabalável.</p><h2>A Escalada</h2><p>No caminho, encontrei símbolos antigos esculpidos nas rochas — mensagens deixadas por aqueles que vieram antes de mim. Cada símbolo contava uma parte da história maior, uma história que eu agora fazia parte.</p><p>No topo, com o mundo aos meus pés, finalmente entendi o propósito da jornada.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
                Published = true,
                PublishedAt = new DateTime(2024, 4, 5, 16, 45, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 4, 5, 16, 45, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 4, 5, 16, 45, 0, DateTimeKind.Utc),
                StoryOrder = 4,
                AuthorId = authorId
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "O Retorno ao Lar",
                Slug = "o-retorno-ao-lar",
                Excerpt = "Depois de tudo, voltar para casa revelou que a maior transformação havia acontecido dentro de mim.",
                Content = @"<p>Depois de tudo, voltar para casa revelou que a maior transformação havia acontecido dentro de mim. As mesmas ruas que eu conhecia tão bem pareciam diferentes — ou talvez eu é que fosse diferente.</p><p>O lar que deixei não era mais o mesmo, mas eu finalmente entendia que não era o lugar que precisava mudar, e sim minha forma de enxergar o mundo.</p><h2>A Revelação</h2><p>A jornada me ensinou que casa não é um lugar, é um sentimento. É pertencer a algo maior que nós mesmos, é encontrar paz em meio ao caos.</p><p>E assim, minha história encontrou seu fim — ou seria seu novo começo? Afinal, toda chegada é também uma partida para uma nova aventura.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop",
                Published = true,
                PublishedAt = new DateTime(2024, 5, 1, 11, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 5, 1, 11, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 5, 1, 11, 0, 0, DateTimeKind.Utc),
                StoryOrder = 5,
                AuthorId = authorId
            }
        };

        foreach (var post in posts)
            db.Posts.Add(post);

        await db.SaveChangesAsync(cancellationToken);
        return;
        }

        // Ensure at least one user for existing DBs (e.g. after adding User table)
        if (!await db.Users.AnyAsync(cancellationToken))
        {
            var firstAuthor = await db.Authors.OrderBy(a => a.CreatedAt).FirstAsync(cancellationToken);
            db.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = SeedUserEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(SeedUserPassword),
                AuthorId = firstAuthor.Id,
                CreatedAt = DateTime.UtcNow,
                MustChangePassword = true
            });
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>Ensures the admin user from Admin:Email (or default admin@admin.com) exists with default password. Call after EnsureSeedAsync.</summary>
    public static async Task EnsureInitialAdminUserAsync(BlogDbContext db, IConfiguration configuration, CancellationToken cancellationToken = default)
    {
        var adminEmail = configuration["Admin:Email"]?.Trim();
        if (string.IsNullOrEmpty(adminEmail))
            adminEmail = DefaultAdminEmail;
        if (await db.Users.AnyAsync(u => u.Email == adminEmail, cancellationToken))
            return;

        var authorId = Guid.NewGuid();
        var author = new Author
        {
            Id = authorId,
            Name = "Admin",
            AvatarUrl = null,
            Bio = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Authors.Add(author);
        db.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(InitialAdminDefaultPassword),
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow,
            MustChangePassword = true
        });
        await db.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// If the admin password reset trigger file exists: resets the Admin user's password to the default,
    /// sets MustChangePassword = true, then deletes the file. Safe: I/O exceptions are caught and logged; startup does not fail.
    /// </summary>
    public static async Task TryResetAdminPasswordByTriggerFileAsync(
        BlogDbContext db,
        IConfiguration configuration,
        ILogger? logger = null,
        CancellationToken cancellationToken = default)
    {
        string? triggerPath = configuration["Admin:PasswordResetTriggerPath"]?.Trim();
        if (string.IsNullOrEmpty(triggerPath))
            triggerPath = Path.Combine(Directory.GetCurrentDirectory(), DefaultAdminPasswordResetTriggerFileName);
        else if (!Path.IsPathRooted(triggerPath))
            triggerPath = Path.Combine(Directory.GetCurrentDirectory(), triggerPath);

        if (!File.Exists(triggerPath))
            return;

        try
        {
            var adminEmail = configuration["Admin:Email"]?.Trim();
            if (string.IsNullOrEmpty(adminEmail))
                adminEmail = DefaultAdminEmail;

            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == adminEmail, cancellationToken);
            if (user == null)
            {
                logger?.LogWarning("Admin password reset trigger file found but no user with Admin email {Email}; skipping reset.", adminEmail);
                return;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(InitialAdminDefaultPassword);
            user.MustChangePassword = true;
            await db.SaveChangesAsync(cancellationToken);

            File.Delete(triggerPath);
            logger?.LogInformation("Admin password has been reset to default (trigger file removed). User must change password on next login.");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Error while processing admin password reset trigger file at {Path}; file not deleted.", triggerPath);
        }
    }
}
