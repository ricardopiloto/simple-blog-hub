using System.Net.Http.Json;
using BlogBff.Models;

namespace BlogBff.Services;

public class ApiClient
{
    private const string AuthorIdHeader = "X-Author-Id";
    private readonly HttpClient _http;

    public ApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<LoginResponse?> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync("api/auth/login", new { email, password }, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return null;
        return await response.Content.ReadFromJsonAsync<LoginResponse>(cancellationToken);
    }

    public async Task<HttpResponseMessage> GetPostsAsync(bool? published = true, string order = "date", int? page = null, int? pageSize = null, string? search = null, string? fromDate = null, string? toDate = null, CancellationToken cancellationToken = default)
    {
        var query = new List<string>();
        if (published.HasValue)
            query.Add($"published={published.Value.ToString().ToLowerInvariant()}");
        if (!string.IsNullOrEmpty(order))
            query.Add($"order={Uri.EscapeDataString(order)}");
        if (page.HasValue)
            query.Add($"page={page.Value}");
        if (pageSize.HasValue)
            query.Add($"pageSize={pageSize.Value}");
        if (!string.IsNullOrEmpty(search))
            query.Add($"search={Uri.EscapeDataString(search)}");
        if (!string.IsNullOrEmpty(fromDate))
            query.Add($"fromDate={Uri.EscapeDataString(fromDate)}");
        if (!string.IsNullOrEmpty(toDate))
            query.Add($"toDate={Uri.EscapeDataString(toDate)}");
        var qs = query.Count > 0 ? "?" + string.Join("&", query) : "";
        return await _http.GetAsync($"api/posts{qs}", cancellationToken);
    }

    public async Task<HttpResponseMessage> GetPostBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _http.GetAsync($"api/posts/{Uri.EscapeDataString(slug)}", cancellationToken);
    }

    private HttpRequestMessage WithAuthorId(HttpRequestMessage req, Guid authorId)
    {
        req.Headers.TryAddWithoutValidation(AuthorIdHeader, authorId.ToString());
        return req;
    }

    public async Task<HttpResponseMessage> GetEditablePostsAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/posts?editable=true");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetAllPostsForAuthorAreaAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/posts?forAuthorArea=true");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetPostByIdForEditAsync(Guid postId, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, $"api/posts/edit/{postId}");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetNextStoryOrderAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/posts/next-story-order");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetDashboardStatsAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/dashboard/stats");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> CreatePostAsync(object body, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Post, "api/posts") { Content = JsonContent.Create(body) };
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> UpdatePostAsync(Guid postId, object body, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Put, $"api/posts/{postId}") { Content = JsonContent.Create(body) };
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> UpdateStoryOrderAsync(object body, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Put, "api/posts/story-order") { Content = JsonContent.Create(body) };
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> DeletePostAsync(Guid postId, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Delete, $"api/posts/{postId}");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetAuthorsAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/authors");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> AddCollaboratorAsync(Guid postId, Guid collaboratorAuthorId, Guid callerAuthorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Post, $"api/posts/{postId}/collaborators") { Content = JsonContent.Create(new { author_id = collaboratorAuthorId.ToString() }) };
        WithAuthorId(req, callerAuthorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> RemoveCollaboratorAsync(Guid postId, Guid collaboratorAuthorId, Guid callerAuthorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Delete, $"api/posts/{postId}/collaborators/{collaboratorAuthorId}");
        WithAuthorId(req, callerAuthorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetUsersAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/users");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> GetCurrentUserAsync(Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "api/users/me");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> CreateUserAsync(object body, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Post, "api/users") { Content = JsonContent.Create(body) };
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> UpdateUserAsync(Guid userId, object body, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Put, $"api/users/{userId}") { Content = JsonContent.Create(body) };
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> DeleteUserAsync(Guid userId, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Delete, $"api/users/{userId}");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }

    public async Task<HttpResponseMessage> ResetUserPasswordAsync(Guid userId, Guid authorId, CancellationToken cancellationToken = default)
    {
        var req = new HttpRequestMessage(HttpMethod.Post, $"api/users/{userId}/reset-password");
        WithAuthorId(req, authorId);
        return await _http.SendAsync(req, cancellationToken);
    }
}
