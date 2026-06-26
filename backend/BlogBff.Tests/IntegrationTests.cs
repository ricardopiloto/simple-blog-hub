using System.Net;
using BlogBff.Helpers;
using BlogBff.Models;
using BlogBff.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace BlogBff.Tests;

public class SlugHelperTests
{
    [Fact]
    public void Slugify_removes_accents_and_special_chars()
    {
        var slug = SlugHelper.Slugify("Capítulo 12 — O Encontro!");
        Assert.Equal("capitulo-12-o-encontro", slug);
    }

    [Theory]
    [InlineData("valid-slug-1", true)]
    [InlineData("Invalid_Slug", false)]
    [InlineData("", false)]
    public void IsValidSlug_matches_api_regex(string slug, bool expected)
    {
        Assert.Equal(expected, SlugHelper.IsValidSlug(slug));
    }
}

public class IntegrationPostPayloadBuilderTests
{
    [Fact]
    public void BuildCreatePayload_uses_required_fields_and_derives_slug()
    {
        var metadata = new IntegrationPostMetadata
        {
            Title = "Novo Capítulo",
            Content = "Texto",
            StoryType = "velho_mundo",
            AuthorId = "00000000-0000-0000-0000-000000000099"
        };

        var (payload, error) = IntegrationPostPayloadBuilder.BuildCreatePayload(metadata, null, 5);
        Assert.Null(error);
        Assert.NotNull(payload);
        Assert.Equal("novo-capitulo", payload!["slug"]);
        Assert.Equal("velho_mundo", payload["story_type"]);
        Assert.Equal(5, payload["story_order"]);
    }

    [Fact]
    public void BuildUpdatePayload_keeps_published_when_allow_unpublish_false()
    {
        var metadata = new IntegrationPostMetadata
        {
            Title = "Cap",
            Content = "Texto",
            StoryType = "velho_mundo",
            Published = false
        };
        var existing = new IntegrationPostMetadata
        {
            Published = true,
            StoryOrder = 3,
            IncludeInStoryOrder = true,
            CoverImage = "/images/posts/old.jpg"
        };

        var (payload, error) = IntegrationPostPayloadBuilder.BuildUpdatePayload(metadata, existing, null);
        Assert.Null(error);
        Assert.True((bool)payload!["published"]!);
    }
}

public class DeepSeekChatClientTests
{
    [Fact]
    public void ParseAssistantContent_reads_first_choice_message()
    {
        const string json = """{"choices":[{"message":{"content":"Photographic grimdark tavern scene"}}]}""";
        var prompt = DeepSeekChatClient.ParseAssistantContent(json);
        Assert.Equal("Photographic grimdark tavern scene", prompt);
    }

    [Fact]
    public void BuildCoverArtUserMessage_requests_english_grimdark_prompt()
    {
        var message = DeepSeekChatClient.BuildCoverArtUserMessage("O herói entra na taverna.");
        Assert.Contains("ONE image-generation prompt in English", message);
        Assert.Contains("photographic, detailed, grimdark", message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("O herói entra na taverna.", message);
    }

    [Fact]
    public void CoverArtSystemMessage_includes_moderation_rules()
    {
        Assert.Contains("nudity", DeepSeekChatClient.CoverArtSystemMessage, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("gore", DeepSeekChatClient.CoverArtSystemMessage, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("single paragraph in English", DeepSeekChatClient.CoverArtSystemMessage, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void GetConfiguredApiKey_falls_back_to_root_when_integrations_empty()
    {
        var client = CreateClient(new Dictionary<string, string?>
        {
            ["Integrations:DeepSeek:ApiKey"] = "",
            ["DeepSeek:ApiKey"] = "sk-from-env",
        });

        Assert.Equal("sk-from-env", client.GetConfiguredApiKey());
    }

    [Fact]
    public void GetConfiguredApiKey_prefers_integrations_when_both_set()
    {
        var client = CreateClient(new Dictionary<string, string?>
        {
            ["Integrations:DeepSeek:ApiKey"] = "sk-integrations",
            ["DeepSeek:ApiKey"] = "sk-root",
        });

        Assert.Equal("sk-integrations", client.GetConfiguredApiKey());
    }

    [Fact]
    public void GetConfiguredApiKey_returns_null_when_both_empty()
    {
        var client = CreateClient(new Dictionary<string, string?>
        {
            ["Integrations:DeepSeek:ApiKey"] = "",
            ["DeepSeek:ApiKey"] = "",
        });

        Assert.True(string.IsNullOrEmpty(client.GetConfiguredApiKey()));
    }

    [Fact]
    public void GetDefaultModel_falls_back_to_root_when_integrations_empty()
    {
        var client = CreateClient(new Dictionary<string, string?>
        {
            ["Integrations:DeepSeek:Model"] = "",
            ["DeepSeek:Model"] = "deepseek-reasoner",
        });

        Assert.Equal("deepseek-reasoner", client.GetDefaultModel());
    }

    private static DeepSeekChatClient CreateClient(Dictionary<string, string?> settings)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();
        return new DeepSeekChatClient(
            new StubHttpClientFactory(),
            configuration,
            NullLogger<DeepSeekChatClient>.Instance);
    }

    private sealed class StubHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name) => new();
    }
}

public class OpenRouterImagesClientTests
{
    [Fact]
    public void ParseFirstImageBase64_reads_first_data_item()
    {
        const string json = """{"data":[{"b64_json":"abc123"},{"b64_json":"ignored"}]}""";
        var image = OpenRouterImagesClient.ParseFirstImageBase64(json);
        Assert.Equal("abc123", image);
    }

    [Fact]
    public void DefaultImageModel_matches_openrouter_flux_klein()
    {
        Assert.Equal("black-forest-labs/flux.2-klein-4b", OpenRouterImagesClient.DefaultImageModel);
    }

    [Fact]
    public void TryParseErrorMessage_reads_error_message_field()
    {
        const string json = """{"error":{"code":400,"message":"Prompt is too long"}}""";
        Assert.Equal("Prompt is too long", OpenRouterImagesClient.TryParseErrorMessage(json));
    }

    [Fact]
    public void MapUserMessage_maps_moderation_rejection_to_portuguese_hint()
    {
        var message = OpenRouterImagesClient.MapUserMessage(
            HttpStatusCode.BadRequest,
            "Black Forest Labs generation failed: Request Moderated");
        Assert.Equal(OpenRouterImagesClient.ContentModeratedUserMessage, message);
    }

    [Fact]
    public void ResolveErrorCode_returns_content_moderated_for_moderation_message()
    {
        Assert.Equal(
            OpenRouterImagesClient.ContentModeratedErrorCode,
            OpenRouterImagesClient.ResolveErrorCode(OpenRouterImagesClient.ContentModeratedUserMessage));
        Assert.Equal(
            "provider_error",
            OpenRouterImagesClient.ResolveErrorCode("OpenRouter recusou o pedido: Prompt is too long"));
    }

    [Fact]
    public void MapUserMessage_surfaces_provider_message_on_bad_request()
    {
        var message = OpenRouterImagesClient.MapUserMessage(HttpStatusCode.BadRequest, "Prompt is too long");
        Assert.Contains("Prompt is too long", message);
    }

    [Fact]
    public void MapUserMessage_maps_payment_required_to_credits_hint()
    {
        var message = OpenRouterImagesClient.MapUserMessage(HttpStatusCode.PaymentRequired, null);
        Assert.Contains("Créditos", message);
    }
}
