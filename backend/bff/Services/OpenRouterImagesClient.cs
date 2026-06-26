using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlogBff.Services;

public class OpenRouterImagesException : Exception
{
    public HttpStatusCode? StatusCode { get; }

    public OpenRouterImagesException(string message, HttpStatusCode? statusCode = null, Exception? inner = null)
        : base(message, inner)
    {
        StatusCode = statusCode;
    }
}

public class OpenRouterImagesClient
{
    public const string DefaultImageModel = "black-forest-labs/flux.2-klein-4b";
    private const string ImagesEndpoint = "https://openrouter.ai/api/v1/images";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenRouterImagesClient> _logger;

    public OpenRouterImagesClient(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<OpenRouterImagesClient> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public string? GetConfiguredApiKey() => _configuration["Integrations:OpenRouter:ApiKey"]?.Trim();

    public string GetDefaultModel() =>
        string.IsNullOrWhiteSpace(_configuration["Integrations:OpenRouter:ImageModel"])
            ? DefaultImageModel
            : _configuration["Integrations:OpenRouter:ImageModel"]!.Trim();

    public async Task<string> GenerateImageBase64Async(string prompt, string? model, CancellationToken cancellationToken = default)
    {
        var apiKey = GetConfiguredApiKey();
        if (string.IsNullOrEmpty(apiKey))
            throw new OpenRouterImagesException("OpenRouter is not configured.");

        var resolvedModel = string.IsNullOrWhiteSpace(model) ? GetDefaultModel() : model.Trim();
        var payload = JsonSerializer.Serialize(new { model = resolvedModel, prompt });
        using var request = new HttpRequestMessage(HttpMethod.Post, ImagesEndpoint)
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.TryAddWithoutValidation("Authorization", "Bearer " + apiKey);

        var http = _httpClientFactory.CreateClient("OpenRouter");
        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request, cancellationToken);
        }
        catch (TaskCanceledException ex)
        {
            throw new OpenRouterImagesException("A geração demorou demais. Tente novamente em instantes.", HttpStatusCode.GatewayTimeout, ex);
        }
        catch (HttpRequestException ex)
        {
            throw new OpenRouterImagesException("Não foi possível contactar o OpenRouter. Tente novamente mais tarde.", HttpStatusCode.BadGateway, ex);
        }

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("OpenRouter image generation failed with status {StatusCode}", response.StatusCode);
            var message = response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden
                ? "OpenRouter recusou o pedido. Verifique a chave de API."
                : "Não foi possível gerar a imagem no OpenRouter. Tente novamente mais tarde.";
            throw new OpenRouterImagesException(message, response.StatusCode);
        }

        return ParseFirstImageBase64(body);
    }

    public static string ParseFirstImageBase64(string responseBody)
    {
        OpenRouterImagesResponse? parsed;
        try
        {
            parsed = JsonSerializer.Deserialize<OpenRouterImagesResponse>(responseBody);
        }
        catch (JsonException ex)
        {
            throw new OpenRouterImagesException("Resposta inválida do OpenRouter.", inner: ex);
        }

        var image = parsed?.Data?.FirstOrDefault(d => !string.IsNullOrWhiteSpace(d.B64Json));
        if (image == null)
            throw new OpenRouterImagesException("OpenRouter não devolveu nenhuma imagem.");

        return image.B64Json!;
    }

    private sealed class OpenRouterImagesResponse
    {
        [JsonPropertyName("data")]
        public List<OpenRouterImageData>? Data { get; set; }
    }

    private sealed class OpenRouterImageData
    {
        [JsonPropertyName("b64_json")]
        public string? B64Json { get; set; }
    }
}
