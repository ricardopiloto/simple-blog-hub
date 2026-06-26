using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace BlogBff.Helpers;

public static partial class SlugHelper
{
    private static readonly Regex SlugPattern = SlugValidationRegex();

    public static string Slugify(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var normalized = text.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);
        foreach (var ch in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category == UnicodeCategory.NonSpacingMark)
                continue;
            builder.Append(ch);
        }

        var slug = builder.ToString();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", string.Empty);
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }

    public static bool IsValidSlug(string slug) => !string.IsNullOrWhiteSpace(slug) && SlugPattern.IsMatch(slug);

    [GeneratedRegex(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.CultureInvariant)]
    private static partial Regex SlugValidationRegex();
}
