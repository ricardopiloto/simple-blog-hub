using System.Text.RegularExpressions;

namespace BlogApi.Services;

public static partial class CloudflareImageModelValidator
{
    private const int MaxLength = 128;

    [GeneratedRegex(@"^@cf/[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+$", RegexOptions.CultureInvariant)]
    private static partial Regex ModelPathRegex();

    public static bool TryNormalize(string? value, out string? normalized, out string? error)
    {
        normalized = null;
        error = null;

        if (value == null)
            return true;

        var trimmed = value.Trim();
        if (trimmed.Length == 0)
            return true;

        if (trimmed.Length > MaxLength)
        {
            error = "cloudflare_image_model must be at most 128 characters.";
            return false;
        }

        if (!ModelPathRegex().IsMatch(trimmed))
        {
            error = "cloudflare_image_model must match format @cf/author/model (e.g. @cf/black-forest-labs/flux-1-schnell).";
            return false;
        }

        normalized = trimmed;
        return true;
    }
}
