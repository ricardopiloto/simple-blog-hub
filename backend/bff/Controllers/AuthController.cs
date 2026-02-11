using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using BlogBff.Models;
using BlogBff.Services;

namespace BlogBff.Controllers;

[ApiController]
[Route("bff/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApiClient _api;
    private readonly JwtService _jwt;

    public AuthController(ApiClient api, JwtService jwt)
    {
        _api = api;
        _jwt = jwt;
    }

    /// <summary>
    /// POST /bff/auth/login — validate with API, return JWT + author.
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        var loginResponse = await _api.LoginAsync(request.Email, request.Password, cancellationToken);
        if (loginResponse == null)
            return Unauthorized();
        var token = _jwt.CreateToken(loginResponse.UserId, loginResponse.AuthorId, loginResponse.Email);
        return Ok(new
        {
            token,
            user_id = loginResponse.UserId,
            author = new { id = loginResponse.AuthorId, name = loginResponse.Author.Name, avatar = loginResponse.Author.Avatar, bio = loginResponse.Author.Bio },
            is_admin = loginResponse.IsAdmin,
            must_change_password = loginResponse.MustChangePassword
        });
    }
}
