using System.Net;
using System.Text.Json.Serialization;
using BlogBff.Extensions;
using BlogBff.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/image-generation")]
[Route("image-generation")]
public class ImageGenerationController : ControllerBase
{
    private readonly ApiClient _api;
    private readonly CloudflareWorkersAiClient _cloudflare;
    private readonly ILogger<ImageGenerationController> _logger;

    public ImageGenerationController(
        ApiClient api,
        CloudflareWorkersAiClient cloudflare,
        ILogger<ImageGenerationController> logger)
    {
        _api = api;
        _cloudflare = cloudflare;
        _logger = logger;
    }

    /// <summary>POST /bff/image-generation/verify — test saved Cloudflare credentials (authenticated).</summary>
    [HttpPost("verify")]
    [Authorize]
    public async Task<IActionResult> VerifyCredentials(CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();

        var credentialsResult = await TryGetCredentialsAsync(authorId.Value, cancellationToken);
        if (credentialsResult.ErrorResult != null)
            return credentialsResult.ErrorResult;

        var diagnosis = await _cloudflare.DiagnoseAsync(
            credentialsResult.Credentials!.AccountId,
            credentialsResult.Credentials.ApiToken,
            cancellationToken);

        if (diagnosis.Ok)
            return Ok(new { ok = true, message = diagnosis.Message ?? "Credenciais Cloudflare válidas." });

        return UnprocessableEntity(new { ok = false, error = diagnosis.ErrorCode, message = diagnosis.Message });
    }

    /// <summary>
    /// POST /bff/image-generation/generate — generate image from prompt (authenticated).
    /// Returns base64 in JSON only; image is not persisted on the server.
    /// </summary>
    [HttpPost("generate")]
    [Authorize]
    public async Task<IActionResult> Generate([FromBody] GenerateImageRequest request, CancellationToken cancellationToken = default)
    {
        var authorId = User.GetAuthorId();
        if (authorId == null)
            return Unauthorized();

        var prompt = request.Prompt?.Trim();
        if (string.IsNullOrEmpty(prompt))
            return BadRequest(new { error = "empty_prompt", message = "O prompt não pode estar vazio." });

        var credentialsResult = await TryGetCredentialsAsync(authorId.Value, cancellationToken);
        if (credentialsResult.ErrorResult != null)
            return credentialsResult.ErrorResult;

        var credentials = credentialsResult.Credentials!;
        try
        {
            var result = await _cloudflare.GenerateImageAsync(
                credentials.AccountId,
                credentials.ApiToken,
                prompt,
                credentials.ImageModel,
                cancellationToken);

            // Transient in-memory response only — forwarded to the browser, not saved to disk.
            return Ok(new { image = result.ImageBase64 });
        }
        catch (CloudflareWorkersAiException ex) when (ex.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        {
            _logger.LogWarning(
                "Cloudflare generation auth failure for author {AuthorId}: {ErrorCode}",
                authorId.Value,
                ex.ErrorCode);

            var diagnosis = await _cloudflare.DiagnoseAsync(
                credentials.AccountId,
                credentials.ApiToken,
                cancellationToken);

            if (!diagnosis.Ok && diagnosis.ErrorCode != null)
            {
                return StatusCode(422, new { error = diagnosis.ErrorCode, message = diagnosis.Message });
            }

            return StatusCode(422, new
            {
                error = "workers_ai_denied",
                message =
                    "O token e o Account ID parecem válidos, mas a Cloudflare recusou a geração. " +
                    "Confirme permissões Workers AI Read e Edit e que Workers AI está activo na conta."
            });
        }
        catch (CloudflareWorkersAiException ex)
        {
            _logger.LogWarning(
                "Cloudflare generation failed for author {AuthorId}: {ErrorCode}",
                authorId.Value,
                ex.ErrorCode);

            var status = ex.ErrorCode switch
            {
                "timeout" => 504,
                "rate_limit" => 429,
                "quota_exceeded" => 402,
                _ when ex.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden => 422,
                _ => 502
            };

            return StatusCode(status, new { error = ex.ErrorCode, message = ex.UserMessage });
        }
    }

    private async Task<CredentialsFetchResult> TryGetCredentialsAsync(Guid authorId, CancellationToken cancellationToken)
    {
        HttpResponseMessage credentialsResponse;
        try
        {
            credentialsResponse = await _api.GetCloudflareCredentialsAsync(authorId, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch Cloudflare credentials for author {AuthorId}", authorId);
            return CredentialsFetchResult.FromError(StatusCode(502, new
            {
                error = "provider_error",
                message = "Não foi possível obter as credenciais Cloudflare. Tente novamente."
            }));
        }

        if (credentialsResponse.StatusCode == HttpStatusCode.NotFound)
            return CredentialsFetchResult.FromError(UnprocessableEntity(new
            {
                error = "no_credentials",
                message = "Configure o Account ID e o API Token Cloudflare em Contas antes de gerar imagens."
            }));

        if (credentialsResponse.StatusCode == HttpStatusCode.UnprocessableEntity)
        {
            var errorCode = await ReadErrorCodeAsync(credentialsResponse, cancellationToken);
            return CredentialsFetchResult.FromError(UnprocessableEntity(new
            {
                error = errorCode ?? "no_credentials",
                message = MapStoredCredentialError(errorCode)
            }));
        }

        if (credentialsResponse.StatusCode == HttpStatusCode.InternalServerError)
        {
            var errorCode = await ReadErrorCodeAsync(credentialsResponse, cancellationToken);
            if (errorCode == "encryption_not_configured")
            {
                return CredentialsFetchResult.FromError(StatusCode(500, new
                {
                    error = "encryption_not_configured",
                    message = "O servidor não está configurado para guardar tokens Cloudflare. Contacte o operador."
                }));
            }
            return CredentialsFetchResult.FromError(StatusCode(502, new
            {
                error = "provider_error",
                message = "Não foi possível obter as credenciais Cloudflare. Tente novamente."
            }));
        }

        if (!credentialsResponse.IsSuccessStatusCode)
            return CredentialsFetchResult.FromError(StatusCode(502, new
            {
                error = "provider_error",
                message = "Não foi possível obter as credenciais Cloudflare. Tente novamente."
            }));

        CloudflareCredentialsResponse? credentials;
        try
        {
            credentials = await credentialsResponse.Content.ReadFromJsonAsync<CloudflareCredentialsResponse>(cancellationToken);
        }
        catch (System.Text.Json.JsonException ex)
        {
            _logger.LogError(ex, "Invalid credentials response for author {AuthorId}", authorId);
            return CredentialsFetchResult.FromError(StatusCode(502, new
            {
                error = "provider_error",
                message = "Não foi possível obter as credenciais Cloudflare. Tente novamente."
            }));
        }

        if (credentials == null || string.IsNullOrWhiteSpace(credentials.AccountId) || string.IsNullOrWhiteSpace(credentials.ApiToken))
        {
            return CredentialsFetchResult.FromError(UnprocessableEntity(new
            {
                error = "no_credentials",
                message = "Configure o Account ID e o API Token Cloudflare em Contas antes de gerar imagens."
            }));
        }

        return CredentialsFetchResult.FromSuccess(new ResolvedCloudflareCredentials(
            CloudflareWorkersAiClient.NormalizeAccountId(credentials.AccountId),
            CloudflareWorkersAiClient.NormalizeApiToken(credentials.ApiToken),
            CloudflareWorkersAiClient.NormalizeModel(credentials.ImageModel)));
    }

    private static string MapStoredCredentialError(string? errorCode) => errorCode switch
    {
        "token_decrypt_failed" =>
            "Não foi possível ler o API Token guardado. Abra Contas e cole o API Token novamente.",
        _ => "Configure o Account ID e o API Token Cloudflare em Contas antes de gerar imagens."
    };

    private sealed class CredentialsFetchResult
    {
        public ResolvedCloudflareCredentials? Credentials { get; init; }
        public IActionResult? ErrorResult { get; init; }

        public static CredentialsFetchResult FromSuccess(ResolvedCloudflareCredentials credentials) =>
            new() { Credentials = credentials };

        public static CredentialsFetchResult FromError(IActionResult error) =>
            new() { ErrorResult = error };
    }

    private sealed record ResolvedCloudflareCredentials(string AccountId, string ApiToken, string ImageModel);

    private static async Task<string?> ReadErrorCodeAsync(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        try
        {
            var body = await response.Content.ReadFromJsonAsync<ErrorResponse>(cancellationToken);
            return body?.Error;
        }
        catch (System.Text.Json.JsonException)
        {
            return null;
        }
    }
}

public class ErrorResponse
{
    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class GenerateImageRequest
{
    [JsonPropertyName("prompt")]
    public string? Prompt { get; set; }
}

public class CloudflareCredentialsResponse
{
    [JsonPropertyName("accountId")]
    public string AccountId { get; set; } = string.Empty;

    [JsonPropertyName("apiToken")]
    public string ApiToken { get; set; } = string.Empty;

    [JsonPropertyName("imageModel")]
    public string ImageModel { get; set; } = string.Empty;
}
