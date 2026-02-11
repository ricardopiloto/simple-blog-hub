using Ganss.Xss;
using Markdig;

namespace BlogApi.Services;

public static class MarkdownService
{
    private static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder().Build();
    private static readonly HtmlSanitizer Sanitizer = new HtmlSanitizer(); // removes script, iframe, on*, javascript: by default

    /// <summary>Converts Markdown to HTML for public reading; all output is sanitized to prevent XSS. If content looks like HTML (starts with &lt;), pass-through then sanitize; otherwise convert from Markdown and sanitize.</summary>
    public static string ToHtml(string? content)
    {
        if (string.IsNullOrEmpty(content))
            return string.Empty;
        var trimmed = content.TrimStart();
        string html;
        if (trimmed.StartsWith("<", StringComparison.Ordinal))
            html = content;
        else
            html = Markdown.ToHtml(content, Pipeline);
        return Sanitizer.Sanitize(html);
    }
}
