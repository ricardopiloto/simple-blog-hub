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

Os releases são versionados por tag (ex.: `v1.9`, `v1.10`, `v2.0`, `v2.1`, `v2.2`, `v2.3`, `v2.3.1`, `v2.3.2`, `v2.4`, `v2.4.1`). O histórico de alterações está em **[CHANGELOG](docs/changelog/CHANGELOG.md)**.

A versão exibida no rodapé do site vem do campo `version` do `frontend/package.json` (ou de `VITE_APP_VERSION` à build). **Ao preparar uma release**, atualizar o campo `version` em `frontend/package.json` antes do build para que o rodapé exiba a versão correta.

---

## 5. Funcionalidades existentes no blog

- **Página inicial:** post em destaque com etiqueta **"Novo"** (último post criado entre publicados) e artigos recentes por data de criação; apenas posts publicados; rascunhos só na Área do autor.
- **Lista de posts:** artigos em ordem de criação (somente publicados), com paginação, pesquisa e **filtro por data** (calendário: data única ou intervalo); **auto-complete** no campo de pesquisa (sugestões por autor e título).
- **Post individual:** leitura por slug; conteúdo em HTML (Markdown no backend); descrição do autor (Contas) quando existir; navegação anterior/próximo na ordem da história.
- **Índice da história** (`/indice`): ordem narrativa (`story_order`), paginação (6 por página), filtro em tempo real; toggle por universo (Velho Mundo / Idade das Trevas) quando existem posts dos dois tipos; utilizadores autenticados podem editar a ordem (número ou arrastar) e salvar.
- **Tema:** modo claro/escuro (persistido em `localStorage`).
- **Login** (`/login`): e-mail e senha; BFF valida na API e retorna JWT. Admin por defeito: e-mail padrão do Admin quando não configurado e senha padrão inicial (em produção o operador **deve** configurar `Admin__Email` e **deve** alterar a senha no primeiro acesso).
- **Troca obrigatória de senha:** no primeiro acesso com senha padrão, modal bloqueante até alterar a senha.
- **Área do autor** (`/area-autor`): página única com secção "Visão geral do blog" (dashboard com seis indicadores: total de posts, publicados, planejados, rascunho, visualizações, autores). Os cards Total, Publicados, Planejados e Rascunho são clicáveis (filtram a lista; borda amarela indica o filtro ativo; ao alterar pesquisa, linha da história ou ordenação a seleção é desmarcada). O card Autores leva a Contas. Abaixo, a secção "Publicações" com lista de posts, **pesquisa com auto-complete** (sugestões por autor e título), **filtro por data** (calendário: data única ou intervalo), filtro por linha da história (Todos / Velho Mundo / Idade das Trevas), ordenação (data ou ordem da história, asc/desc), botão Novo post e ações editar/excluir conforme permissões (Admin, dono, colaborador).
- **Contas** (`/area-autor/contas`): qualquer autor edita o próprio perfil (nome, descrição, senha); Admin gere todas as contas (criar, editar, resetar senha, excluir). Critério mínimo de senha: 8 caracteres, uma maiúscula, uma minúscula e um número.
- **Edição de posts:** título, slug, resumo, Markdown, capa (recomendado 16:9; em **Editar post** é exibido preview da imagem de capa quando há URL), Publicado, ordem; tipo de história (Velho Mundo / Idade das Trevas) obrigatório.
- **Recuperação da senha do Admin:** ficheiro de trigger no servidor, reiniciar API, login com senha padrão e trocar (detalhe em [DEPLOY-DOCKER-CADDY](docs/deploy/DEPLOY-DOCKER-CADDY.md) e [ATUALIZAR-SERVIDOR-DOCKER-CADDY](docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)).
- **SEO:** sitemap dinâmico e robots.txt servidos pelo BFF (`/sitemap.xml`, `/robots.txt`); em deploy com Caddy, encaminhar para o BFF (ver [docs/deploy](docs/deploy/)).

---

## 6. Procedimentos de instalação e atualização (com os links)

- **Instalação inicial em servidor (Docker + Caddy):** [**DEPLOY-DOCKER-CADDY**](docs/deploy/DEPLOY-DOCKER-CADDY.md) — pré-requisitos, api.env/bff.env, docker-compose, Caddyfile (estáticos, `/bff`, `/sitemap.xml`, `/robots.txt`, `/images/posts/`), primeiro acesso.
- **Atualizar o código (local e Docker):** [**ATUALIZAR-SERVIDOR-DOCKER-CADDY**](docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) — pull, build e execução em desenvolvimento (API, BFF, frontend) e em produção (rebuild contentores, frontend, cópia para document root); scripts de banco de dados manuais quando aplicável. Quem está na **v1.9** e atualiza para **v1.10**: [**ATUALIZAR-1-9-PARA-1-10**](docs/deploy/ATUALIZAR-1-9-PARA-1-10.md) — variáveis obrigatórias em produção e avisos.
- **Base de dados no host e scripts manuais:** [**EXPOR-DB-NO-HOST**](docs/database/EXPOR-DB-NO-HOST.md) — bind mount da pasta `data/`, execução de scripts SQL no host (ex.: `sqlite3 data/blog.db < backend/api/Migrations/Scripts/nome.sql`).
- **Avaliação de segurança e plano de hardening:** [**SECURITY-HARDENING**](docs/security/SECURITY-HARDENING.md) — avaliação de segurança e plano de melhorias priorizado; o plano foi **aplicado** (change apply-security-hardening). Variáveis obrigatórias em produção (CORS, JWT, chave BFF–API) e checklist: [**PRODUCTION-CHECKLIST**](docs/security/PRODUCTION-CHECKLIST.md). Armazenamento de token no frontend: [**TOKEN-STORAGE**](docs/security/TOKEN-STORAGE.md).
- **Avaliação de melhorias de código:** [**CODE-IMPROVEMENTS**](docs/improvements/CODE-IMPROVEMENTS.md) — simplificação, reaproveitamento e referências ao plano de segurança.

O passo a passo completo de configuração, variáveis de ambiente (incl. chave BFF–API, CORS, Admin) e recuperação de senha do Admin está nos guias acima. Documentação no repositório é **genérica**; podes manter guias locais em `*-local.md` ou `docs/local/` (não commitados).

**Quick start (desenvolvimento local):** `cd frontend && npm install` → `cd backend/api && dotnet run` (terminal 1) → `cd backend/bff && dotnet run` (terminal 2) → `cd frontend && npm run dev` (terminal 3). Abrir o URL do Vite (ex.: http://localhost:5173); primeiro login com o e-mail padrão do Admin (quando não configurado) e senha padrão inicial, e concluir a troca de senha no modal. Em produção, configurar `Admin__Email` e alterar a senha no primeiro acesso. Para verificar que a aplicação funciona após clone ou alterações (build frontend/backend, testes, smoke check), ver os passos em [ATUALIZAR-SERVIDOR-DOCKER-CADDY](docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md).

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
├── openspec/                     # OpenSpec — mantido no local original (project.md, AGENTS.md, specs/, changes/)
│   ├── project.md
│   ├── specs/
│   └── changes/
├── data/                         # Em deploy Docker: bind mount para SQLite (blog.db)
├── docs/                         # Documentação
│   ├── changelog/CHANGELOG.md
│   ├── deploy/                   # DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY, Caddyfile.example, ATUALIZAR-1-9-PARA-1-10
│   ├── database/                 # EXPOR-DB-NO-HOST
│   ├── security/                 # SECURITY-HARDENING, PRODUCTION-CHECKLIST, TOKEN-STORAGE
│   ├── improvements/             # CODE-IMPROVEMENTS
│   └── local/                    # Guias locais (não versionados — .gitignore)
├── docker-compose.yml
└── README.md
```

---

O frontend foi criado com [Lovable](https://lovable.dev).
