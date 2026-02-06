# Blog BFF (Backend-for-Frontend)

BFF .NET 8 que expõe endpoints públicos para o frontend e repassa as requisições para a API interna. **É o único ponto de entrada público**; a API não deve ser exposta à internet.

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A **API** (`backend/api`) deve estar rodando (ex.: `http://localhost:5001`).

## Configuração

- **API:BaseUrl**: URL da API interna. Padrão em `appsettings.json`: `http://localhost:5001`. Em produção use variável de ambiente `API__BaseUrl`.
- **Porta**: por padrão `http://localhost:5000` (ver `Properties/launchSettings.json`).

## Como rodar

1. Inicie a API: `cd backend/api && dotnet run`
2. Inicie o BFF: `cd backend/bff && dotnet run`

O frontend usa `VITE_BFF_URL` (ex.: `http://localhost:5000`) para chamar o BFF.

## Endpoints

- `GET /bff/posts?order=date|story` — lista posts publicados (delega à API; ordenação por data ou story_order).
- `GET /bff/posts/{slug}` — post por slug (delega à API).

Respostas em JSON no mesmo formato da API (compatível ao frontend).
