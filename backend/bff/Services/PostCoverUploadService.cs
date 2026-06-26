using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace BlogBff.Services;

public class PostCoverUploadResult
{
    public string PublicUrl { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
}

public class PostCoverUploadService
{
    public const long MaxFileSizeBytes = 5 * 1024 * 1024;

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public PostCoverUploadService(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    public async Task<(PostCoverUploadResult? Result, string? Error)> SaveCoverFileAsync(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        if (file.Length == 0)
            return (null, "Nenhum ficheiro enviado.");

        if (file.Length > MaxFileSizeBytes)
            return (null, "Ficheiro demasiado grande. Máximo 5 MB.");

        var contentType = file.ContentType ?? string.Empty;
        if (!AllowedContentTypes.Contains(contentType))
            return (null, "Tipo de ficheiro não permitido. Use JPEG, PNG ou WebP.");

        string? ext;
        await using (var stream = file.OpenReadStream())
        {
            ext = GetExtensionFromMagicBytes(stream);
        }

        if (ext == null)
            return (null, "Conteúdo do ficheiro não corresponde a JPEG, PNG ou WebP. Verifique o formato.");

        await using var inputStream = file.OpenReadStream();
        return await SaveImageStreamAsync(inputStream, ext, cancellationToken);
    }

    public async Task<(PostCoverUploadResult? Result, string? Error)> SaveCoverFromBase64Async(
        string base64,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(base64))
            return (null, "Imagem inválida.");

        byte[] bytes;
        try
        {
            bytes = Convert.FromBase64String(base64.Trim());
        }
        catch (FormatException)
        {
            return (null, "Imagem inválida.");
        }

        if (bytes.Length == 0)
            return (null, "Imagem inválida.");

        if (bytes.Length > MaxFileSizeBytes)
            return (null, "Ficheiro demasiado grande. Máximo 5 MB.");

        await using var stream = new MemoryStream(bytes);
        var ext = GetExtensionFromMagicBytes(stream);
        if (ext == null)
            ext = ".png";

        stream.Position = 0;
        return await SaveImageStreamAsync(stream, ext, cancellationToken);
    }

    private async Task<(PostCoverUploadResult? Result, string? Error)> SaveImageStreamAsync(
        Stream inputStream,
        string ext,
        CancellationToken cancellationToken)
    {
        var maxWidth = _config.GetValue("Uploads:MaxWidth", 2200);
        var jpegQuality = _config.GetValue("Uploads:JpegQuality", 85);
        var uploadsPath = GetUploadsPath();
        Directory.CreateDirectory(uploadsPath);
        var fileName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadsPath, fileName);

        try
        {
            using var image = await Image.LoadAsync(inputStream, cancellationToken);
            if (image.Width > maxWidth)
                image.Mutate(x => x.Resize(maxWidth, 0));

            await using var outputStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true);
            if (string.Equals(ext, ".jpg", StringComparison.OrdinalIgnoreCase))
                await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = Math.Clamp(jpegQuality, 1, 100) }, cancellationToken);
            else if (string.Equals(ext, ".png", StringComparison.OrdinalIgnoreCase))
                await image.SaveAsPngAsync(outputStream, new PngEncoder { CompressionLevel = PngCompressionLevel.DefaultCompression }, cancellationToken);
            else if (string.Equals(ext, ".webp", StringComparison.OrdinalIgnoreCase))
                await image.SaveAsWebpAsync(outputStream, new WebpEncoder { Quality = Math.Clamp(jpegQuality, 1, 100) }, cancellationToken);
            else
                await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = Math.Clamp(jpegQuality, 1, 100) }, cancellationToken);
        }
        catch (Exception)
        {
            if (File.Exists(fullPath))
            {
                try { File.Delete(fullPath); } catch { /* ignore */ }
            }
            return (null, "Não foi possível processar a imagem. Verifique o formato e tente novamente.");
        }

        return (new PostCoverUploadResult
        {
            FileName = fileName,
            PublicUrl = "/images/posts/" + fileName
        }, null);
    }

    public static string? GetExtensionFromMagicBytes(Stream stream)
    {
        var header = new byte[12];
        var read = stream.Read(header, 0, header.Length);
        if (read < 3)
            return null;
        if (read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            return ".jpg";
        if (read >= 8 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47
            && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A)
            return ".png";
        if (read >= 12 && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
            && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50)
            return ".webp";
        return null;
    }

    private string GetUploadsPath()
    {
        var configured = _config["Uploads:ImagesPath"]?.Trim();
        if (!string.IsNullOrEmpty(configured))
        {
            if (Path.IsPathRooted(configured))
                return configured;
            return Path.GetFullPath(Path.Combine(_env.ContentRootPath, configured));
        }
        return Path.GetFullPath(Path.Combine(_env.ContentRootPath, "..", "..", "frontend", "public", "images", "posts"));
    }
}
