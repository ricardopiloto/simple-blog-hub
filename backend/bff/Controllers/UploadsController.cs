using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly PostCoverUploadService _coverUpload;

    public UploadsController(PostCoverUploadService coverUpload)
    {
        _coverUpload = coverUpload;
    }

    /// <summary>
    /// POST /bff/uploads/cover — upload de imagem de capa do post. Autenticado; aceita image/jpeg, image/png, image/webp (máx. 5 MB). Validates magic bytes before saving.
    /// </summary>
    [HttpPost("cover")]
    [Authorize]
    [EnableRateLimiting("Uploads")]
    [RequestSizeLimit(PostCoverUploadService.MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = PostCoverUploadService.MaxFileSizeBytes)]
    public async Task<IActionResult> UploadCover(IFormFile? file, CancellationToken cancellationToken = default)
    {
        if (file == null)
            return BadRequest(new { error = "Nenhum ficheiro enviado." });

        var (result, error) = await _coverUpload.SaveCoverFileAsync(file, cancellationToken);
        if (error != null)
            return BadRequest(new { error });

        return Ok(new { url = result!.PublicUrl });
    }
}
