namespace BlogBff.Services;

public static class CoverArtPromptFormatter
{
    public const string GrimdarkFantasyTag = "Grimdark fantasy";
    public const string PhotographicTag = "Photographic";
    public const string DefaultStyleSuffix = ", Grimdark fantasy, Photographic";

    public static string EnsureStyleTags(string prompt)
    {
        var trimmed = prompt.Trim();
        var hasGrimdark = ContainsTag(trimmed, "grimdark");
        var hasPhotographic = ContainsTag(trimmed, "photographic");
        if (hasGrimdark && hasPhotographic)
            return trimmed;

        var suffix = new List<string>();
        if (!hasGrimdark)
            suffix.Add(GrimdarkFantasyTag);
        if (!hasPhotographic)
            suffix.Add(PhotographicTag);
        return trimmed + ", " + string.Join(", ", suffix);
    }

    private static bool ContainsTag(string prompt, string tag) =>
        prompt.Contains(tag, StringComparison.OrdinalIgnoreCase);
}
