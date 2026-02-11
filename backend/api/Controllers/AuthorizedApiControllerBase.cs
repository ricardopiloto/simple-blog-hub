using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers;

/// <summary>
/// Base controller for API endpoints that require the X-Author-Id header (BFF forwards the authenticated author).
/// </summary>
public abstract class AuthorizedApiControllerBase : ControllerBase
{
    /// <summary>Header name used by the BFF to pass the authenticated author id.</summary>
    protected const string AuthorIdHeader = "X-Author-Id";

    /// <summary>
    /// Reads and parses the X-Author-Id header. Returns null if missing or not a valid Guid.
    /// </summary>
    protected Guid? GetAuthorIdFromHeader()
    {
        if (!Request.Headers.TryGetValue(AuthorIdHeader, out var value) || string.IsNullOrWhiteSpace(value))
            return null;
        return Guid.TryParse(value.ToString().Trim(), out var id) ? id : null;
    }
}
