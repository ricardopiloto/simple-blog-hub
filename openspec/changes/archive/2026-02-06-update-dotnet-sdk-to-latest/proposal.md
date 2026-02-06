# Change: Atualizar .NET para a versão mais recente disponível na máquina

## Why

O projeto está configurado para .NET 8, enquanto o ambiente de desenvolvimento atual tem apenas o SDK .NET 9 instalado. Atualizar para a versão mais recente disponível na máquina (.NET 9) evita conflito de versões e permite usar um único SDK para build e execução.

## What Changes

- **backend/global.json**: Atualizar `sdk.version` para 9.0.x (ex.: 9.0.113) com `rollForward` e `allowPrerelease` adequados.
- **backend/api/BlogApi.csproj** e **backend/bff/BlogBff.csproj**: Alterar `TargetFramework` de `net8.0` para `net9.0`.
- **Pacotes NuGet** (EF Core, ASP.NET, etc.): Atualizar para versões compatíveis com .NET 9 quando necessário.
- **Documentação**: README (raiz), `backend/README.md`, `backend/api/README.md`, `backend/bff/README.md` e `openspec/project.md` — substituir referências a ".NET 8" por ".NET 9" e links de download para o SDK 9.

## Impact

- Affected specs: project-docs
- Affected code: `backend/global.json`, `backend/api/BlogApi.csproj`, `backend/bff/BlogBff.csproj`, READMEs, `openspec/project.md`
