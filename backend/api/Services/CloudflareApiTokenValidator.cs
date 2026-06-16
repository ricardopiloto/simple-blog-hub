using System.Text.RegularExpressions;

namespace BlogApi.Services;

public static partial class CloudflareApiTokenValidator
{
    public const int LegacyTokenLength = 40;
    public const int MaxTokenLength = 120;
    public const int MinTokenLength = 32;

    // cfut_ / cfat_ + 40 body + 8 hex checksum (Cloudflare scannable format)
    [GeneratedRegex(@"^cf(?:ut|at)_[A-Za-z0-9_-]{40}[a-fA-F0-9]{8}$", RegexOptions.CultureInvariant)]
    private static partial Regex ScannableTokenRegex();

    [GeneratedRegex(@"^cfk_", RegexOptions.CultureInvariant)]
    private static partial Regex GlobalApiKeyPrefixRegex();

    [GeneratedRegex(@"^[a-f0-9]{37,45}$", RegexOptions.CultureInvariant)]
    private static partial Regex LegacyGlobalApiKeyRegex();

    [GeneratedRegex(@"^[A-Za-z0-9_-]+$", RegexOptions.CultureInvariant)]
    private static partial Regex LegacyTokenRegex();

    public static bool TryValidate(string token, out string? error)
    {
        error = null;

        if (token.Length is < MinTokenLength or > MaxTokenLength)
        {
            error =
                $"API Token com comprimento inesperado ({token.Length} caracteres; máximo {MaxTokenLength}). " +
                "Cole apenas o token copiado do dashboard Cloudflare (Workers AI → Use REST API), sem Account ID nem \"Bearer \".";
            return false;
        }

        if (ScannableTokenRegex().IsMatch(token))
            return true;

        if (GlobalApiKeyPrefixRegex().IsMatch(token))
        {
            error =
                "Parece uma Global API Key (prefixo cfk_). Crie um API Token em Workers AI → Use REST API.";
            return false;
        }

        if (token.Length == LegacyTokenLength && LegacyTokenRegex().IsMatch(token))
            return true;

        if (LegacyGlobalApiKeyRegex().IsMatch(token))
        {
            error =
                "Parece uma Global API Key. Crie um API Token em Workers AI → Use REST API — não use a Global API Key.";
            return false;
        }

        if (!LegacyTokenRegex().IsMatch(token))
        {
            error =
                "API Token contém caracteres inválidos. Cole apenas o token tal como o dashboard Cloudflare mostra.";
            return false;
        }

        return true;
    }
}
