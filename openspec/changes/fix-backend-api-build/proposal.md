# Change: Garantir e documentar o build da API de backend

## Why

Em alguns ambientes o build da API (`backend/api`) pode falhar por uso de SDK diferente (ex.: .NET 6 ou 9 em vez de 8), restore incompleto ou falta de instruções claras. Fixar o uso do .NET 8 e documentar passos de build e troubleshooting reduz falhas e facilita correção quando o build não passar.

## What Changes

- **global.json** (em `backend/` ou `backend/api/`): Exigir SDK .NET 8.x para que `dotnet build` use a versão correta quando houver múltiplos SDKs instalados.
- **backend/api/README.md**: Incluir seção "Build" com comandos explícitos (`dotnet restore`, `dotnet build`) e uma seção "Troubleshooting" (verificar `dotnet --version` 8.x; executar `dotnet clean` e `dotnet restore` em caso de falha; referência ao .NET 8).
- **Verificação**: Garantir que `dotnet build` em `backend/api` continua passando; não alterar código da API além de documentação e global.json.

## Impact

- Affected specs: project-docs (documentação do backend).
- Affected code: novo `backend/global.json` (ou `backend/api/global.json`), `backend/api/README.md`. Nenhuma alteração em modelos, controllers ou Program.cs.
