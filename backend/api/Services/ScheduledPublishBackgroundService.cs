using BlogApi.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

/// <summary>
/// Periodically publishes posts whose ScheduledPublishAt is in the past.
/// </summary>
public class ScheduledPublishBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScheduledPublishBackgroundService> _logger;
    private static readonly TimeSpan Interval = TimeSpan.FromMinutes(1);

    public ScheduledPublishBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<ScheduledPublishBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PublishScheduledPostsAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing scheduled posts");
            }

            await Task.Delay(Interval, stoppingToken);
        }
    }

    private async Task PublishScheduledPostsAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
        var now = DateTime.UtcNow;

        var toPublish = await db.Posts
            .Where(p => p.ScheduledPublishAt != null && p.ScheduledPublishAt <= now && !p.Published)
            .ToListAsync(cancellationToken);

        if (toPublish.Count == 0)
            return;

        foreach (var post in toPublish)
        {
            post.Published = true;
            post.PublishedAt = post.ScheduledPublishAt ?? now;
            post.ScheduledPublishAt = null;
        }

        await db.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Published {Count} scheduled post(s)", toPublish.Count);
    }
}
