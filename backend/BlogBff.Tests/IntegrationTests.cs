using BlogBff.Helpers;
using BlogBff.Models;
using BlogBff.Services;
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
    public void BuildCoverArtUserMessage_includes_grimdark_template()
    {
        var message = DeepSeekChatClient.BuildCoverArtUserMessage("O herói entra na taverna.");
        Assert.Contains("Photographic, detailed, grimdark", message);
        Assert.Contains("O herói entra na taverna.", message);
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
}
