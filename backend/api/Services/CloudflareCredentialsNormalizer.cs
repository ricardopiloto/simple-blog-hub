namespace BlogApi.Services;

public static class CloudflareCredentialsNormalizer
{
    public static string? NormalizeAccountId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;
        return value.Trim();
    }

    public static string NormalizeApiToken(string value)
    {
        var token = value.Trim();
        if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            token = token[7..].Trim();
        token = new string(token.Where(static c => !char.IsControl(c)).ToArray());
        return token.Replace("\u200B", string.Empty).Replace("\uFEFF", string.Empty);
    }
}
