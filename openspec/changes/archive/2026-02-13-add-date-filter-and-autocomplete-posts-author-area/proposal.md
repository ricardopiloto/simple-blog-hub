# Proposal: Filtro por data (calendário) e auto-complete no campo de pesquisa (Artigos e Área do autor)

## Summary

Melhorar a experiência de filtro em duas áreas: **(1) Página de Artigos** (`/posts`) e **(2) Área do autor** (secção Publicações em `/area-autor`). Serão adicionados: um **filtro por data** com calendário (data única ou intervalo), ao lado do campo de texto; e **auto-complete** no campo de pesquisa por texto, mostrando sugestões que coincidem com o que o utilizador digita (ex.: ao digitar "Dora", opções que contenham "D", depois "Do", etc.). Por defeito, o filtro de data não está aplicado (mostram-se todos os resultados, com a paginação já existente). O auto-complete aplica-se tanto à página de Artigos como à área do autor.

## Goals

- **Filtro por data**: Em ambas as páginas (Artigos e Área do autor), adicionar um **campo de data** ao lado do campo de pesquisa. Ao clicar, abrir um **calendário** que permita escolher **uma data** ou **intervalo de datas** (range). Por defeito, **nenhum** filtro de data está ativo — a lista mostra todos os itens (com paginação onde aplicável). Quando o utilizador seleciona uma data ou um range, a lista é filtrada por data de publicação (ex.: `published_at`) dentro desse intervalo.
- **Auto-complete no campo de texto**: O campo de pesquisa por texto deve mostrar **sugestões** conforme o utilizador digita: opções que correspondam ao texto atual (ex.: autores cujo nome contenha o texto, títulos que contenham o texto). Exemplo: ao digitar "D" aparecem opções com "D"; ao digitar "Do", opções com "Do"; ao digitar "Dora", opções com "Dora". O utilizador pode continuar a digitar ou selecionar uma sugestão para aplicar o filtro. Isto aplica-se à página de Artigos e à Área do autor.

## Scope

- **In scope**:
  - **Página de Artigos** (`/posts`): (1) Campo de data com calendário (data única ou range); por defeito sem filtro de data; integração com a API/BFF para filtrar por intervalo de datas quando suportado. (2) Auto-complete no campo de pesquisa: sugestões (ex.: autores, títulos) que coincidam com o texto digitado; implementação pode usar endpoint de sugestões ou dados da primeira página de resultados, conforme design.
  - **Área do autor** (Publicações em `/area-autor`): (1) Campo de data com calendário (data única ou range); por defeito sem filtro de data; filtro client-side por `published_at` no intervalo. (2) Auto-complete no campo de pesquisa: sugestões derivadas da lista já carregada (nomes de autores, títulos) que coincidam com o texto digitado.
  - **Backend**: Suporte opcional a parâmetros de data (ex.: `fromDate`, `toDate`) na listagem paginada de posts públicos, para que a página de Artigos possa filtrar por data no servidor (ver design).
- **Out of scope**: Alterar a lógica de paginação existente para além da integração com o novo filtro de data; alterar autenticação ou permissões; suporte a outros tipos de filtro além de texto e data.

## Affected code and docs

- **Frontend**: `frontend/src/pages/Posts.tsx` (campo data + calendário, auto-complete no search); `frontend/src/pages/AreaAutorDashboard.tsx` (campo data + calendário, auto-complete no filtro de texto). Possível componente partilhado para calendário (data/range) e/ou para campo de pesquisa com auto-complete.
- **API/BFF**: `backend/api/Controllers/PostsController.cs`, `backend/bff/Controllers/BffPostsController.cs`, `backend/bff/Services/ApiClient.cs` — adicionar parâmetros opcionais `fromDate` e `toDate` na listagem paginada pública.
- **Specs**: Deltas em `posts-list` e `author-area-dashboard` (requisitos ADDED/MODIFIED para filtro de data e auto-complete).

## Dependencies and risks

- **API**: A listagem paginada atual não aceita filtro por data; é necessário adicionar `fromDate`/`toDate` (ou equivalente) e aplicar o filtro por `PublishedAt` (ou data de publicação) no backend. Sem isto, a página de Artigos teria de filtrar por data apenas no cliente sobre a página atual (má experiência); por isso a proposta inclui suporte no backend.
- **Auto-complete na página de Artigos**: Se não existir endpoint de sugestões, as sugestões podem ser limitadas aos resultados da primeira página de pesquisa (ex.: ao digitar "Do", chamar a API com `search=Do` e extrair autores/títulos dos itens devolvidos para o dropdown). Alternativa: novo endpoint `GET /bff/posts/search-suggestions?q=...` que devolva lista de autores e títulos que coincidam (design pode optar por uma das abordagens).

## Success criteria

- Na página de Artigos e na Área do autor, existe um campo de data ao lado do campo de pesquisa; ao interagir, abre-se um calendário que permite escolher uma data ou um intervalo; por defeito não há filtro de data.
- Quando uma data ou range está selecionado, a lista é filtrada por data de publicação dentro desse intervalo (com paginação na página de Artigos).
- O campo de pesquisa por texto mostra sugestões (ex.: autores, títulos) que coincidam com o texto digitado, em ambas as páginas; o utilizador pode selecionar uma sugestão ou continuar a digitar.
- `openspec validate add-date-filter-and-autocomplete-posts-author-area --strict` passa.
