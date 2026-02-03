# Project Context

## Purpose

**1noDado RPG** é um blog de leitura pública para contos e aventuras de RPG ("Contos e aventuras"). O projeto oferece uma experiência de leitura agradável (início, lista de posts, post por slug, índice em ordem de história). A fonte de dados é o **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**; o frontend não acessa a API diretamente.

## Tech Stack

- **Runtime / build**: Node.js, Vite 5 (frontend); .NET 8 (backend API e BFF).
- **Front-end**: React 18, TypeScript, React Router DOM 6.
- **UI**: Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, Lucide React, fontes Inter + Playfair Display.
- **Estado / dados**: TanStack React Query, hooks em `@/hooks/usePosts` que consomem o cliente em `@/api/client.ts` (chamadas ao BFF). Tipo `Post` em `@/api/types.ts`. Dados persistidos em SQLite; API interna em `backend/api`, BFF em `backend/bff`.
- **Backend**: .NET 8, Entity Framework Core, SQLite (API); BFF como único ponto de entrada público.
- **Testes**: Vitest, jsdom, Testing Library (React, Jest-DOM); setup em `src/test/setup.ts`.
- **Qualidade**: ESLint 9 (TypeScript, React Hooks, React Refresh).

## Project Conventions

### Branding

- **Logo**: O logo do blog é composto pelo ícone de d20 (Dice 20 faces 1, Delapouite, [game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html), CC BY 3.0) e o texto "noDado RPG", exibido no header e no footer.

### Code Style

- **Path alias**: `@/` aponta para `src/` (Vite + TypeScript).
- **Componentes**: Function components; preferir hooks para estado e efeitos.
- **Nomenclatura**: PascalCase para componentes e tipos; camelCase para funções e variáveis; arquivos de componente em PascalCase (ex.: `PostCard.tsx`, `Layout.tsx`).
- **Idioma da UI**: Textos de interface em português (ex.: "Artigos Recentes", "Fique por dentro", "Nenhum artigo publicado ainda").

### Architecture Patterns

- **Arquitetura em camadas**: Frontend → BFF (único ponto de entrada público) → API (interna) → SQLite. A API não é exposta à internet; o BFF protege e agrega.
- **Estrutura de pastas**: Frontend na raiz (`src/`: componentes, páginas, hooks, `src/api/` cliente BFF). Backend: `backend/api/` (API .NET, EF Core, SQLite, modelos, migrations, seed), `backend/bff/` (BFF .NET, HttpClient para a API, endpoints `/bff/posts`). Path alias `@/` aponta para `src/`.
- **Rotas**: SPA com React Router; rotas principais: `/` (Index), `/posts`, `/post/:slug`, `/indice` (StoryIndex); catch-all `*` → `NotFound`.
- **Layout**: `Layout` (Header + main + Footer); componentes de blog em `components/blog/`, layout em `components/layout/`, UI reutilizável em `components/ui/`.
- **Tema**: Tema claro/escuro via `ThemeContext` e classe no `documentElement`; persistência em `localStorage`; fallback para `prefers-color-scheme`.
- **Dados de posts**: Modelo `Post` em `@/api/types.ts` (id, title, slug, excerpt, content, cover_image, published, published_at, story_order, author). Cliente em `@/api/client.ts`: `fetchPosts(order)`, `fetchPostBySlug(slug)` (base URL via `VITE_BFF_URL`). Hooks em `@/hooks/usePosts.ts`: `usePublishedPosts`, `usePostsByStoryOrder`, `usePost(slug)`, `useAllPosts`, `usePostsStore` (dados via BFF; store com reordenação local até existir escrita na API). O arquivo `@/data/mockPosts.ts` permanece para testes ou referência; fluxos de leitura usam o BFF.

### Testing Strategy

- **Runner**: Vitest; ambiente jsdom; `globals: true`; `setupFiles: ["./src/test/setup.ts"]`.
- **Escopo**: Testes em `src/**/*.{test,spec}.{ts,tsx}`; comando `npm run test` (run) e `npm run test:watch` (watch).
- **Stack**: `@testing-library/react`, `@testing-library/jest-dom` para assertions e render de componentes.

### Git Workflow

- Repositório pode ser editado via GitHub (push) ou IDE local. Convenções de branch e commit não estão documentadas no repositório; usar fluxo padrão (ex.: `main` como tronco e branches por feature/fix) até definição explícita.

## Domain Context

- **Blog**: Publicação de artigos com título, slug, resumo, conteúdo (HTML), imagem de capa, autor, datas e ordem narrativa (`story_order`). Dados persistidos em SQLite; expostos ao frontend via BFF.
- **Páginas**: Início (destaque + recentes), lista de posts, post único por slug, índice por ordem de história.
- **Autores**: Modelo na API (Author); no frontend representados pelo objeto `author` (name, avatar, bio) aninhado em cada post.

## Important Constraints

- **Variáveis de ambiente**: Não commitar `.env`. Frontend: `VITE_BFF_URL` (opcional; padrão em dev `http://localhost:5000`). BFF: `API__BaseUrl` para a API interna. API: connection string SQLite. Build e testes do frontend rodam sem obrigatoriedade de backend; a UI trata BFF indisponível (mensagem de erro).

## External Dependencies

- **Frontend**: Node.js e npm para desenvolvimento, build e testes.
- **Backend**: .NET 8 SDK para rodar API e BFF.
- (O projeto foi criado com Lovable; crédito no README.)
