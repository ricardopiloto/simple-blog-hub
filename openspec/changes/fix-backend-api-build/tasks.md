# Tasks: fix-backend-api-build

## 1. Fixar SDK e documentar build

- [x] 1.1 Criar `backend/global.json` com `sdk.version` fixado em uma versão 8.0.x (ex.: `"8.0.405"` ou `"8.0.100"`) para que projetos em `backend/` usem o .NET 8. Se preferir não fixar número exato, usar `"rollForward": "latestFeature"` com `"allowPrerelease": false` para aceitar qualquer 8.0.x.
- [x] 1.2 Em `backend/api/README.md`, adicionar seção **Build** com: `dotnet restore`, `dotnet build` (e que `dotnet run` faz restore/build implícito). Adicionar seção **Troubleshooting**: se o build falhar, verificar `dotnet --version` (deve ser 8.x); executar `dotnet clean` e `dotnet restore` em `backend/api` e tentar `dotnet build` novamente; link para download do .NET 8 SDK.

## 2. Validação

- [x] 2.1 Executar `dotnet build` em `backend/api` (e, se existir, em `backend/bff`) após as alterações; confirmar que o build passa.
- [x] 2.2 Se houver CI ou script de build na raiz, garantir que ele não quebre (ou documentar que o backend deve ser buildado com `dotnet build` em `backend/api` e `backend/bff`).
