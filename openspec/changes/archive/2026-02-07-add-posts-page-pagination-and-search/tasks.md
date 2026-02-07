# Tasks: add-posts-page-pagination-and-search

## 1. API: resposta paginada e parâmetros de filtro

- [x] 1.1 Definir tipo de resposta paginada (ex.: `PagedPostsResponse` com `items` e `total`) em `PostDto.cs` ou ficheiro de modelos da API. Usar nomes JSON `items` e `total`.
- [x] 1.2 Em GetPosts (ramo público, quando não é editable nem forAuthorArea), aceitar parâmetros opcionais `page` (int, 1-based), `pageSize` (int, ex.: default 6) e `search` (string, opcional). Quando `page` e `pageSize` estão presentes: (a) aplicar filtro por `search` se não vazio (título, Author.Name, data formatada como string contém search); (b) ordenar (order=date ou story); (c) obter total após filtro; (d) aplicar Skip/Take e devolver `{ items, total }`. Quando `page`/`pageSize` não estão presentes, manter comportamento atual (devolver array de PostDto).

## 2. BFF: repassar parâmetros e resposta paginada

- [x] 2.1 No endpoint GET /bff/posts, aceitar e repassar à API os query params `page`, `pageSize` e `search`. Quando a API devolver corpo com `{ items, total }`, repassar esse corpo ao cliente; quando devolver array, repassar como hoje.

## 3. Frontend: cliente API e tipos

- [x] 3.1 Em `frontend/src/api/types.ts`, adicionar tipo para resposta paginada (ex.: `PagedPostsResponse { items: Post[], total: number }`).
- [x] 3.2 Em `frontend/src/api/client.ts`, adicionar função (ex.: `fetchPostsPage`) que chama o BFF com `order=date`, `page`, `pageSize=6` e opcionalmente `search`, e devolve a resposta paginada. Manter `fetchPosts(order)` sem paginação para outros consumidores (ex.: página inicial).

## 4. Frontend: página Artigos com paginação e pesquisa

- [x] 4.1 Em `Posts.tsx`, usar estado para `page` (1-based) e `search` (string). Adicionar campo de pesquisa (input) com valor controlado por `search` e **debounce** (ex.: 300–400 ms) antes de refletir no pedido à API; ao alterar `search`, resetar `page` para 1.
- [x] 4.2 Chamar `fetchPostsPage(page, 6, search)` (ou equivalente) e exibir apenas `items` na grelha. Exibir controles de paginação (Anterior, Próxima e/ou "Página X de Y") com base em `total` e `pageSize`; desabilitar Anterior na página 1 e Próxima quando não há mais páginas.

## 5. Spec delta

- [x] 5.1 O delta em `openspec/changes/add-posts-page-pagination-and-search/specs/posts-list/spec.md` está preenchido com requisitos ADDED (paginação 6 por página e filtro dinâmico por título, autor, data) e cenários. Revisar se necessário.

## 6. Validação

- [x] 6.1 Executar `openspec validate add-posts-page-pagination-and-search --strict` e corrigir qualquer falha.
