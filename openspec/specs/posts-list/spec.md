# posts-list Specification

## Purpose
TBD - created by archiving change add-posts-page-pagination-and-search. Update Purpose after archive.
## Requirements
### Requirement: Página Artigos paginada com 6 itens por página

A página **Artigos** (`/posts`) **deve** (SHALL) exibir a lista de posts publicados com **paginação** de **6 itens por página**. Quando o número total de resultados for maior que 6, o sistema **deve** mostrar controles de navegação (ex.: botões "Anterior" e "Próxima", e/ou números de página) e **deve** exibir apenas os 6 itens da página atual. A API **deve** suportar parâmetros `page` e `pageSize` para a lista pública; quando solicitada com paginação, a resposta **deve** ser um objeto com `items` (array de posts da página) e `total` (número total de resultados), de forma a permitir calcular o número de páginas e desabilitar navegação quando aplicável.

#### Scenario: Lista com mais de 6 posts mostra paginação

- **Dado** que existem pelo menos 7 posts publicados
- **Quando** o utilizador acede à página Artigos
- **Então** são exibidos no máximo **6 posts** na primeira página
- **E** existem controles de navegação para aceder às páginas seguintes (ex.: "Próxima", ou números de página)
- **E** ao navegar para a página 2, são exibidos os posts correspondentes (itens 7–12, ou os restantes se forem menos)

#### Scenario: Lista com 6 ou menos posts não exige segunda página

- **Dado** que existem 6 ou menos posts publicados
- **Quando** o utilizador acede à página Artigos
- **Então** todos os posts são exibidos numa única "página"
- **E** os controles de paginação podem estar desativados ou indicar "Página 1 de 1"

### Requirement: Filtro de pesquisa dinâmico por título, autor e data

**Scope update:** The existing text search filter SHALL remain; in addition, the page SHALL provide the **date filter** (see ADDED requirement "Filtro por data com calendário") and **auto-complete** (see ADDED requirement "Auto-complete no campo de pesquisa"). The dynamic text filter SHALL continue to consider title, author name, and date string as today; the new date filter is separate and applies by publication date (single date or range). The new auto-complete SHALL suggest author names and titles that match the current input.

No change to the existing scenarios for search by title, author, or date string; they still apply. The following scenario is added:

#### Scenario: Filtro de texto e filtro de data em conjunto

- **GIVEN** the user has entered text in the search field and optionally selected a date or date range
- **WHEN** the list is displayed
- **THEN** the result is filtered by both: (1) text match on title, author, or date string, and (2) publication date within the selected date or range (if any)
- **AND** pagination applies to the combined filtered result

### Requirement: Filtro por data com calendário (data única ou intervalo) na página Artigos (SHALL)

**Scope update:** The date filter on the **Artigos** page (`/posts`) SHALL be **visible and usable by all visitors**, whether or not they are authenticated. The control (e.g. date range picker or calendar trigger) SHALL **not** be hidden or disabled based on authentication state; any visitor who opens `/posts` SHALL see the date filter next to the search field and SHALL be able to select a single date or a date range to filter the list. The existing behaviour (calendar opens on interaction, filtering by publication date, pagination reset) remains unchanged; this requirement adds that **no authentication condition** SHALL hide the date filter.

#### Scenario: Visitante não autenticado vê e usa o filtro de data

- **Dado** que o utilizador **não** está autenticado (visitante anónimo)
- **Quando** o utilizador acede à página Artigos (`/posts`)
- **Então** o controlo de filtro por data (ex.: botão ou campo "Filtrar por data") está **visível** ao lado do campo de pesquisa
- **E** o utilizador pode clicar ou focar o controlo, abrir o calendário e selecionar uma data ou intervalo
- **E** a lista de artigos é filtrada conforme a seleção (e a API/BFF aceita fromDate/toDate na lista pública sem exigir autenticação)

### Requirement: Auto-complete no campo de pesquisa da página Artigos (SHALL)

The **search field** on the Artigos page SHALL show **suggestions** (auto-complete) as the user types. Suggestions SHALL include options that match the current input (e.g. author names, post titles that contain the typed text, case-insensitive). The list of suggestions SHALL update as the user types (e.g. typing "D" shows matches for "D"; "Do" narrows to "Do"; "Dora" to "Dora"). The user MAY select a suggestion to apply that value to the search field and filter the list, or continue typing. The implementation MAY derive suggestions from the first page of search results or from a dedicated suggestions endpoint; the UI SHALL present a dropdown (or equivalent) with the matching options while the user types.

#### Scenario: Suggestions appear as user types

- **GIVEN** the user is on the Artigos page and the search field is focused or has focus after typing
- **WHEN** they type a character or substring (e.g. "Do")
- **THEN** a dropdown (or list) of suggestions is shown with options that match the current text (e.g. author names or titles containing "Do")
- **AND** the suggestions update as the user continues typing

#### Scenario: Selecting a suggestion applies the filter

- **GIVEN** the suggestions dropdown is visible with at least one option
- **WHEN** the user selects one suggestion (e.g. an author name or title)
- **THEN** the search field is filled with that value (or the filter is applied with that value)
- **AND** the list is filtered accordingly and pagination applies to the result

