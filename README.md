# 1noDado RPG

## 1. Explicação breve do projeto

Blog de leitura para **contos e aventuras** de RPG. Interface em português. Os dados vêm do **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**; o frontend não acessa a API diretamente.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

---

## 2. Stack de desenvolvimento

- **Frontend:** Node.js, npm, Vite 5, React 18, TypeScript, React Router DOM, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, TanStack React Query. Cliente BFF em `frontend/src/api/client.ts`; tipos em `frontend/src/api/types.ts`; hooks em `frontend/src/hooks/usePosts.ts`. Comandos npm executam-se a partir de **`frontend/`**.
- **Backend:** .NET 8 SDK. API: Entity Framework Core, SQLite, BCrypt, Markdig (Markdown→HTML). BFF: JWT, HttpClient para a API.
- **Testes:** Vitest, Testing Library, jsdom (`npm run test`, `npm run test:watch` em `frontend/`).
- **Lint:** ESLint 9 (`npm run lint` em `frontend/`).

**Build:** Frontend: `cd frontend && npm run build` (produz `frontend/dist/`). API: `dotnet build` em `backend/api`. BFF: `dotnet build` em `backend/bff`.

**Scripts principais (em `frontend/`):** `npm run dev`, `npm run build`, `npm run test`, `npm run lint`, `npm run preview`.

---

## 3. Requisitos mínimos

- **Node.js** e **npm** (frontend) — [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating) ou pacote do sistema.
- **.NET 8 SDK** (backend) — [download](https://dotnet.microsoft.com/download/dotnet/8.0).

---

## 4. Links para CHANGELOG

Os releases são versionados por tag (ex.: `v1.7`, `v1.8`). O histórico de alterações está em **[CHANGELOG.md](CHANGELOG.md)**.

A versão exibida no rodapé do site vem do campo `version` do `frontend/package.json` (ou de `VITE_APP_VERSION` à build); ao preparar uma release, atualizar esse valor antes do build.

---

## 5. Funcionalidades existentes no blog

- **Página inicial:** destaque (último post criado entre publicados) e artigos recentes por data de criação; apenas posts publicados; rascunhos só na Área do autor.
- **Lista de posts:** artigos em ordem de criação (somente publicados), com paginação e pesquisa.
- **Post individual:** leitura por slug; conteúdo em HTML (Markdown no backend); descrição do autor (Contas) quando existir; navegação anterior/próximo na ordem da história.
- **Índice da história** (`/indice`): ordem narrativa (`story_order`), paginação (6 por página), filtro em tempo real; toggle por universo (Velho Mundo / Idade das Trevas) quando existem posts dos dois tipos; utilizadores autenticados podem editar a ordem (número ou arrastar) e salvar.
- **Tema:** modo claro/escuro (persistido em `localStorage`).
- **Login** (`/login`): e-mail e senha; BFF valida na API e retorna JWT. Admin por defeito: **admin@admin.com** / **senha123** (ou `Admin__Email` configurado).
- **Troca obrigatória de senha:** no primeiro acesso com senha padrão, modal bloqueante até alterar a senha.
- **Área do autor** (`/area-autor`): dashboard, novo post, editar/excluir conforme permissões (Admin, dono, colaborador).
- **Contas** (`/area-autor/contas`): qualquer autor edita o próprio perfil (nome, descrição, senha); Admin gere todas as contas (criar, editar, resetar senha, excluir). Critério mínimo de senha: 6 caracteres, uma maiúscula e um número.
- **Edição de posts:** título, slug, resumo, Markdown, capa (recomendado 16:9), Publicado, ordem; tipo de história (Velho Mundo / Idade das Trevas) obrigatório.
- **Recuperação da senha do Admin:** ficheiro de trigger no servidor, reiniciar API, login com senha padrão e trocar (detalhe em [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md) e [ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)).
- **SEO:** sitemap dinâmico e robots.txt servidos pelo BFF (`/sitemap.xml`, `/robots.txt`); em deploy com Caddy, encaminhar para o BFF (ver DEPLOY-DOCKER-CADDY).

---

## 6. Procedimentos de instalação e atualização (com os links)

- **Instalação inicial em servidor (Docker + Caddy):** [**DEPLOY-DOCKER-CADDY.md**](DEPLOY-DOCKER-CADDY.md) — pré-requisitos, api.env/bff.env, docker-compose, Caddyfile (estáticos, `/bff`, `/sitemap.xml`, `/robots.txt`, `/images/posts/`), primeiro acesso.
- **Atualizar o código (local e Docker):** [**ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) — pull, build e execução em desenvolvimento (API, BFF, frontend) e em produção (rebuild contentores, frontend, cópia para document root); scripts de banco de dados manuais quando aplicável.
- **Base de dados no host e scripts manuais:** [**EXPOR-DB-NO-HOST.md**](EXPOR-DB-NO-HOST.md) — bind mount da pasta `data/`, execução de scripts SQL no host (ex.: `sqlite3 data/blog.db < backend/api/Migrations/Scripts/nome.sql`).

O passo a passo completo de configuração, variáveis de ambiente (incl. chave BFF–API, CORS, Admin) e recuperação de senha do Admin está nos guias acima. Documentação no repositório é **genérica**; podes manter guias locais em `*-local.md` ou `docs/local/` (não commitados).

**Quick start (desenvolvimento local):** `cd frontend && npm install` → `cd backend/api && dotnet run` (terminal 1) → `cd backend/bff && dotnet run` (terminal 2) → `cd frontend && npm run dev` (terminal 3). Abrir o URL do Vite (ex.: http://localhost:5173); primeiro login com admin@admin.com e senha123 e concluir a troca de senha no modal. Para verificar que a aplicação funciona após clone ou alterações (build frontend/backend, testes, smoke check), ver os passos em [ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md).

---

## 7. Estrutura de pastas

Fluxo: **Frontend (React)** → **BFF** (único ponto de entrada público) → **API** (interna) → **SQLite**.

```
simple-blog-hub/
├── frontend/                     # Frontend React (Vite + TypeScript)
│   ├── src/                      # api/ (cliente BFF), auth/, components/, contexts/, hooks/, lib/, pages/, test/
│   ├── public/                   # Assets estáticos (dice-icon.svg, robots.txt, images/posts/)
│   ├── index.html, package.json, vite.config.ts, tailwind.config.ts, tsconfig.*.json
│   └── ...
├── backend/
│   ├── api/                      # API .NET 8 (SQLite)
│   │   ├── Controllers/          # Auth, Authors, Posts, Users
│   │   ├── Data/                 # BlogDbContext, SeedData
│   │   ├── Migrations/           # EF Core migrations + Scripts/ (manuais)
│   │   ├── Models/, Services/   # Admin, Markdown, PasswordValidation
│   │   ├── Program.cs, appsettings.json
│   │   └── README.md             # Build, Troubleshooting, migrações manuais
│   └── bff/                      # BFF .NET 8
│       ├── Controllers/          # Auth, Authors, BffPosts, Users, Seo (sitemap, robots)
│       ├── Services/             # ApiClient, JwtService
│       ├── Program.cs, appsettings.json
│       └── ...
├── openspec/                     # Especificações e changes (OpenSpec)
│   ├── project.md
│   ├── specs/
│   └── changes/
├── data/                         # Em deploy Docker: bind mount para SQLite (blog.db)
├── CHANGELOG.md
├── DEPLOY-DOCKER-CADDY.md
├── ATUALIZAR-SERVIDOR-DOCKER-CADDY.md
├── EXPOR-DB-NO-HOST.md
├── docker-compose.yml
└── README.md
```

---

O frontend foi criado com [Lovable](https://lovable.dev).
