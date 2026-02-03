namespace BlogBff.Services;

public class ApiClient
{
    private readonly HttpClient _http;

    public ApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<HttpResponseMessage> GetPostsAsync(bool? published = true, string order = "date", CancellationToken cancellationToken = default)
    {
        var query = new List<string>();
        if (published.HasValue)
            query.Add($"published={published.Value.ToString().ToLowerInvariant()}");
        if (!string.IsNullOrEmpty(order))
            query.Add($"order={Uri.EscapeDataString(order)}");
        var qs = query.Count > 0 ? "?" + string.Join("&", query) : "";
        return await _http.GetAsync($"api/posts{qs}", cancellationToken);
    }

    public async Task<HttpResponseMessage> GetPostBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _http.GetAsync($"api/posts/{Uri.EscapeDataString(slug)}", cancellationToken);
    }
}
