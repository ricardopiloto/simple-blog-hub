using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    /// POST /bff/uploads/cover — upload de imagem de capa do post. Autenticado; aceita image/jpeg, image/png, image/webp (máx. 5 MB).
    /// </summary>
    [HttpPost("cover")]
    [Authorize]
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

        if (!ContentTypeToExtension.TryGetValue(contentType, out var ext))
            ext = ".jpg";

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
