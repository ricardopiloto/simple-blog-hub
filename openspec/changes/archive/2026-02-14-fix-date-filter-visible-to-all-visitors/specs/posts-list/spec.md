# posts-list — delta for fix-date-filter-visible-to-all-visitors

## MODIFIED Requirements

### Requirement: Filtro por data com calendário (data única ou intervalo) na página Artigos (SHALL)

**Scope update:** The date filter on the **Artigos** page (`/posts`) SHALL be **visible and usable by all visitors**, whether or not they are authenticated. The control (e.g. date range picker or calendar trigger) SHALL **not** be hidden or disabled based on authentication state; any visitor who opens `/posts` SHALL see the date filter next to the search field and SHALL be able to select a single date or a date range to filter the list. The existing behaviour (calendar opens on interaction, filtering by publication date, pagination reset) remains unchanged; this requirement adds that **no authentication condition** SHALL hide the date filter.

#### Scenario: Visitante não autenticado vê e usa o filtro de data

- **Dado** que o utilizador **não** está autenticado (visitante anónimo)
- **Quando** o utilizador acede à página Artigos (`/posts`)
- **Então** o controlo de filtro por data (ex.: botão ou campo "Filtrar por data") está **visível** ao lado do campo de pesquisa
- **E** o utilizador pode clicar ou focar o controlo, abrir o calendário e selecionar uma data ou intervalo
- **E** a lista de artigos é filtrada conforme a seleção (e a API/BFF aceita fromDate/toDate na lista pública sem exigir autenticação)
