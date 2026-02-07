# Proposal: Migrate backend to .NET 8

## Summary

Migrate the entire backend (API and BFF) from **.NET 9** to **.NET 8**. This aligns with LTS support and environments where only .NET 8 SDK is available. No change to frontend or to API contracts; only target framework and package versions are updated.

## Goals

- **Target framework**: API and BFF target `net8.0` instead of `net9.0`.
- **SDK and packages**: Use .NET 8 SDK (e.g. `global.json` with 8.0.x), and downgrade NuGet packages (EF Core, JWT Bearer, etc.) to 8.x-compatible versions.
- **Documentation**: README, openspec/project.md, backend READMEs, and deploy doc (e.g. DEPLOY-UBUNTU-CADDY.md) reference .NET 8 and the correct SDK version.
- **No behavioral change**: Same endpoints, same configuration, same runtime behavior; only the runtime is .NET 8.

## Scope

- **In scope**: `backend/api/BlogApi.csproj`, `backend/bff/BlogBff.csproj`, `backend/global.json`, package references (EF Core 8.x, Microsoft.AspNetCore.Authentication.JwtBearer 8.x, etc.), README.md, openspec/project.md, backend READMEs, DEPLOY-UBUNTU-CADDY.md (or equivalent deploy doc).
- **Out of scope**: Changing C# language version or adding new APIs; frontend; openspec folder structure.

## Affected code and docs

- **backend/api/BlogApi.csproj**: `TargetFramework` → `net8.0`; `Microsoft.EntityFrameworkCore.Design` and `Microsoft.EntityFrameworkCore.Sqlite` → 8.0.x.
- **backend/bff/BlogBff.csproj**: `TargetFramework` → `net8.0`; `Microsoft.AspNetCore.Authentication.JwtBearer` → 8.0.x (and align `System.IdentityModel.Tokens.Jwt` if needed for 8.x).
- **backend/global.json**: SDK version → 8.0.x (e.g. `8.0.401` or latest 8.0).
- **README.md**, **openspec/project.md**: Replace ".NET 9" with ".NET 8", update SDK download link to dotnet 8.0.
- **backend/api/README.md**, **backend/bff/README.md** (if they mention SDK): .NET 8.
- **DEPLOY-UBUNTU-CADDY.md**: Pré-requisitos and verification steps to reference .NET 8 SDK (e.g. `dotnet --list-sdks` must include 8.0.x).

## Dependencies and risks

- **Low risk**: .NET 8 is compatible with the current code; no API contracts change. EF Core 8.x and JWT 8.x are well-tested.
- **Verification**: After migration, run `dotnet build` in `backend/api` and `backend/bff`, run both services, and confirm login and BFF→API flows work.

## Success criteria

- `dotnet build` succeeds in `backend/api` and `backend/bff` with .NET 8 SDK.
- README and project.md state .NET 8; deploy doc states .NET 8.
- `openspec validate migrate-backend-to-dotnet-8 --strict` passes.
