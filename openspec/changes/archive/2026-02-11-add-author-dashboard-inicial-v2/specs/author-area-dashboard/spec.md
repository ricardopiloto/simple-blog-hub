# author-area-dashboard — delta for add-author-dashboard-inicial-v2

## ADDED Requirements

### Requirement: Dashboard é a tela inicial da área do autor (SHALL)

A **tela inicial** da área do autor (rota **/area-autor**) SHALL be a **dashboard** que exibe os seguintes indicadores em formato legível (números ou cards): (1) **total de posts** no blog; (2) **quantos posts estão publicados** (Published = true); (3) **quantos posts estão planejados/agendados** (ScheduledPublishAt preenchido); (4) **total de visualizações** (soma dos ViewCount de todos os posts); (5) **quantidade de autores** no blog. Os dados SHALL ser obtidos através de um endpoint protegido (BFF/API) que devolve um payload com esses cinco valores. O dashboard SHALL incluir navegação clara para a página **Publicações** (lista de posts e "Novo post") na rota **/area-autor/publicacoes**. Após login com sucesso, o utilizador SHALL ser redirecionado para **/area-autor** (esta dashboard).

#### Scenario: Autor vê o dashboard ao entrar na área do autor

- **GIVEN** o utilizador está autenticado
- **WHEN** acede a /area-autor (ou é redirecionado após login)
- **THEN** vê a tela inicial com os cinco indicadores (total de posts, publicados, planejados, total de visualizações, número de autores)
- **AND** vê um link ou botão para "Publicações" que leva a /area-autor/publicacoes

#### Scenario: Dados do dashboard vêm do backend

- **GIVEN** o frontend está na rota /area-autor
- **WHEN** a página carrega
- **THEN** o cliente chama o endpoint de estatísticas do dashboard (ex.: GET /bff/dashboard/stats) com autenticação
- **AND** os valores exibidos (total posts, publicados, agendados, visualizações, autores) correspondem ao payload retornado pelo BFF/API

#### Scenario: Login redireciona para o dashboard

- **GIVEN** o utilizador não está autenticado
- **WHEN** faz login com sucesso
- **THEN** é redirecionado para /area-autor
- **AND** vê o dashboard (cinco indicadores e link para Publicações), não a lista de posts

---

### Requirement: Página Publicações contém a lista de posts e "Novo post" (SHALL)

A rota **/area-autor/publicacoes** SHALL exibir a **lista de posts** da área do autor (com filtro por autor, título e data, scroll quando há mais de 10 itens, ações editar/excluir conforme permissões) e o botão/link **Novo post** que leva a /area-autor/posts/novo. Esta página SHALL ser acessível a partir do dashboard via link "Publicações" (ou equivalente). A navegação da área do autor SHALL permitir voltar do Publicações para o dashboard (/area-autor) quando aplicável (ex.: breadcrumb ou link "Área do autor").

#### Scenario: Acesso à lista de posts via Publicações

- **GIVEN** o utilizador está autenticado e na dashboard (/area-autor)
- **WHEN** clica em "Publicações" (ou equivalente)
- **THEN** é direcionado para /area-autor/publicacoes
- **AND** vê a lista de posts com o botão "Novo post" e o filtro de pesquisa
- **AND** pode editar/excluir posts conforme as regras de permissão existentes

#### Scenario: Novo post a partir de Publicações

- **GIVEN** o utilizador está em /area-autor/publicacoes
- **WHEN** clica em "Novo post"
- **THEN** é direcionado para /area-autor/posts/novo
- **AND** após criar ou cancelar, pode voltar à lista (Publicações) ou ao dashboard conforme a navegação implementada

---

## MODIFIED Requirements

### Requirement: Área do Autor list has scroll when more than 10 records and dynamic filter

**Scope update:** This requirement SHALL apply to the **Publicações** page at **/area-autor/publicacoes** (the list of posts with "Novo post"), not to the dashboard at /area-autor. The "Área do Autor" post list referred to below is the list rendered on the Publicações page.

The **Publicações** (author area post list) SHALL show a **vertical scrollbar** when the list contains more than **10 records**. The list container SHALL have a maximum height (e.g. equivalent to approximately 10 rows) and `overflow-y: auto` so that when there are more than 10 items (before or after applying the filter), the user can scroll within the container and the scrollbar is visible. When the list has 10 or fewer items, the container may use natural height. The Publicações page SHALL provide a **dynamic filter** (a single search field) that filters the list **in real time** by **author name**, **title**, and **publication date**. The filter SHALL match the user's input (e.g. case-insensitive substring) against the post's title, the post author's name, and a formatted publication date string (e.g. from `published_at`). An empty search SHALL show all posts. Filtering is performed client-side on the already-loaded list; no new API endpoint is required.

#### Scenario: Scrollbar visible when list has more than 10 posts

- **GIVEN** the Publicações page (/area-autor/publicacoes) has loaded and the list of posts (after any filter) has **more than 10** items
- **WHEN** the user views the list
- **THEN** the list is inside a scrollable container with a visible vertical scrollbar
- **AND** the user can scroll to see all items without the page growing unbounded

#### Scenario: Dynamic filter narrows list by author, title, or date

- **GIVEN** the Publicações page has loaded with a list of posts
- **WHEN** the user types in the search/filter field (e.g. an author name, part of a title, or a date fragment such as a year or day)
- **THEN** the list updates **immediately** (in real time) to show only posts that match the query in at least one of: author name, title, or publication date
- **AND** when the user clears the search, the full list is shown again
