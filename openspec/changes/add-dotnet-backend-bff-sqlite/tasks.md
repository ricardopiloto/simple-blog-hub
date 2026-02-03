# Tasks: add-dotnet-backend-bff-sqlite

## 1. Backend API (.NET Core + SQLite)

- [x] 1.1 Criar solução/projeto ASP.NET Core em `backend/api/` (Web API, .NET 8 ou LTS).
- [x] 1.2 Adicionar Entity Framework Core e provedor SQLite; definir modelos `Author` e `Post` (Post com AuthorId, Slug único, StoryOrder, Published, etc.).
- [x] 1.3 Criar DbContext e migration inicial; configurar connection string para SQLite (ex.: `blog.db`).
- [x] 1.4 Implementar seed que insere conteúdo equivalente ao `mockPosts` atual (1 autor, 5 posts).
- [x] 1.5 Implementar endpoints: `GET /api/posts` (lista, filtro published, ordenação date/story), `GET /api/posts/{slug}` (por slug, com author). Resposta com author aninhado no formato esperado pelo frontend.
- [x] 1.6 Documentar em `backend/api/README.md` como rodar e configurar (porta, connection string).

## 2. BFF (.NET Core)

- [x] 2.1 Criar projeto ASP.NET Core em `backend/bff/` (Web API).
- [x] 2.2 Configurar HttpClient para a API interna (base URL via configuração, ex.: `API__BaseUrl`).
- [x] 2.3 Implementar endpoints: `GET /bff/posts` (delega à API, retorna posts publicados), `GET /bff/posts/{slug}` (delega à API). Sem expor a API diretamente; BFF é o único ponto de entrada público.
- [x] 2.4 Documentar em `backend/bff/README.md` como rodar e configurar (porta, URL da API).

## 3. Frontend: cliente API e hooks

- [x] 3.1 Implementar cliente HTTP em `src/api/` (ex.: `client.ts` ou `posts.ts`) que chama o BFF: base URL de `import.meta.env.VITE_BFF_URL` (com fallback para desenvolvimento). Funções: listar posts (por data ou story_order), obter post por slug. Tipos de resposta alinhados ao `Post` atual (id, title, slug, excerpt, content, cover_image, published, published_at, created_at, updated_at, story_order, author).
- [x] 3.2 Atualizar hooks em `src/hooks/usePosts.ts` para usar o cliente da API em vez de `mockPosts` (usePublishedPosts, usePostsByStoryOrder, usePost). Manter assinaturas compatíveis (data, isLoading, error) e usar estado de loading/erro real. usePostsStore e useAllPosts: decidir se passam a chamar BFF ou se permanecem apenas para uso admin/ordenacao (podem chamar BFF ou manter mock para reordenação até haver endpoints de escrita).
- [x] 3.3 Garantir que componentes e páginas que consomem os hooks continuem funcionando (Index, Posts, PostPage, StoryIndex). Ajustar tratamento de loading e erro na UI se necessário.
- [x] 3.4 Remover ou restringir uso direto de `@/data/mockPosts` nos fluxos de leitura (manter apenas para testes ou fallback se definido no design). Atualizar imports nos hooks.

## 4. Documentação do projeto

- [x] 4.1 Atualizar `README.md`: descrever arquitetura (Frontend → BFF → API → SQLite); requisitos (.NET SDK para backend, Node/npm para frontend); instruções para rodar API, BFF e frontend (ordem e portas); variáveis de ambiente (ex.: `VITE_BFF_URL`, opcionalmente API e BFF); comandos para build/test do frontend e para rodar a API e o BFF.
- [x] 4.2 Atualizar `openspec/project.md`: Tech Stack (adicionar .NET Core, SQLite, BFF); Architecture Patterns (BFF como único ponto de entrada, API interna, SQLite); Estrutura de pastas (backend/api, backend/bff, src/api cliente); Dados de posts (fonte: BFF; tipo Post inalterado); variáveis de ambiente e constraints; referência ao design (BFF + API).

## 5. Validação

- [x] 5.1 Com API e BFF rodando e SQLite com seed: abrir frontend e validar que a lista de posts, post por slug e índice por story_order funcionam com dados do banco.
- [x] 5.2 Executar `npm run build` e `npm run test` no frontend; confirmar que não há regressões. Garantir que o cliente API lida com BFF indisponível (erro/fallback) sem quebrar o build.
