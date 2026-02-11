using System.Text.Json.Serialization;

namespace BlogApi.Models;

/// <summary>
/// Response for GET /api/dashboard/stats (snake_case in JSON).
/// </summary>
public class DashboardStatsDto
{
    [JsonPropertyName("total_posts")]
    public int TotalPosts { get; set; }

    [JsonPropertyName("published_count")]
    public int PublishedCount { get; set; }

    [JsonPropertyName("scheduled_count")]
    public int ScheduledCount { get; set; }

    [JsonPropertyName("draft_count")]
    public int DraftCount { get; set; }

    [JsonPropertyName("total_views")]
    public int TotalViews { get; set; }

    [JsonPropertyName("authors_count")]
    public int AuthorsCount { get; set; }
}
