# Blog BFF (Backend-for-Frontend)

BFF .NET 8 que expõe endpoints públicos para o frontend e repassa as requisições para a API interna. **É o único ponto de entrada público**; a API não deve ser exposta à internet.

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A **API** (`backend/api`) deve estar rodando (ex.: `http://localhost:5001`).

## Configuração

- **API:BaseUrl**: URL da API interna. Padrão em `appsettings.json`: `http://localhost:5001`. Em produção use variável de ambiente `API__BaseUrl`.
- **Porta**: por padrão `http://localhost:5000` (ver `Properties/launchSettings.json`).
- **Desenvolvimento local:** copie `appsettings.Development.example.json` para `appsettings.Development.json` e preencha as chaves (este ficheiro **não** é versionado).
- **Integrações (produção / n8n):** `INTEGRATIONS__APIKEY`, `INTEGRATIONS__ADMINAUTHORID`, `INTEGRATIONS__OPENROUTER__*` — ver [N8N-POST-INGEST.md](../../docs/integrations/N8N-POST-INGEST.md).
- **Prompt de arte no formulário de post:** `DEEPSEEK__APIKEY` (ou `Integrations:DeepSeek:ApiKey` em `appsettings.Development.json`); capa via `INTEGRATIONS__OPENROUTER__APIKEY`. Ver [FUNCIONALIDADES.md](../../docs/FUNCIONALIDADES.md).

## Como rodar

1. Inicie a API: `cd backend/api && dotnet run`
2. Inicie o BFF: `cd backend/bff && dotnet run`

O frontend usa `VITE_BFF_URL` (ex.: `http://localhost:5000`) para chamar o BFF.

Para atualizar o projeto (local ou Docker) após um pull, ver **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](../../docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)**. Upgrade desde PROD na v2.6.3: **[ATUALIZAR-2-6-3-PARA-2-6-6.md](../../docs/deploy/ATUALIZAR-2-6-3-PARA-2-6-6.md)**.

## Endpoints

- `GET /bff/posts?order=date|story` — lista posts publicados (delega à API; ordenação por data ou story_order).
- `GET /bff/posts/{slug}` — post por slug (delega à API).
- `POST /bff/image-generation/generate-cover-art-prompt` — prompt de arte (DeepSeek; JWT).
- `POST /bff/image-generation/generate-openrouter` — imagem de capa (OpenRouter; JWT).
- `/bff/integrations/*` — API de integração n8n (`X-Integration-Key`).

Respostas em JSON no mesmo formato da API (compatível ao frontend).
