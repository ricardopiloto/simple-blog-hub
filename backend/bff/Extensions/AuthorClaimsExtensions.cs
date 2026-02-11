using System.Security.Claims;

namespace BlogBff.Extensions;

/// <summary>
/// Extension methods to read author identity from JWT claims (same claim name as JwtService: "author_id").
/// </summary>
public static class AuthorClaimsExtensions
{
    /// <summary>
    /// Gets the author id from the principal's claims. Returns null if the claim is missing or not a valid Guid.
    /// </summary>
    public static Guid? GetAuthorId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst("author_id")?.Value
            ?? user.FindFirst(c => c.Type.EndsWith("/author_id", StringComparison.Ordinal))?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }
}
