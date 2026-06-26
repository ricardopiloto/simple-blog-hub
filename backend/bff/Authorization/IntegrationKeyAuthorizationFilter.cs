using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BlogBff.Authorization;

public class RequireIntegrationKeyAttribute : TypeFilterAttribute
{
    public RequireIntegrationKeyAttribute() : base(typeof(IntegrationKeyAuthorizationFilter))
    {
    }
}

public class IntegrationKeyAuthorizationFilter : IAuthorizationFilter
{
    private const string IntegrationKeyHeader = "X-Integration-Key";
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<IntegrationKeyAuthorizationFilter> _logger;

    public IntegrationKeyAuthorizationFilter(
        IConfiguration configuration,
        IHostEnvironment environment,
        ILogger<IntegrationKeyAuthorizationFilter> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var expected = _configuration["Integrations:ApiKey"]?.Trim();
        if (string.IsNullOrEmpty(expected))
        {
            if (_environment.IsProduction())
            {
                _logger.LogWarning("Integration API rejected: Integrations:ApiKey is not configured.");
                context.Result = new ObjectResult(new { error = "Integration API is not configured." })
                {
                    StatusCode = StatusCodes.Status503ServiceUnavailable
                };
            }
            else
            {
                _logger.LogWarning("Integration API rejected: Integrations:ApiKey is not configured (development).");
                context.Result = new UnauthorizedObjectResult(new { error = "Invalid integration key." });
            }
            return;
        }

        var provided = context.HttpContext.Request.Headers[IntegrationKeyHeader].FirstOrDefault()?.Trim();
        if (string.IsNullOrEmpty(provided) || provided.Length != expected.Length || !FixedTimeEquals(provided, expected))
        {
            context.Result = new UnauthorizedObjectResult(new { error = "Invalid integration key." });
        }
    }

    private static bool FixedTimeEquals(string a, string b)
    {
        var aBytes = Encoding.UTF8.GetBytes(a);
        var bBytes = Encoding.UTF8.GetBytes(b);
        if (aBytes.Length != bBytes.Length)
            return false;
        return CryptographicOperations.FixedTimeEquals(aBytes, bBytes);
    }
}
