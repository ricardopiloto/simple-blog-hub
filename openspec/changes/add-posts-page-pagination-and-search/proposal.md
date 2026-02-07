# Proposal: Paginação e filtro de pesquisa na página Artigos

## Summary

Na página **Artigos** (`/posts`), adicionar **paginação** (6 artigos por página) e um **filtro de pesquisa dinâmico**. O leitor poderá pesquisar por **título**, **autor** ou **data**; a lista atualiza em tempo real (com debounce) e a paginação aplica-se sobre o resultado filtrado. Assim, a página escala melhor com muitos posts e fica alinhada à experiência do Índice da História (6 itens por página e filtro).

## Goals

- **Paginação**: Exibir no máximo **6 posts por página** na lista de Artigos. Quando houver mais de 6, mostrar controles de navegação (ex.: anterior, próxima, ou números de página).
- **Filtro dinâmico**: Um campo de pesquisa (ex.: caixa de texto) que filtra a lista em tempo real por:
  - **Título** do post (substring, case-insensitive);
  - **Nome do autor** (substring, case-insensitive);
  - **Data** (ex.: ano "2025", mês "fev", ou data formatada) — correspondência sobre a data de publicação ou criação formatada.
- **Consistência**: A paginação aplica-se sobre a **lista já filtrada** (6 itens por página do resultado da pesquisa). Resposta da API/BFF deve permitir saber o total de resultados e a página solicitada.

## Scope

- **In scope**: (1) **API**: Estender GET /api/posts (quando usado para lista pública com `published=true`) com parâmetros opcionais `page`, `pageSize` e `search`. Quando `page` e `pageSize` são enviados, a resposta SHALL ser um objeto `{ items: PostDto[], total: number }`; o filtro `search` aplica-se a título, nome do autor e data formatada (ex.: published_at ou created_at). Ordenação mantida (ex.: `order=date` por criação decrescente). (2) **BFF**: Repassar os parâmetros à API e devolver a mesma estrutura quando paginação for pedida. (3) **Frontend**: Na página `/posts`, usar `pageSize=6`, exibir campo de pesquisa (debounce), chamar a API com `page`, `pageSize` e `search`; exibir apenas os `items` da página atual e controles de paginação. (4) **Retrocompatibilidade**: Chamadas sem `page`/`pageSize` continuam a receber o array de posts como hoje (página inicial e outros consumidores). (5) **Spec delta**: Nova capacidade ou delta para a lista de artigos (posts-list) com requisitos de paginação e filtro.
- **Out of scope**: Alterar a página inicial ou o Índice da História; filtro por tags ou categorias; ordenação alterável pelo utilizador na página Artigos (mantém-se ordem por data).

## Affected code and docs

- **backend/api/Controllers/PostsController.cs**: Em GetPosts (ramo público), aceitar `page`, `pageSize`, `search`. Aplicar filtro por search (título, Author.Name, data formatada). Quando page/pageSize presentes, aplicar Skip/Take e devolver `{ items, total }`; caso contrário, manter comportamento atual (retornar lista).
- **backend/api/Models/PostDto.cs** (ou novo): Tipo de resposta paginada `PagedPostsResponse` com `items` e `total` (quando necessário).
- **backend/bff**: GetPosts aceitar e repassar `page`, `pageSize`, `search`; quando paginação pedida, devolver corpo com `{ items, total }`.
- **frontend/src/api/client.ts**: Nova função (ex.: `fetchPostsPage`) ou parâmetros em `fetchPosts` para pedir página e search; tipagem da resposta paginada.
- **frontend/src/pages/Posts.tsx**: Estado de página e search; input de pesquisa com debounce; chamada à API com page, pageSize=6, search; render da lista a partir de `items`; controles de paginação (anterior/próxima e/ou números).
- **openspec/changes/add-posts-page-pagination-and-search/specs/posts-list/spec.md**: ADDED requirements e cenários para paginação (6 por página) e filtro dinâmico (título, autor, data).

## Dependencies and risks

- **Retrocompatibilidade**: Clientes que não enviam `page`/`pageSize` continuam a receber array; apenas quando paginação é solicitada a resposta muda para `{ items, total }`. A página inicial e outros usos de `fetchPosts('date')` sem paginação mantêm-se.
- **Data no filtro**: A correspondência por "data" será feita sobre a representação em string da data (ex.: ISO ou formato local), para permitir pesquisas como "2025", "fev", "06". Detalhe no design.

## Success criteria

- Na página Artigos, o leitor vê no máximo 6 posts por página e pode navegar entre páginas.
- O leitor pode digitar no campo de pesquisa e a lista é filtrada por título, autor ou data (atualização dinâmica, com debounce).
- A paginação reflete o total de resultados filtrados (ex.: "Página 1 de 3").
- GET /api/posts e BFF sem parâmetros de paginação continuam a devolver o array como hoje.
- Spec delta e `openspec validate add-posts-page-pagination-and-search --strict` passam.
