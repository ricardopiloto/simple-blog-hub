using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlogBff.Services;

/// <summary>
/// Cloudflare Workers AI client — direct REST calls per
/// https://developers.cloudflare.com/workers-ai/get-started/rest-api/
/// Image bytes are streamed in memory only; nothing is written to disk.
/// </summary>
public class CloudflareWorkersAiClient
{
    public const string DefaultImageModel = "@cf/black-forest-labs/flux-1-schnell";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<CloudflareWorkersAiClient> _logger;

    public CloudflareWorkersAiClient(IHttpClientFactory httpClientFactory, ILogger<CloudflareWorkersAiClient> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<CloudflareImageResult> GenerateImageAsync(
        string accountId,
        string apiToken,
        string prompt,
        string? model = null,
        CancellationToken cancellationToken = default)
    {
        var normalizedAccountId = NormalizeAccountId(accountId);
        var normalizedToken = NormalizeApiToken(apiToken);
        var normalizedModel = NormalizeModel(model);
        var trimmedPrompt = prompt.Trim();

        var http = _httpClientFactory.CreateClient("CloudflareAI");
        var url = BuildRunUrl(normalizedAccountId, normalizedModel);
        using var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(JsonSerializer.Serialize(new { prompt = trimmedPrompt }), Encoding.UTF8, "application/json")
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", normalizedToken);

        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request, cancellationToken);
        }
        catch (TaskCanceledException ex)
        {
            throw new CloudflareWorkersAiException("timeout", "A geração demorou demais. Tente novamente em instantes.", HttpStatusCode.GatewayTimeout, null, ex);
        }
        catch (HttpRequestException ex)
        {
            throw new CloudflareWorkersAiException("provider_error", "Não foi possível contactar a Cloudflare. Tente novamente mais tarde.", HttpStatusCode.BadGateway, null, ex);
        }

        var body = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        var responseText = body.Length > 0 ? Encoding.UTF8.GetString(body) : string.Empty;

        if (!response.IsSuccessStatusCode)
        {
            var classified = ClassifyFailure(response.StatusCode, responseText);
            _logger.LogWarning(
                "Cloudflare AI returned {StatusCode} ({ErrorCode}) for account {AccountId} (token length {TokenLength})",
                (int)response.StatusCode,
                classified.ErrorCode,
                normalizedAccountId,
                normalizedToken.Length);
            throw new CloudflareWorkersAiException(
                classified.ErrorCode ?? "provider_error",
                classified.Message ?? "Não foi possível gerar a imagem na Cloudflare.",
                response.StatusCode,
                responseText);
        }

        return ExtractImage(body, response.Content.Headers.ContentType?.MediaType, responseText);
    }

    public async Task<CloudflareAuthDiagnosis> DiagnoseAsync(
        string accountId,
        string apiToken,
        CancellationToken cancellationToken = default)
    {
        var normalizedAccountId = NormalizeAccountId(accountId);
        var normalizedToken = NormalizeApiToken(apiToken);

        var tokenDiagnosis = await VerifyTokenAsync(normalizedToken, cancellationToken);
        if (!tokenDiagnosis.Ok)
            return tokenDiagnosis;

        return await VerifyAccountAccessAsync(normalizedAccountId, normalizedToken, cancellationToken);
    }

    public static string NormalizeAccountId(string value) => value.Trim();

    public static string NormalizeApiToken(string value)
    {
        var token = value.Trim();
        if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            token = token[7..].Trim();
        return token;
    }

    public static string NormalizeModel(string? model)
    {
        var normalized = (model ?? string.Empty).Trim().Trim('/');
        if (string.IsNullOrEmpty(normalized))
            return DefaultImageModel;
        if (!normalized.StartsWith("@cf/", StringComparison.Ordinal))
        {
            if (normalized.StartsWith("cf/", StringComparison.Ordinal))
                normalized = "@" + normalized;
            else
                normalized = "@cf/" + normalized.TrimStart('@');
        }
        return normalized;
    }

    public static string BuildRunUrl(string accountId, string model) =>
        $"https://api.cloudflare.com/client/v4/accounts/{Uri.EscapeDataString(NormalizeAccountId(accountId))}/ai/run/{NormalizeModel(model)}";

    public static CloudflareAuthDiagnosis ClassifyFailure(HttpStatusCode statusCode, string? responseBody)
    {
        var parsed = TryParseResponse(responseBody);
        var messages = CollectMessages(parsed, responseBody);
        var combined = string.Join(" ", messages).ToLowerInvariant();

        if (statusCode == HttpStatusCode.TooManyRequests || ContainsAny(combined, "rate limit", "too many requests"))
        {
            return CloudflareAuthDiagnosis.Fail(
                "rate_limit",
                "Limite de pedidos da Cloudflare atingido. Aguarde alguns minutos e tente novamente.");
        }

        if (ContainsAny(combined, "quota", "limit exceeded", "neuron", "credit", "billing", "usage limit", "out of"))
        {
            return CloudflareAuthDiagnosis.Fail(
                "quota_exceeded",
                "A quota ou os créditos de Workers AI da sua conta Cloudflare esgotaram-se. Verifique o plano e o consumo no dashboard Cloudflare.");
        }

        if (ContainsAny(combined, "expired", "expiration"))
        {
            return CloudflareAuthDiagnosis.Fail(
                "token_expired",
                "O API Token Cloudflare expirou. Crie um novo token em Workers AI → Use REST API e actualize em Contas.");
        }

        if (statusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden
            || ContainsAny(combined, "authentication", "unauthorized", "invalid api token", "invalid token"))
        {
            if (ContainsAny(combined, "account", "account id"))
            {
                return CloudflareAuthDiagnosis.Fail(
                    "account_mismatch",
                    "O Account ID não corresponde a esta conta Cloudflare. Copie o Account ID em Workers AI → Use REST API.");
            }

            return CloudflareAuthDiagnosis.Fail(
                "invalid_token",
                "API Token inválido ou sem permissão. Crie um token em Workers AI → Use REST API com permissões Workers AI Read e Edit (não use a Global API Key).");
        }

        if (statusCode == HttpStatusCode.NotFound || ContainsAny(combined, "model not found", "unknown model"))
        {
            return CloudflareAuthDiagnosis.Fail(
                "model_unavailable",
                "O modelo de imagem não está disponível nesta conta Cloudflare. Verifique o catálogo Workers AI.");
        }

        if (statusCode is HttpStatusCode.BadGateway or HttpStatusCode.ServiceUnavailable
            || ContainsAny(combined, "upstream", "unavailable", "temporarily"))
        {
            return CloudflareAuthDiagnosis.Fail(
                "service_unavailable",
                "O serviço Workers AI da Cloudflare está temporariamente indisponível. Tente novamente mais tarde.");
        }

        return CloudflareAuthDiagnosis.Fail(
            "provider_error",
            "Não foi possível gerar a imagem na Cloudflare. Tente novamente mais tarde.");
    }

    private static CloudflareImageResult ExtractImage(byte[] body, string? contentType, string responseText)
    {
        if (!string.IsNullOrEmpty(contentType) && contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return new CloudflareImageResult(Convert.ToBase64String(body), contentType);

        var parsed = TryParseResponse(responseText);
        if (!string.IsNullOrEmpty(parsed?.Result?.Image))
            return new CloudflareImageResult(parsed.Result.Image, "image/jpeg");

        var classified = ClassifyFailure(HttpStatusCode.BadGateway, responseText);
        throw new CloudflareWorkersAiException(
            classified.ErrorCode ?? "provider_error",
            classified.Message ?? "Não foi possível gerar a imagem na Cloudflare.",
            HttpStatusCode.BadGateway,
            responseText);
    }

    private async Task<CloudflareAuthDiagnosis> VerifyTokenAsync(string apiToken, CancellationToken cancellationToken)
    {
        var http = _httpClientFactory.CreateClient("CloudflareAI");
        using var request = new HttpRequestMessage(HttpMethod.Get, "https://api.cloudflare.com/client/v4/user/tokens/verify");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);

        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cloudflare token verify request failed");
            return CloudflareAuthDiagnosis.Fail(
                "provider_error",
                "Não foi possível validar o API Token com a Cloudflare. Tente novamente.");
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            if (apiToken.Length is < 32 or > 120)
            {
                return CloudflareAuthDiagnosis.Fail(
                    "invalid_token",
                    $"O API Token guardado tem {apiToken.Length} caracteres (formato inválido; máximo 120). " +
                    "Abra Contas e cole novamente o token do dashboard Cloudflare (Workers AI → Use REST API).");
            }
            return ClassifyFailure(response.StatusCode, body);
        }

        return CloudflareAuthDiagnosis.Success("API Token válido.");
    }

    private async Task<CloudflareAuthDiagnosis> VerifyAccountAccessAsync(
        string accountId,
        string apiToken,
        CancellationToken cancellationToken)
    {
        var http = _httpClientFactory.CreateClient("CloudflareAI");
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://api.cloudflare.com/client/v4/accounts/{Uri.EscapeDataString(accountId)}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);

        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(request, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cloudflare account lookup failed for account {AccountId}", accountId);
            return CloudflareAuthDiagnosis.Fail(
                "provider_error",
                "Não foi possível confirmar o acesso à conta Cloudflare. Tente novamente.");
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden or HttpStatusCode.NotFound)
            {
                return CloudflareAuthDiagnosis.Fail(
                    "account_mismatch",
                    "O API Token é válido, mas o Account ID não corresponde a esta conta. Copie o Account ID em Workers AI → Use REST API.");
            }
            return ClassifyFailure(response.StatusCode, body);
        }

        return CloudflareAuthDiagnosis.Success("Account ID e API Token válidos para esta conta Cloudflare.");
    }

    private static CloudflareRunResponse? TryParseResponse(string? responseBody)
    {
        if (string.IsNullOrWhiteSpace(responseBody))
            return null;
        try
        {
            return JsonSerializer.Deserialize<CloudflareRunResponse>(responseBody);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static IEnumerable<string> CollectMessages(CloudflareRunResponse? parsed, string? responseBody)
    {
        if (parsed?.Errors != null)
        {
            foreach (var error in parsed.Errors)
            {
                if (!string.IsNullOrWhiteSpace(error.Message))
                    yield return error.Message;
                if (error.Code.HasValue)
                    yield return error.Code.Value.ToString();
            }
        }

        if (parsed?.Messages != null)
        {
            foreach (var message in parsed.Messages)
            {
                if (!string.IsNullOrWhiteSpace(message.Message))
                    yield return message.Message;
            }
        }

        if (!string.IsNullOrWhiteSpace(responseBody))
            yield return responseBody;
    }

    private static bool ContainsAny(string haystack, params string[] needles) =>
        needles.Any(needle => haystack.Contains(needle, StringComparison.Ordinal));
}

public sealed record CloudflareImageResult(string ImageBase64, string MimeType);

public sealed class CloudflareAuthDiagnosis
{
    public bool Ok { get; init; }
    public string? ErrorCode { get; init; }
    public string? Message { get; init; }

    public static CloudflareAuthDiagnosis Success(string message) => new() { Ok = true, Message = message };

    public static CloudflareAuthDiagnosis Fail(string errorCode, string message) =>
        new() { Ok = false, ErrorCode = errorCode, Message = message };
}

public sealed class CloudflareWorkersAiException : Exception
{
    public string ErrorCode { get; }
    public string UserMessage { get; }
    public HttpStatusCode StatusCode { get; }
    public string? ResponseBody { get; }

    public CloudflareWorkersAiException(
        string errorCode,
        string userMessage,
        HttpStatusCode statusCode,
        string? responseBody,
        Exception? inner = null)
        : base(userMessage, inner)
    {
        ErrorCode = errorCode;
        UserMessage = userMessage;
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }
}

internal sealed class CloudflareRunResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("result")]
    public CloudflareRunResult? Result { get; set; }

    [JsonPropertyName("errors")]
    public List<CloudflareApiError>? Errors { get; set; }

    [JsonPropertyName("messages")]
    public List<CloudflareApiMessage>? Messages { get; set; }
}

internal sealed class CloudflareRunResult
{
    [JsonPropertyName("image")]
    public string? Image { get; set; }
}

internal sealed class CloudflareApiError
{
    [JsonPropertyName("code")]
    public int? Code { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

internal sealed class CloudflareApiMessage
{
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
