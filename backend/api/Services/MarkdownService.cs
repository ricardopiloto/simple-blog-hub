using Markdig;

namespace BlogApi.Services;

public static class MarkdownService
{
    private static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder().Build();

    /// <summary>Converts Markdown to HTML for public reading. If content looks like existing HTML (starts with &lt;), pass-through; otherwise convert from Markdown.</summary>
    public static string ToHtml(string? content)
    {
        if (string.IsNullOrEmpty(content))
            return string.Empty;
        var trimmed = content.TrimStart();
        if (trimmed.StartsWith("<", StringComparison.Ordinal))
            return content;
        return Markdown.ToHtml(content, Pipeline);
    }
}
