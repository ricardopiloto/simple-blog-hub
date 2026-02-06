## 1. Backend SDK e projetos

- [x] 1.1 Atualizar `backend/global.json`: `sdk.version` para 9.0.x (ex.: 9.0.113), manter `rollForward` e `allowPrerelease: false`.
- [x] 1.2 Em `backend/api/BlogApi.csproj`, alterar `TargetFramework` para `net9.0`; atualizar pacotes (EF Core, Markdig, BCrypt) para versões compatíveis com .NET 9.
- [x] 1.3 Em `backend/bff/BlogBff.csproj`, alterar `TargetFramework` para `net9.0`; atualizar pacotes (JWT, Auth) para versões compatíveis com .NET 9.
- [x] 1.4 Executar `dotnet restore` e `dotnet build` em `backend/api` e `backend/bff` e corrigir eventuais quebras.

## 2. Documentação

- [x] 2.1 Atualizar `README.md` (raiz): referências a ".NET 8" → ".NET 9" e link do SDK para .NET 9.
- [x] 2.2 Atualizar `backend/README.md`, `backend/api/README.md` e `backend/bff/README.md`: requisito e troubleshooting para .NET 9.
- [x] 2.3 Atualizar `openspec/project.md`: Tech Stack e Backend de ".NET 8" para ".NET 9".

## 3. Validação

- [x] 3.1 Confirmar que `dotnet --version` reporta 9.x e que `dotnet build` e `dotnet run` funcionam em `backend/api` e `backend/bff`.
