using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private static readonly Dictionary<string, string> ContentTypeToExtension = new(StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = ".jpg",
        ["image/jpg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };

    public UploadsController(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    /// <summary>
    /// POST /bff/uploads/cover — upload de imagem de capa do post. Autenticado; aceita image/jpeg, image/png, image/webp (máx. 5 MB). Validates magic bytes before saving.
    /// </summary>
    [HttpPost("cover")]
    [Authorize]
    [EnableRateLimiting("Uploads")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = MaxFileSizeBytes)]
    public async Task<IActionResult> UploadCover(IFormFile? file, CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Nenhum ficheiro enviado." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { error = "Ficheiro demasiado grande. Máximo 5 MB." });

        var contentType = file.ContentType ?? "";
        if (!AllowedContentTypes.Contains(contentType))
            return BadRequest(new { error = "Tipo de ficheiro não permitido. Use JPEG, PNG ou WebP." });

        string? ext = null;
        await using (var stream = file.OpenReadStream())
        {
            ext = GetExtensionFromMagicBytes(stream);
        }
        if (ext == null)
            return BadRequest(new { error = "Conteúdo do ficheiro não corresponde a JPEG, PNG ou WebP. Verifique o formato." });

        var uploadsPath = GetUploadsPath();
        Directory.CreateDirectory(uploadsPath);
        var fileName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadsPath, fileName);

        await using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var publicUrl = "/images/posts/" + fileName;
        return Ok(new { url = publicUrl });
    }

    /// <summary>Reads first bytes and returns extension if magic bytes match JPEG, PNG or WebP; otherwise null.</summary>
    private static string? GetExtensionFromMagicBytes(Stream stream)
    {
        var header = new byte[12];
        var read = stream.Read(header, 0, header.Length);
        if (read < 3) return null;
        // JPEG: FF D8 FF
        if (read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            return ".jpg";
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (read >= 8 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47
            && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A)
            return ".png";
        // WebP: RIFF (52 49 46 46) .... WEBP (57 45 42 50)
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
