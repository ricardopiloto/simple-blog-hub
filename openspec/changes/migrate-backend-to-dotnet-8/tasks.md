# Tasks: migrate-backend-to-dotnet-8

## 1. Update API project to .NET 8

- [x] 1.1 In `backend/api/BlogApi.csproj`, set `TargetFramework` to `net8.0`.
- [x] 1.2 Set `Microsoft.EntityFrameworkCore.Design` and `Microsoft.EntityFrameworkCore.Sqlite` to a 8.0.x version (e.g. `8.0.11` or latest 8.0.x). Remove or adjust any other package that targets .NET 9 only.

## 2. Update BFF project to .NET 8

- [x] 2.1 In `backend/bff/BlogBff.csproj`, set `TargetFramework` to `net8.0`.
- [x] 2.2 Set `Microsoft.AspNetCore.Authentication.JwtBearer` to 8.0.x. Ensure `System.IdentityModel.Tokens.Jwt` is compatible (current 8.x is fine for .NET 8).

## 3. Update global.json

- [x] 3.1 In `backend/global.json`, set SDK `version` to an 8.0.x value (e.g. `8.0.401` or `8.0.100`) and adjust `rollForward` if desired (e.g. `latestPatch` for 8.0.x).

## 4. Build and verify backend

- [x] 4.1 Run `dotnet build` in `backend/api` and `backend/bff` with .NET 8 SDK installed; fix any compilation or package errors.
- [x] 4.2 Optionally run API and BFF and confirm login and one BFF→API call (e.g. list posts) work.

## 5. Update documentation

- [x] 5.1 In README.md: replace ".NET 9" with ".NET 8", update SDK download link to https://dotnet.microsoft.com/download/dotnet/8.0.
- [x] 5.2 In openspec/project.md: replace ".NET 9" with ".NET 8" in Tech Stack, Backend, and External Dependencies.
- [x] 5.3 In backend/api/README.md and backend/bff/README.md (if they mention the SDK): state .NET 8.
- [x] 5.4 In DEPLOY-UBUNTU-CADDY.md: pré-requisitos and verification (e.g. `dotnet --list-sdks` must include 8.0.x; link to .NET 8 install).

## 6. Validation

- [x] 6.1 Run `openspec validate migrate-backend-to-dotnet-8 --strict` and resolve any issues.
