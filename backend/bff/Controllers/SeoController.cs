using System.Text;
using System.Xml;
using Microsoft.AspNetCore.Mvc;
using BlogBff.Services;

namespace BlogBff.Controllers;

/// <summary>
/// Serves /sitemap.xml and /robots.txt at the application root (no /bff prefix).
/// Caddy should proxy these paths to the BFF so they are served at the site root.
/// </summary>
[ApiController]
[Route("")]
public class SeoController : ControllerBase
{
    private const string SitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";
    private readonly ApiClient _api;

    public SeoController(ApiClient api)
    {
        _api = api;
    }

    /// <summary>
    /// GET /sitemap.xml — dynamic sitemap (urlset) with static pages and published posts.
    /// </summary>
    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> SitemapXml(CancellationToken cancellationToken = default)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}".TrimEnd('/');

        var xml = new StringBuilder();
        using (var writer = XmlWriter.Create(xml, new XmlWriterSettings { Indent = true, OmitXmlDeclaration = false, Encoding = Encoding.UTF8 }))
        {
            writer.WriteStartDocument(false);
            writer.WriteStartElement("urlset", SitemapNamespace);
            writer.WriteAttributeString("xmlns", SitemapNamespace);

            // Static pages
            WriteUrl(writer, baseUrl + "/", null);
            WriteUrl(writer, baseUrl + "/posts", null);
            WriteUrl(writer, baseUrl + "/indice", null);

            // Published posts from API (no pagination = full list)
            var response = await _api.GetPostsAsync(published: true, order: "date", cancellationToken: cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(content);
                    if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        foreach (var item in doc.RootElement.EnumerateArray())
                        {
                            var slug = item.TryGetProperty("slug", out var s) ? s.GetString() : null;
                            if (string.IsNullOrWhiteSpace(slug)) continue;
                            var lastmod = (string?)null;
                            if (item.TryGetProperty("updated_at", out var u))
                                lastmod = u.GetString();
                            if (string.IsNullOrEmpty(lastmod) && item.TryGetProperty("published_at", out var p))
                                lastmod = p.GetString();
                            WriteUrl(writer, $"{baseUrl}/post/{Uri.EscapeDataString(slug!)}", lastmod);
                        }
                    }
                }
                catch
                {
                    // If parse fails, sitemap still has static URLs
                }
            }

            writer.WriteEndElement();
            writer.WriteEndDocument();
        }

        return Content(xml.ToString(), "application/xml", Encoding.UTF8);
    }

    private static void WriteUrl(XmlWriter writer, string loc, string? lastmod)
    {
        writer.WriteStartElement("url");
        writer.WriteElementString("loc", loc);
        if (!string.IsNullOrWhiteSpace(lastmod) && DateTime.TryParse(lastmod, out var dt))
            writer.WriteElementString("lastmod", dt.ToString("yyyy-MM-dd"));
        writer.WriteEndElement();
    }

    /// <summary>
    /// GET /robots.txt — plain text with User-agent rules and Sitemap line.
    /// </summary>
    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult RobotsTxt()
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}".TrimEnd('/');
        var sitemapUrl = $"{baseUrl}/sitemap.xml";

        var body = $@"User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: {sitemapUrl}
";

        return Content(body, "text/plain", Encoding.UTF8);
    }
}
