using System.Text.Json;
using System.Text.Json.Serialization;
using BlogBff.Helpers;

namespace BlogBff.Models;

public class IntegrationPostMetadata
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("content")]
    public string? Content { get; set; }

    [JsonPropertyName("story_type")]
    public string? StoryType { get; set; }

    [JsonPropertyName("slug")]
    public string? Slug { get; set; }

    [JsonPropertyName("excerpt")]
    public string? Excerpt { get; set; }

    [JsonPropertyName("scheduled_publish_at")]
    public string? ScheduledPublishAt { get; set; }

    [JsonPropertyName("published")]
    public bool? Published { get; set; }

    [JsonPropertyName("story_order")]
    public int? StoryOrder { get; set; }

    [JsonPropertyName("include_in_story_order")]
    public bool? IncludeInStoryOrder { get; set; }

    [JsonPropertyName("cover_image")]
    public string? CoverImage { get; set; }

    [JsonPropertyName("author_id")]
    public string? AuthorId { get; set; }

    [JsonPropertyName("allow_unpublish")]
    public bool? AllowUnpublish { get; set; }
}

public static class IntegrationPostMetadataParser
{
    public static IntegrationPostMetadata Parse(IFormCollection form)
    {
        var metadata = new IntegrationPostMetadata();

        if (form.TryGetValue("metadata", out var metadataJson) && !string.IsNullOrWhiteSpace(metadataJson))
        {
            try
            {
                var fromJson = JsonSerializer.Deserialize<IntegrationPostMetadata>(metadataJson.ToString());
                if (fromJson != null)
                    metadata = fromJson;
            }
            catch (JsonException)
            {
                // flat fields below may still apply
            }
        }

        ApplyFormField(form, "title", value => metadata.Title = value);
        ApplyFormField(form, "content", value => metadata.Content = value);
        ApplyFormField(form, "story_type", value => metadata.StoryType = value);
        ApplyFormField(form, "slug", value => metadata.Slug = value);
        ApplyFormField(form, "excerpt", value => metadata.Excerpt = value);
        ApplyFormField(form, "scheduled_publish_at", value => metadata.ScheduledPublishAt = value);
        ApplyFormField(form, "cover_image", value => metadata.CoverImage = value);
        ApplyFormField(form, "author_id", value => metadata.AuthorId = value);

        if (form.TryGetValue("published", out var published) && bool.TryParse(published, out var publishedValue))
            metadata.Published = publishedValue;

        if (form.TryGetValue("story_order", out var storyOrder) && int.TryParse(storyOrder, out var storyOrderValue))
            metadata.StoryOrder = storyOrderValue;

        if (form.TryGetValue("include_in_story_order", out var includeInStoryOrder) && bool.TryParse(includeInStoryOrder, out var includeValue))
            metadata.IncludeInStoryOrder = includeValue;

        if (form.TryGetValue("allow_unpublish", out var allowUnpublish) && bool.TryParse(allowUnpublish, out var allowValue))
            metadata.AllowUnpublish = allowValue;

        return metadata;
    }

    public static IntegrationPostMetadata ParseFromJson(string json)
    {
        return JsonSerializer.Deserialize<IntegrationPostMetadata>(json) ?? new IntegrationPostMetadata();
    }

    private static void ApplyFormField(IFormCollection form, string key, Action<string> assign)
    {
        if (form.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value))
            assign(value.ToString());
    }
}

public static class IntegrationPostPayloadBuilder
{
    private static readonly HashSet<string> AllowedStoryTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "velho_mundo",
        "idade_das_trevas"
    };

    public static (Dictionary<string, object?>? Payload, string? Error) BuildCreatePayload(
        IntegrationPostMetadata metadata,
        string? coverImageUrl,
        int? defaultStoryOrder)
    {
        var validationError = ValidateRequired(metadata);
        if (validationError != null)
            return (null, validationError);

        var slug = ResolveSlug(metadata);
        if (!SlugHelper.IsValidSlug(slug))
            return (null, "Slug inválido. Use apenas letras minúsculas, números e hífens.");

        var storyType = metadata.StoryType!.Trim().ToLowerInvariant();
        if (!AllowedStoryTypes.Contains(storyType))
            return (null, "story_type deve ser 'velho_mundo' ou 'idade_das_trevas'.");

        var storyOrder = metadata.StoryOrder ?? defaultStoryOrder ?? 1;
        var includeInStoryOrder = metadata.IncludeInStoryOrder ?? true;
        var published = metadata.Published ?? false;

        return (new Dictionary<string, object?>
        {
            ["title"] = metadata.Title!.Trim(),
            ["slug"] = slug,
            ["content"] = metadata.Content ?? string.Empty,
            ["story_type"] = storyType,
            ["excerpt"] = string.IsNullOrWhiteSpace(metadata.Excerpt) ? null : metadata.Excerpt.Trim(),
            ["cover_image"] = coverImageUrl,
            ["published"] = published,
            ["story_order"] = storyOrder,
            ["include_in_story_order"] = includeInStoryOrder,
            ["scheduled_publish_at"] = string.IsNullOrWhiteSpace(metadata.ScheduledPublishAt) ? null : metadata.ScheduledPublishAt.Trim()
        }, null);
    }

    public static (Dictionary<string, object?>? Payload, string? Error) BuildUpdatePayload(
        IntegrationPostMetadata metadata,
        IntegrationPostMetadata existing,
        string? coverImageUrl)
    {
        var validationError = ValidateRequired(metadata);
        if (validationError != null)
            return (null, validationError);

        var slug = ResolveSlug(metadata);
        if (!SlugHelper.IsValidSlug(slug))
            return (null, "Slug inválido. Use apenas letras minúsculas, números e hífens.");

        var storyType = metadata.StoryType!.Trim().ToLowerInvariant();
        if (!AllowedStoryTypes.Contains(storyType))
            return (null, "story_type deve ser 'velho_mundo' ou 'idade_das_trevas'.");

        var published = metadata.Published ?? existing.Published ?? false;
        if (existing.Published == true && published == false && metadata.AllowUnpublish != true)
            published = true;

        return (new Dictionary<string, object?>
        {
            ["title"] = metadata.Title!.Trim(),
            ["slug"] = slug,
            ["content"] = metadata.Content ?? string.Empty,
            ["story_type"] = storyType,
            ["excerpt"] = string.IsNullOrWhiteSpace(metadata.Excerpt) ? null : metadata.Excerpt.Trim(),
            ["cover_image"] = coverImageUrl ?? existing.CoverImage,
            ["published"] = published,
            ["story_order"] = metadata.StoryOrder ?? existing.StoryOrder ?? 1,
            ["include_in_story_order"] = metadata.IncludeInStoryOrder ?? existing.IncludeInStoryOrder ?? true,
            ["scheduled_publish_at"] = string.IsNullOrWhiteSpace(metadata.ScheduledPublishAt) ? null : metadata.ScheduledPublishAt.Trim()
        }, null);
    }

    private static string? ValidateRequired(IntegrationPostMetadata metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata.Title))
            return "title é obrigatório.";
        if (string.IsNullOrWhiteSpace(metadata.Content))
            return "content é obrigatório.";
        if (string.IsNullOrWhiteSpace(metadata.StoryType))
            return "story_type é obrigatório.";
        return null;
    }

    private static string ResolveSlug(IntegrationPostMetadata metadata)
    {
        if (!string.IsNullOrWhiteSpace(metadata.Slug))
            return metadata.Slug.Trim().ToLowerInvariant();
        return SlugHelper.Slugify(metadata.Title!);
    }
}

public class IntegrationGenerateImageRequest
{
    [JsonPropertyName("prompt")]
    public string? Prompt { get; set; }

    [JsonPropertyName("model")]
    public string? Model { get; set; }
}
