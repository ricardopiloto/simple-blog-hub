using System.Text.Json.Serialization;

namespace BlogBff.Services;

public class AdminAuthorResolutionException : Exception
{
    public AdminAuthorResolutionException(string message) : base(message)
    {
    }
}

public class AdminAuthorResolver
{
    private readonly IConfiguration _configuration;
    private readonly ApiClient _api;
    private readonly ILogger<AdminAuthorResolver> _logger;
    private Guid? _cachedAuthorId;

    public AdminAuthorResolver(IConfiguration configuration, ApiClient api, ILogger<AdminAuthorResolver> logger)
    {
        _configuration = configuration;
        _api = api;
        _logger = logger;
    }

    public async Task<Guid> ResolveAsync(CancellationToken cancellationToken = default)
    {
        if (_cachedAuthorId.HasValue)
            return _cachedAuthorId.Value;

        var configured = _configuration["Integrations:AdminAuthorId"]?.Trim();
        if (!string.IsNullOrEmpty(configured))
        {
            if (!Guid.TryParse(configured, out var configuredId))
                throw new AdminAuthorResolutionException("Integrations:AdminAuthorId is not a valid GUID.");

            await EnsureAuthorExistsAsync(configuredId, cancellationToken);
            _cachedAuthorId = configuredId;
            return configuredId;
        }

        var response = await _api.GetIntegrationAdminAuthorIdAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Failed to resolve admin author from API: {StatusCode}", response.StatusCode);
            throw new AdminAuthorResolutionException("System administrator author could not be resolved.");
        }

        var body = await response.Content.ReadFromJsonAsync<AdminAuthorIdResponse>(cancellationToken);
        if (body == null || !Guid.TryParse(body.AuthorId, out var authorId))
            throw new AdminAuthorResolutionException("System administrator author could not be resolved.");

        _cachedAuthorId = authorId;
        return authorId;
    }

    private async Task EnsureAuthorExistsAsync(Guid authorId, CancellationToken cancellationToken)
    {
        var response = await _api.AuthorExistsAsync(authorId, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Configured admin author {AuthorId} was not found.", authorId);
            throw new AdminAuthorResolutionException("Configured administrator author was not found.");
        }
    }

    private sealed class AdminAuthorIdResponse
    {
        [JsonPropertyName("author_id")]
        public string AuthorId { get; set; } = string.Empty;
    }
}
