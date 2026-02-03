# 1noDado RPG

Blog de leitura para **contos e aventuras** de RPG. Interface em português, com página inicial, lista de posts, post por slug e índice em ordem de história. Os dados vêm do **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**.

## Arquitetura

- **Frontend** (React, Vite) → chama apenas o **BFF** (`VITE_BFF_URL`, ex.: `http://localhost:5000`).
- **BFF** (.NET 8) → único ponto de entrada público; repassa requisições para a API interna.
- **API** (.NET 8) → acesso a **SQLite** via Entity Framework Core; não exposta à internet.

## O que o projeto faz

- **Página inicial**: destaque do post mais recente e grid de artigos recentes.
- **Lista de posts**: visualização dos artigos em ordem de publicação.
- **Post individual**: leitura por slug (ex.: `/post/o-inicio-da-jornada`).
- **Índice**: posts ordenados por ordem narrativa (`/indice`).
- **Tema**: alternância entre modo claro e escuro (persistido em `localStorage`).

## Requisitos

- **Node.js** e **npm** (frontend) — [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
- **.NET 8 SDK** (backend) — [download](https://dotnet.microsoft.com/download/dotnet/8.0).

## Como executar

### 1. Backend (API + BFF)

```sh
# Terminal 1: API (porta 5001, SQLite em backend/api/blog.db)
cd backend/api
dotnet run

# Terminal 2: BFF (porta 5000)
cd backend/bff
dotnet run
```

### 2. Frontend

```sh
# Na raiz do repositório
npm install
npm run dev
```

Abra no navegador o endereço indicado (em geral `http://localhost:5173`). O frontend usa por padrão `http://localhost:5000` como BFF; se o BFF não estiver rodando, a UI exibirá mensagem de erro ao carregar os posts.

### Variáveis de ambiente (opcional)

| Variável        | Onde   | Descrição |
|-----------------|--------|-----------|
| `VITE_BFF_URL`  | Frontend | URL do BFF (padrão: `http://localhost:5000`) |
| `API__BaseUrl`  | BFF    | URL da API interna (padrão em `appsettings.json`: `http://localhost:5001`) |
| Connection string | API  | SQLite (padrão: `Data Source=blog.db`) |

### Outros comandos

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run build`    | Build de produção do frontend (`dist/`) |
| `npm run preview`  | Servir o build localmente    |
| `npm run test`     | Rodar testes do frontend (Vitest) |
| `npm run test:watch` | Testes em modo watch      |
| `npm run lint`     | Verificar código com ESLint  |

## Tecnologias

- **Frontend**: Vite 5, React 18, TypeScript, React Router DOM, Tailwind CSS, shadcn/ui, Framer Motion, TanStack React Query. Dados via `src/api/` (cliente BFF) e `src/hooks/usePosts.ts`.
- **Backend**: .NET 8 — API em `backend/api` (EF Core + SQLite), BFF em `backend/bff` (proxy para a API).
- **Testes**: Vitest, Testing Library, jsdom.
- **Lint**: ESLint 9.

---

Este projeto foi criado com [Lovable](https://lovable.dev).
