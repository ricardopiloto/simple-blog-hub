# API (cliente no frontend)

Cliente HTTP que consome o **BFF** (Backend-for-Frontend). A base URL é configurada via `VITE_BFF_URL` (padrão em dev: `http://localhost:5000`).

- **client.ts**: `fetchPosts(order)`, `fetchPostBySlug(slug)` — chamam `GET /bff/posts` e `GET /bff/posts/{slug}`.
- **types.ts**: tipo `Post` alinhado à resposta do BFF (snake_case).

Os hooks em `@/hooks/usePosts` usam este cliente (e React Query) para listar e exibir posts. O arquivo `@/data/mockPosts` permanece para testes ou referência; os fluxos de leitura usam o BFF.
