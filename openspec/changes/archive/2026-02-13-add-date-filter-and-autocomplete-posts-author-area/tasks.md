# Tasks: add-date-filter-and-autocomplete-posts-author-area

Ordered list of work items. Dependencies or parallelizable work are noted.

## 1. Backend: fromDate/toDate na API paginada

- [x] 1.1 No API (PostsController), adicionar parâmetros de query opcionais `fromDate` e `toDate` (ISO date, ex.: yyyy-MM-dd) ao GET /api/posts paginado (quando page e pageSize estão presentes). Filtrar a lista por PublishedAt em [fromDate, toDate] (inclusivo); se só um for fornecido, aplicar do início ou até ao fim. BFF e ApiClient: repassar fromDate e toDate para a API. Verificar com pedido manual ou automatizado que a contagem e itens filtrados respeitam o intervalo.

## 2. Frontend: cliente API

- [x] 2.1 Em `frontend/src/api/client.ts`, estender `fetchPostsPage` para aceitar opcionais `fromDate` e `toDate` (string ou undefined) e adicioná-los à query do pedido quando presentes. Tipos: atualizar PagedPostsResponse e call sites se necessário.

## 3. Componente date range picker

- [x] 3.1 Adicionar um date picker que suporte data única e intervalo (ex.: com primitivos UI existentes: Calendar, Popover). Deve abrir ao clicar/focus, permitir selecionar uma data ou início+fim, e chamar onChange com o(s) valor(es) ou null ao limpar. Pode ser componente partilhado (ex.: em `components/ui/`) ou inline nas páginas; utilizável em Posts e AreaAutorDashboard.

## 4. Página Artigos: filtro de data

- [x] 4.1 Em `Posts.tsx`, adicionar estado para o filtro de data (ex.: fromDate, toDate ou objeto range). Renderizar o controlo do date picker ao lado do campo de pesquisa. Ao selecionar data ou range, atualizar estado e passar fromDate/toDate a `fetchPostsPage`; repor página para 1 quando o filtro de data mudar. Por defeito: sem filtro de data (fromDate/toDate não enviados).

## 5. Página Artigos: auto-complete no campo de pesquisa

- [x] 5.1 Em `Posts.tsx`, adicionar dropdown de sugestões abaixo (ou ligado) ao campo de pesquisa. Enquanto o utilizador digita, obter sugestões da primeira página de resultados (chamar fetchPostsPage com a query atual, ex.: page 1, pageSize 6 ou maior) e mostrar autores e títulos coincidentes no dropdown. Ao selecionar sugestão, definir o valor do campo e aplicar o filtro. Debounce no fetch de sugestões. Acessibilidade (teclado, focus, aria).

## 6. Área autor: filtro de data (client-side)

- [x] 6.1 Em `AreaAutorDashboard.tsx`, adicionar estado para filtro de data (fromDate, toDate ou range). Renderizar o date picker ao lado do campo de pesquisa. No useMemo `filteredPosts` (ou equivalente), após status, tipo de história e filtro de texto, filtrar por data de publicação: quando o filtro de data está definido, manter apenas posts cujo published_at (ou created_at) está na data ou no intervalo. Por defeito: sem filtro de data.

## 7. Área autor: auto-complete no campo de pesquisa

- [x] 7.1 Em `AreaAutorDashboard.tsx`, calcular sugestões a partir da lista `posts` carregada: nomes de autores únicos e títulos que contenham o texto do filtro (case-insensitive). Mostrar dropdown ligado ao campo de pesquisa; atualizar sugestões ao digitar. Ao selecionar sugestão, definir o texto do filtro. Evitar conflito com filtros existentes (status, tipo, ordenação).

## 8. Validação e testes

- [x] 8.1 Executar `openspec validate add-date-filter-and-autocomplete-posts-author-area --strict` e corrigir falhas. Adicionar ou ajustar testes de frontend para o novo comportamento (ex.: filtro de data repõe página, sugestões aparecem, seleção aplica filtro). Verificação manual: página Artigos e Área do autor mostram date picker e auto-complete; por defeito sem filtro de data; filtro texto + data combinados funciona.
