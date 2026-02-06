# Change: Área do Autor mostra todos os posts; editar/excluir apenas para dono ou colaborador

## Why

Hoje a Área do Autor lista apenas os posts que o autor pode editar (dono ou colaborador). O requisito é que **todos os autores vejam todos os posts** na Área do Autor, mas que as ações **Editar** e **Excluir** apareçam somente nos posts em que o autor é dono ou colaborador (Editar para dono e colaborador; Excluir apenas para dono). Assim fica explícito o catálogo completo e quem pode atuar em cada post.

## What Changes

- **API**: Oferecer um modo de listagem (ex.: `GET /api/posts?forAuthorArea=true` com `X-Author-Id`) que retorne **todos** os posts com `author_id` e `collaborators` no DTO, para a UI decidir onde mostrar Editar/Excluir. A API continua exigindo autenticação e aplicando as regras de permissão em edição e exclusão (já existentes).
- **BFF**: Expor o novo modo (ex.: `GET /bff/posts/author-area` ou query equivalente) repassando para a API com identidade do usuário.
- **Frontend**: Na Área do Autor, consumir a lista de **todos** os posts (novo endpoint ou função) em vez de apenas `fetchEditablePosts`. Para cada post, exibir o botão **Editar** somente quando o autor logado for dono (`post.author_id === author.id`) ou estiver em `post.collaborators`; exibir **Excluir** somente quando for dono. Ajustar mensagem quando não houver posts (ex.: "Nenhum post no blog." em vez de "Você ainda não tem posts." quando a lista for global).

## Impact

- Affected specs: post-permissions
- Affected code: API `PostsController` (novo parâmetro ou ramo de listagem), BFF `BffPostsController` e `ApiClient`, frontend `src/api/client.ts`, `src/pages/AreaAutor.tsx`
