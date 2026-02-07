# Project Context

## Purpose

**1noDado RPG** é um blog de leitura pública para contos e aventuras de RPG ("Contos e aventuras"). O projeto oferece uma experiência de leitura agradável (início, lista de posts, post por slug, índice em ordem de história). A fonte de dados é o **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**; o frontend não acessa a API diretamente.

## Tech Stack

- **Runtime / build**: Node.js, Vite 5 (frontend); .NET 8 (backend API e BFF).
- **Front-end**: React 18, TypeScript, React Router DOM 6.
- **UI**: Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, Lucide React, fontes Inter + Playfair Display.
- **Estado / dados**: TanStack React Query, hooks em `@/hooks/usePosts` que consomem o cliente em `@/api/client.ts` (chamadas ao BFF). Tipo `Post` em `@/api/types.ts`. Dados persistidos em SQLite; API interna em `backend/api`, BFF em `backend/bff`. O frontend vive em **`frontend/`**; o alias `@/` resolve para `frontend/src/`.
- **Backend**: .NET 8, Entity Framework Core, SQLite (API); BFF como único ponto de entrada público.
- **Testes**: Vitest, jsdom, Testing Library (React, Jest-DOM); setup em `frontend/src/test/setup.ts`. Comandos de teste executam-se a partir de `frontend/`.
- **Qualidade**: ESLint 9 (TypeScript, React Hooks, React Refresh).

## Project Conventions

### Branding

- **Logo**: O logo do blog é composto pelo ícone de d20 (Dice 20 faces 1, Delapouite, [game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html), CC BY 3.0) e o texto "noDado RPG", exibido no header e no footer.

### Code Style

- **Path alias**: `@/` aponta para `src/` dentro do frontend (i.e. `frontend/src/`; Vite + TypeScript).
- **Componentes**: Function components; preferir hooks para estado e efeitos.
- **Nomenclatura**: PascalCase para componentes e tipos; camelCase para funções e variáveis; arquivos de componente em PascalCase (ex.: `PostCard.tsx`, `Layout.tsx`).
- **Idioma da UI**: Textos de interface em português (ex.: "Artigos Recentes", "Fique por dentro", "Nenhum artigo publicado ainda").

### Architecture Patterns

- **Arquitetura em camadas**: Frontend → BFF (único ponto de entrada público) → API (interna) → SQLite. A API não é exposta à internet; o BFF protege e agrega.
- **Estrutura de pastas**: Frontend em **`frontend/`** (`frontend/src/`: componentes, páginas, hooks, `frontend/src/api/` cliente BFF). Backend: `backend/api/` (API .NET, EF Core, SQLite, modelos, migrations, seed), `backend/bff/` (BFF .NET, HttpClient para a API, endpoints `/bff/posts`). Path alias `@/` aponta para `frontend/src/`. Comandos npm (dev, build, test, lint) executam-se a partir de `frontend/`.
- **Rotas**: SPA com React Router; rotas principais: `/` (Index), `/posts`, `/post/:slug`, `/indice` (StoryIndex), `/login` (login de autores), `/area-autor` (dashboard, protegida), `/area-autor/contas` (perfil/gestão de contas: qualquer autor logado acessa; Admin vê todas as contas, demais autores só o próprio perfil), `/area-autor/posts/novo` e `/area-autor/posts/:id/editar` (protegidas); catch-all `*` → `NotFound`.
- **Autenticação**: Contexto de auth em `AuthContext` (token JWT, autor logado); login via BFF; rotas protegidas com `ProtectedRoute`; troca obrigatória de senha no primeiro acesso com senha padrão (modal bloqueante, não pode ser fechado até a alteração da senha); Admin identificado por `Admin__Email`. No header, quando autenticado, exibem-se o link "Área do autor", o link "Contas" (perfil/gestão) e um botão **Sair** (logout) que encerra a sessão e redireciona para a página inicial.
- **Layout**: `Layout` (Header + main + Footer); componentes de blog em `components/blog/`, layout em `components/layout/`, UI reutilizável em `components/ui/`.
- **Tema**: Tema claro/escuro via `ThemeContext` e classe no `documentElement`; persistência em `localStorage`; fallback para `prefers-color-scheme`.
- **Dados de posts**: Modelo `Post` em `@/api/types.ts` (id, title, slug, excerpt, content, cover_image, published, published_at, story_order, author_id opcional, author). Conteúdo armazenado em **Markdown** na API; leitura pública recebe HTML (conversão no backend). Cliente em `@/api/client.ts`: `fetchPosts`, `fetchPostBySlug` (público); `login`, `fetchEditablePosts`, `fetchPostByIdForEdit`, `createPost`, `updatePost`, `deletePost` (com token JWT). Hooks em `@/hooks/usePosts.ts` para leitura; área autoral usa React Query com chamadas autenticadas. `@/auth/storage.ts` e `@/contexts/AuthContext.tsx` para token e autor; rotas protegidas via `ProtectedRoute`.

### Testing Strategy

- **Runner**: Vitest; ambiente jsdom; `globals: true`; `setupFiles: ["./src/test/setup.ts"]` (relativo a `frontend/`).
- **Escopo**: Testes em `frontend/src/**/*.{test,spec}.{ts,tsx}`; comando `npm run test` (run) e `npm run test:watch` (watch), executados a partir de `frontend/`.
- **Stack**: `@testing-library/react`, `@testing-library/jest-dom` para assertions e render de componentes.

### Git Workflow

- **Repositório:** https://github.com/ricardopiloto/simple-blog-hub
- Repositório pode ser editado via GitHub (push) ou IDE local. Convenções de branch e commit não estão documentadas no repositório; usar fluxo padrão (ex.: `main` como tronco e branches por feature/fix) até definição explícita.

## Domain Context

- **Blog**: Publicação de artigos com título, slug, resumo, conteúdo (armazenado em Markdown; exibido em HTML na leitura pública), imagem de capa, autor, datas e ordem narrativa (`story_order`). Dados persistidos em SQLite; expostos ao frontend via BFF. Apenas posts **publicados** (campo "Publicado" marcado no formulário) aparecem na **página inicial** e no **Índice da História**; posts em rascunho são visíveis na Área do autor e acessíveis por link direto ao slug. **Contagem de visualizações**: apenas utilizadores autenticados podem ver o número de visualizações de cada post — na Área do autor (ao lado de Publicado/Rascunho) e na página do artigo (na mesma linha que autor e data, com ícone); o BFF só inclui `view_count` quando o pedido tem JWT válido.
- **Páginas**: Início (destaque + recentes), ordenado por data/hora de **criação** — Destaque = último post criado (entre publicados), Artigos recentes = mesma ordem decrescente; lista de posts, **post único por slug** (conteúdo do artigo e, no final da página, a descrição do autor quando configurada em Contas), **índice por ordem de história** (`/indice`: paginação de 6 itens, filtro em tempo real por número da ordem ou título, cards com título e imagem sem resumo; apenas usuários autenticados podem editar a ordem por **número** ou **arrastar** os cards e persistir); login (`/login`); área do autor (`/area-autor`: dashboard; novo/editar post com editor Markdown).
- **Autores**: Modelo na API (Author); no frontend representados pelo objeto `author` (name, avatar, bio) aninhado em cada post. Autores que podem logar têm um `User` (e-mail, hash de senha) vinculado 1:1 ao Author.
- **Gestão de contas**: Qualquer autor logado pode acessar a rota **Contas** (`/area-autor/contas`): autores não-Admin veem apenas o **próprio perfil** e podem editar **nome do autor**, **descrição do autor** (breve frase, ex.: «Sonhador e amante de contos e RPG») e **senha**. O **Admin** (e-mail em `Admin:Email` ou `Admin__Email`) vê a lista de todas as contas e pode criar (e-mail e nome; senha padrão `senha123`), **editar** (nome do autor, descrição do autor, e-mail e senha) e excluir usuários, e **resetar a senha** de qualquer usuário para `senha123`. As senhas definidas pelo utilizador ou pelo Admin **devem** cumprir o critério mínimo: 6 caracteres, uma letra maiúscula e um número. Senha padrão nas criações: `senha123`. No **primeiro acesso** com senha padrão, o sistema exige **troca obrigatória de senha** via modal bloqueante; só após alterar a senha o usuário pode usar o restante da área logada. **Recuperação da senha do Admin**: se o Admin esquecer a senha, o operador com acesso ao servidor pode criar um ficheiro de trigger (caminho configurável em `Admin:PasswordResetTriggerPath` ou, por defeito, `admin-password-reset.trigger` no diretório de execução da API); ao reiniciar a API, a senha do utilizador com e-mail `Admin:Email` é reposta para o valor padrão e o ficheiro é removido; o Admin faz login com a senha padrão e altera a senha na área do autor.
- **Permissões por post**: O **Admin** (e-mail configurado em `Admin:Email`) pode editar e excluir qualquer post; dono (autor que criou o post) pode editar e excluir; colaborador (registrado em `PostCollaborator`) pode apenas editar. A API e o BFF validam identidade (JWT no BFF, header `X-Author-Id` repassado à API) e aplicam essas regras.
- **SEO (sitemap e robots.txt)**: O BFF serve GET /sitemap.xml (sitemap dinâmico com páginas estáticas e posts publicados) e GET /robots.txt (com linha Sitemap). Em deploy com Caddy, estes caminhos devem ser encaminhados para o BFF (handle /sitemap.xml e handle /robots.txt antes dos estáticos); ver DEPLOY-DOCKER-CADDY.md.

## Important Constraints

- **Variáveis de ambiente**: Não commitar `.env`. O `.env` em `frontend/` é **opcional**; o projeto roda sem ele (frontend usa padrão em código `http://localhost:5000`; backend usa appsettings e variáveis de ambiente do processo). A única variável de frontend usada é `VITE_BFF_URL` (opcional; padrão em código). O backend (API e BFF) **não lê o `.env` do frontend**; configuração vem de `appsettings.json` e das variáveis de ambiente do processo ao rodar `dotnet run`. BFF: `API__BaseUrl` para a API interna, `API__InternalKey` (opcional) para a chave partilhada com a API (nunca exposta ao frontend). API: connection string SQLite, `API__InternalKey` (opcional) para exigir o header `X-Api-Key` do BFF; quando não configurada, a API aceita pedidos. `Admin__Email` para a conta Admin (quando não configurado, o sistema usa **admin@admin.com** por defeito), `Admin__PasswordResetTriggerPath` (opcional) para o caminho do ficheiro de trigger de recuperação da senha do Admin. O seed de demonstração (autores e posts de exemplo) é **opcional** (`Seed:EnableDemoData` em appsettings); por defeito está desativado para que instalações novas tenham o banco "zerado" (apenas o admin inicial). Build e testes do frontend rodam sem obrigatoriedade de backend; a UI trata BFF indisponível (mensagem de erro). **CORS:** Com deploy same-origin (frontend e BFF no mesmo domínio), não é necessária configuração de domínio no CORS. Opcionalmente o BFF pode restringir origens via `Cors__AllowedOrigins` (definir apenas no servidor; não commitar domínios no repositório).

## External Dependencies

- **Frontend**: Node.js e npm para desenvolvimento, build e testes.
- **Backend**: .NET 8 SDK para rodar API e BFF.
- (O projeto foi criado com Lovable; crédito no README.)
