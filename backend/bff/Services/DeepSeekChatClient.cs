using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlogBff.Services;

public class DeepSeekChatException : Exception
{
    public HttpStatusCode? StatusCode { get; }

    public DeepSeekChatException(string message, HttpStatusCode? statusCode = null, Exception? inner = null)
        : base(message, inner)
    {
        StatusCode = statusCode;
    }
}

public class DeepSeekChatClient
{
    public const string DefaultModel = "deepseek-chat";
    private const string ChatCompletionsEndpoint = "https://api.deepseek.com/chat/completions";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DeepSeekChatClient> _logger;

    public DeepSeekChatClient(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<DeepSeekChatClient> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public string? GetConfiguredApiKey()
    {
        var integrationsKey = _configuration["Integrations:DeepSeek:ApiKey"]?.Trim();
        if (!string.IsNullOrEmpty(integrationsKey))
            return integrationsKey;
        return _configuration["DeepSeek:ApiKey"]?.Trim();
    }

    public string GetDefaultModel()
    {
        var integrationsModel = _configuration["Integrations:DeepSeek:Model"]?.Trim();
        if (!string.IsNullOrWhiteSpace(integrationsModel))
            return integrationsModel;
        var rootModel = _configuration["DeepSeek:Model"]?.Trim();
        return string.IsNullOrWhiteSpace(rootModel) ? DefaultModel : rootModel;
    }

    public static string BuildCoverArtUserMessage(string content) =>
        "Com base na cena descrita abaixo, me ajude a montar um prompt que resuma a cena utilizando o estilo: Photographic, detailed, grimdark.\n"
        + content;

    public async Task<string> GenerateCoverArtPromptAsync(string content, CancellationToken cancellationToken = default)
    {
        var apiKey = GetConfiguredApiKey();
        if (string.IsNullOrEmpty(apiKey))
            throw new DeepSeekChatException("DeepSeek is not configured.");

        var userMessage = BuildCoverArtUserMessage(content);
        var payload = JsonSerializer.Serialize(new
        {
            model = GetDefaultModel(),
            messages = new[] { new { role = "user", content = userMessage } }
        });

        using var request = new HttpRequestMessage(HttpMethod.Post, ChatCompletionsEndpoint)
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.TryAddWithoutValidation("Authorization", "Bearer " + apiKey);

        var http = _httpClientFactory.CreateClient("DeepSeek");
        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request, cancellationToken);
        }
        catch (TaskCanceledException ex)
        {
            throw new DeepSeekChatException("A geração do prompt demorou demais. Tente novamente em instantes.", HttpStatusCode.GatewayTimeout, ex);
        }
        catch (HttpRequestException ex)
        {
            throw new DeepSeekChatException("Não foi possível contactar o DeepSeek. Tente novamente mais tarde.", HttpStatusCode.BadGateway, ex);
        }

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("DeepSeek cover art prompt failed with status {StatusCode}", response.StatusCode);
            var message = response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden
                ? "DeepSeek recusou o pedido. Verifique a chave de API."
                : "Não foi possível gerar o prompt no DeepSeek. Tente novamente mais tarde.";
            throw new DeepSeekChatException(message, response.StatusCode);
        }

        return ParseAssistantContent(body);
    }

    public static string ParseAssistantContent(string responseBody)
    {
        DeepSeekChatResponse? parsed;
        try
        {
            parsed = JsonSerializer.Deserialize<DeepSeekChatResponse>(responseBody);
        }
        catch (JsonException ex)
        {
            throw new DeepSeekChatException("Resposta inválida do DeepSeek.", inner: ex);
        }

        var content = parsed?.Choices?.FirstOrDefault()?.Message?.Content?.Trim();
        if (string.IsNullOrEmpty(content))
            throw new DeepSeekChatException("DeepSeek não devolveu nenhum prompt.");

        return content;
    }

    private sealed class DeepSeekChatResponse
    {
        [JsonPropertyName("choices")]
        public List<DeepSeekChoice>? Choices { get; set; }
    }

    private sealed class DeepSeekChoice
    {
        [JsonPropertyName("message")]
        public DeepSeekMessage? Message { get; set; }
    }

    private sealed class DeepSeekMessage
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }
}
