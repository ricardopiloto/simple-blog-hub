namespace BlogApi.Services;

public static class CloudflareWorkersAiDefaults
{
    public const string DefaultImageModel = "@cf/black-forest-labs/flux-1-schnell";

    public static string ResolveImageModel(string? stored) =>
        string.IsNullOrWhiteSpace(stored) ? DefaultImageModel : stored.Trim();
}
