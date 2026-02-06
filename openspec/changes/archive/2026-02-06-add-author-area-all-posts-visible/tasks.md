## 1. API – listagem “todos os posts” para área do autor

- [x] 1.1 Em `GET /api/posts`, adicionar parâmetro (ex.: `forAuthorArea=true`) que, quando presente com `X-Author-Id` válido, retorne **todos** os posts (sem filtrar por dono/colaborador), com `author_id` e `collaborators` no DTO (contentAsHtml: false, includeAuthorId: true, includeCollaborators: true). Retornar 401 se não houver identidade.
- [x] 1.2 Manter o comportamento atual de `editable=true` inalterado (opcional: documentar que a área do autor passará a usar `forAuthorArea`).

## 2. BFF – endpoint de lista para área do autor

- [x] 2.1 Adicionar em `ApiClient` método que chame a API com o novo parâmetro (ex.: `GetAllPostsForAuthorAreaAsync(authorId)`).
- [x] 2.2 Expor no BFF um endpoint protegido (ex.: `GET /bff/posts/author-area`) que repasse a chamada à API com o AuthorId do JWT e devolva a lista de todos os posts com author_id e collaborators.

## 3. Frontend – Área do Autor usa lista completa

- [x] 3.1 No cliente API (`src/api/client.ts`), adicionar função (ex.: `fetchAllPostsForAuthorArea()`) que chame `GET /bff/posts/author-area` com auth.
- [x] 3.2 Em `AreaAutor.tsx`, trocar `fetchEditablePosts()` por essa nova função (lista de todos os posts).
- [x] 3.3 Para cada post no listado: exibir **Editar** apenas se `author.id === post.author_id` ou se `post.collaborators` contiver o autor atual; exibir **Excluir** apenas se `author.id === post.author_id`. Manter links e diálogo de exclusão como hoje.
- [x] 3.4 Ajustar o estado vazio: quando não houver posts na lista, exibir mensagem adequada (ex.: "Nenhum post no blog.").

## 4. Validação

- [x] 4.1 Build da API, BFF e frontend. Testar: com dois autores e posts de cada um (e um post com colaborador), logar como autor A e verificar que vê todos os posts; Editar/Excluir só nos próprios ou como colaborador; logar como autor B e verificar o mesmo.
