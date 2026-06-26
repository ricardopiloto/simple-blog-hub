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
            var providerMessage = TryParseErrorMessage(body);
            _logger.LogWarning(
                "OpenRouter image generation failed with status {StatusCode}. Response: {Body}",
                response.StatusCode,
                TruncateForLog(body, 800));
            var message = MapUserMessage(response.StatusCode, providerMessage);
            throw new OpenRouterImagesException(message, response.StatusCode);
        }

        return ParseFirstImageBase64(body);
    }

    public static string? TryParseErrorMessage(string responseBody)
    {
        if (string.IsNullOrWhiteSpace(responseBody))
            return null;
        try
        {
            using var doc = JsonDocument.Parse(responseBody);
            if (doc.RootElement.TryGetProperty("error", out var error)
                && error.TryGetProperty("message", out var message)
                && message.ValueKind == JsonValueKind.String)
            {
                var text = message.GetString()?.Trim();
                return string.IsNullOrEmpty(text) ? null : text;
            }
        }
        catch (JsonException)
        {
            // ignore malformed error payloads
        }
        return null;
    }

    public static string MapUserMessage(HttpStatusCode statusCode, string? providerMessage)
    {
        return statusCode switch
        {
            HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden =>
                "OpenRouter recusou o pedido. Verifique a chave de API.",
            HttpStatusCode.PaymentRequired =>
                "Créditos OpenRouter insuficientes. Adicione saldo na conta e tente novamente.",
            HttpStatusCode.TooManyRequests =>
                "Limite de pedidos OpenRouter atingido. Aguarde alguns minutos e tente novamente.",
            HttpStatusCode.BadRequest when !string.IsNullOrWhiteSpace(providerMessage) =>
                $"OpenRouter recusou o pedido: {providerMessage}",
            _ when !string.IsNullOrWhiteSpace(providerMessage) =>
                $"OpenRouter: {providerMessage}",
            _ => "Não foi possível gerar a imagem no OpenRouter. Tente novamente mais tarde.",
        };
    }

    private static string TruncateForLog(string text, int maxLength) =>
        text.Length <= maxLength ? text : text[..maxLength] + "…";

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
