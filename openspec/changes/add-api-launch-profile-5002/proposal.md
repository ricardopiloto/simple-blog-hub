# Change: Perfil de launch da API na porta 5002 para quando 5001 estiver em uso

## Why

Quando `dotnet run` falha com "Address already in use" na porta 5001, o usuário pode usar variável de ambiente (`ASPNETCORE_URLS`), mas é fácil esquecer. Adicionar um **perfil de launch** que sobe a API na porta 5002 permite rodar `dotnet run --launch-profile http-5002` sem configurar env; o README já explica que nesse caso o BFF deve usar `API__BaseUrl=http://localhost:5002`.

## What Changes

- **backend/api/Properties/launchSettings.json**: Adicionar um perfil `http-5002` com `applicationUrl`: `http://localhost:5002`, igual ao perfil `http` em todo o resto (commandName, dotnetRunMessages, launchBrowser, launchUrl, environmentVariables).
- **backend/api/README.md**: No item de Troubleshooting "Se dotnet run falhar com Address already in use", mencionar a opção de usar o perfil alternativo: `dotnet run --launch-profile http-5002` (e configurar o BFF com a URL da API correspondente).

## Impact

- Affected specs: project-docs (documentação), configuração do backend.
- Affected code: `launchSettings.json`, `backend/api/README.md`. Nenhuma alteração em Program.cs ou lógica da API.
