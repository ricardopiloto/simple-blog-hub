# Change: Backend .NET Core + SQLite e BFF; substituir conteúdo mockado

## Why

Substituir os dados mock do frontend por persistência real e uma API controlada. Usar .NET Core e SQLite permite um backend simples e portável. A introdução de um BFF (Backend-for-Frontend) como único ponto de entrada público protege a API interna de ataques diretos (ex.: exploração de endpoints, DDoS, scraping), enquanto o frontend consome apenas o BFF.

## What Changes

- **Backend API (.NET Core)**: Novo projeto em `backend/api/` com ASP.NET Core, Entity Framework Core e SQLite. Modelos `Author` e `Post`; migrations; endpoints de leitura (lista de posts, post por slug). Seed com conteúdo equivalente ao atual `mockPosts` (5 posts, autor Ana Silva).
- **BFF (.NET Core)**: Novo projeto em `backend/bff/` que expõe endpoints públicos (ex.: `GET /bff/posts`, `GET /bff/posts/{slug}`) e repassa as requisições para a API interna. A API não é exposta à internet; apenas o BFF é o ponto de entrada para o frontend.
- **Frontend**: Cliente HTTP em `src/api/` que chama o BFF (base URL via `VITE_BFF_URL`). Hooks `usePosts` passam a consumir esse cliente em vez de `mockPosts`. Tipo `Post` mantido compatível (author aninhado). Remoção do uso direto de mock nos fluxos de dados (mock pode permanecer para testes ou fallback offline, conforme decisão).
- **Documentação**: README e `openspec/project.md` atualizados com arquitetura (BFF + API + SQLite), requisitos (.NET SDK, Node/npm), instruções para rodar API, BFF e frontend, e variáveis de ambiente.

## Impact

- Affected specs: novas capacidades `backend-api` e `bff`; capacidade `content-source` modificada (dados via BFF em vez de mock); capacidade `project-docs` modificada (documentação do backend e BFF).
- Affected code: novo `backend/api/`, novo `backend/bff/`, `src/api/` (cliente), `src/hooks/usePosts.ts`, possivelmente `src/data/mockPosts.ts` (uso removido ou apenas testes); `README.md`, `openspec/project.md`. Build e testes do frontend devem continuar passando; testes E2E ou integração com BFF podem ser adicionados depois.
