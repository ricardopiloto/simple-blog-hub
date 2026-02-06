using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BlogBff.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<JwtService>();

var apiBaseUrl = builder.Configuration["API:BaseUrl"] ?? "http://localhost:5001";
var apiInternalKey = builder.Configuration["API:InternalKey"]?.Trim();
builder.Services.AddHttpClient<ApiClient>(client =>
{
    client.BaseAddress = new Uri(apiBaseUrl.TrimEnd('/') + "/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    if (!string.IsNullOrEmpty(apiInternalKey))
        client.DefaultRequestHeaders.Add("X-Api-Key", apiInternalKey);
});

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "dev-secret-change-in-production-min-32-chars";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "blog-bff";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "blog-frontend";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
builder.Services.AddAuthorization();

var corsAllowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Trim();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (!string.IsNullOrEmpty(corsAllowedOrigins))
        {
            var origins = corsAllowedOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            if (origins.Length > 0)
                policy.WithOrigins(origins).AllowAnyMethod().AllowAnyHeader();
            else
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
        else
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
