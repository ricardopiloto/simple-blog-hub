# author-area-dashboard Specification

## Purpose
TBD - created by archiving change add-author-area-list-scroll-and-filter. Update Purpose after archive.
## Requirements
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

### Requirement: Dashboard exibe seis indicadores incluindo Rascunho (SHALL)

O dashboard da área do autor (na rota /area-autor ou na secção "Visão geral do blog") SHALL exibir **seis** indicadores na seguinte ordem: (1) **Total de posts**, (2) **Publicados**, (3) **Planejados**, (4) **Rascunho**, (5) **Visualizações**, (6) **Autores**. O indicador **Rascunho** SHALL corresponder ao número de posts com `Published == false` (rascunhos) e SHALL ser fornecido pelo backend no payload de stats com o nome `draft_count` (snake_case em JSON). O frontend SHALL exibir um card ou valor legível com a etiqueta "Rascunho" na posição indicada (entre Planejados e Visualizações).

#### Scenario: Utilizador vê o indicador Rascunho no dashboard

- **GIVEN** o utilizador está autenticado e acede à área do autor (dashboard)
- **WHEN** a secção de visão geral do blog é exibida
- **THEN** vê seis indicadores na ordem: Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores
- **AND** o valor exibido em "Rascunho" corresponde ao número de posts não publicados (Published = false) retornado pelo endpoint de stats (`draft_count`)

#### Scenario: Payload do backend inclui draft_count

- **GIVEN** o frontend chama o endpoint de estatísticas do dashboard (ex.: GET /bff/dashboard/stats)
- **WHEN** a resposta é recebida
- **THEN** o payload inclui o campo `draft_count` (número)
- **AND** o valor representa a contagem de posts com Published igual a false

### Requirement: Card Rascunho tem borda fina amarela (SHALL)

O **card que exibe o indicador "Rascunho"** (draft_count) no dashboard da área do autor SHALL ter uma **borda fina em amarelo** para distinção visual em relação aos demais indicadores. A borda SHALL ser fina (ex.: 1px ou 2px) e a cor amarela (ex.: yellow-500 ou equivalente no sistema de design). Os outros cards do dashboard não SHALL ter essa borda amarela.

#### Scenario: Utilizador identifica visualmente o card Rascunho

- **GIVEN** o utilizador está na página do dashboard da área do autor (visão geral do blog)
- **WHEN** observa os seis cards (Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores)
- **THEN** o card "Rascunho" tem uma borda fina amarela
- **AND** os restantes cards não têm borda amarela

### Requirement: Cards do dashboard são clicáveis e aplicam filtro ou navegação (SHALL)

Os cards da secção "Visão geral do blog" na página **/area-autor** SHALL ser **clicáveis** (exceto o card "Visualizações", que permanece apenas informativo). O comportamento ao clicar SHALL ser:

- **Publicados** — definir o filtro por estado da secção "Publicações" para **apenas posts publicados** (`published === true`). A lista na secção Publicações SHALL mostrar somente posts que correspondem a este estado; o filtro de texto (autor, título, data) SHALL continuar a aplicar-se em conjunto.
- **Planejados** — definir o filtro por estado para **apenas posts com data de agendamento** (`scheduled_publish_at` preenchido). A lista SHALL mostrar somente esses posts, com o filtro de texto aplicado em conjunto.
- **Rascunho** — definir o filtro por estado para **apenas posts em rascunho** (`published === false`). A lista SHALL mostrar somente esses posts, com o filtro de texto aplicado em conjunto.
- **Autores** — navegar o utilizador para **/area-autor/contas** (rota Contas).
- **Visualizações** — **nenhuma ação** ao clicar; o card permanece informativo.
- **Total de posts** — opcional: ao clicar, pode limpar o filtro por estado (mostrar todos os posts) ou não ter ação; a implementação SHALL escolher uma das opções e manter consistência.

Os cards que executam ação SHALL ser apresentados como interativos (ex.: cursor pointer, hover). A filtragem por estado SHALL ser feita no cliente sobre a lista já carregada, com critérios alinhados às métricas exibidas no dashboard (publicado, agendado, rascunho).

#### Scenario: Clicar em Publicados filtra a lista por posts publicados

- **GIVEN** o utilizador está em /area-autor e a secção Publicações tem posts com vários estados (publicados, rascunho, planejados)
- **WHEN** o utilizador clica no card "Publicados"
- **THEN** a lista na secção Publicações mostra apenas posts com `published === true`
- **AND** o utilizador pode continuar a usar o campo de pesquisa para refinar por autor, título ou data

#### Scenario: Clicar em Rascunho filtra a lista por posts em rascunho

- **GIVEN** o utilizador está em /area-autor e a secção Publicações tem posts publicados e em rascunho
- **WHEN** o utilizador clica no card "Rascunho"
- **THEN** a lista mostra apenas posts com `published === false`
- **AND** o filtro de texto continua a aplicar-se sobre esse subconjunto

#### Scenario: Clicar em Planejados filtra a lista por posts agendados

- **GIVEN** o utilizador está em /area-autor e existem posts com `scheduled_publish_at` preenchido
- **WHEN** o utilizador clica no card "Planejados"
- **THEN** a lista mostra apenas posts que têm `scheduled_publish_at` definido
- **AND** o filtro de texto aplica-se em conjunto

#### Scenario: Clicar em Autores redireciona para Contas

- **GIVEN** o utilizador está em /area-autor
- **WHEN** o utilizador clica no card "Autores"
- **THEN** a aplicação navega para /area-autor/contas
- **AND** o utilizador vê a página de gestão de contas

#### Scenario: Clicar em Visualizações não altera filtro nem navega

- **GIVEN** o utilizador está em /area-autor com um filtro por estado ativo (ex.: "Rascunho")
- **WHEN** o utilizador clica no card "Visualizações"
- **THEN** o filtro por estado e a lista não são alterados
- **AND** não há navegação para outra rota

#### Scenario: Filtro por estado combinado com filtro de texto

- **GIVEN** o utilizador clicou no card "Publicados" e a lista mostra apenas posts publicados
- **WHEN** o utilizador escreve no campo de pesquisa (ex.: parte do título)
- **THEN** a lista mostra apenas os posts **publicados** que também correspondem ao texto
- **AND** ao limpar o texto, a lista volta a mostrar todos os posts publicados (mantendo o estado "Publicados" ativo)

### Requirement: Secção Publicações tem ordenação configurável e filtro por linha da história (SHALL)

A secção **"Publicações"** na página **/area-autor** SHALL aplicar **ordenação configurável** à lista de posts e SHALL oferecer um **filtro por linha da história** (story type).

**Ordenação**

- A lista SHALL ser ordenada por **defeito em ordem decrescente por data** (do mais novo para o mais antigo), usando um campo de data do post (ex.: `created_at`).
- O utilizador SHALL poder selecionar:
  - **Por data**: ascendente (mais antigo primeiro) ou descendente (mais novo primeiro).
  - **Por ordem da história (story_order)**: ascendente (menor valor primeiro) ou descendente (maior valor primeiro).
- A ordenação aplica-se à lista **já filtrada** (por estado, por story type e por texto). O controlo de ordenação SHALL estar no **lado oposto** à caixa de texto do filtro (ex.: filtro à esquerda, selector de ordenação à direita).

**Filtro por linha da história**

- Ao lado do filtro de texto (campo de pesquisa), SHALL existir um **toggle ou selector** com opções:
  - **Todos** — mostrar todos os posts (sem filtrar por `story_type`).
  - **Velho Mundo** — mostrar apenas posts com `story_type === 'velho_mundo'`.
  - **Idade das Trevas** — mostrar apenas posts com `story_type === 'idade_das_trevas'`.
- Este filtro aplica-se em conjunto com o filtro de texto e com o filtro por estado (ex.: cards clicáveis); a ordem de aplicação é: filtro por estado → filtro por story type → filtro de texto → ordenação.

**Layout**

- O campo de pesquisa (filtro de texto) e o selector de linha da história SHALL estar de um mesmo lado (ex.: esquerda); o selector de ordenação SHALL estar do **lado oposto** (ex.: direita). Em viewports pequenos os elementos podem empilhar, mantendo "filtro + story type" agrupados.

#### Scenario: Lista ordenada por defeito do mais novo ao mais antigo

- **GIVEN** o utilizador está em /area-autor e a secção Publicações carregou
- **WHEN** não alterou a ordenação
- **THEN** a lista está ordenada por data em ordem **decrescente** (post mais recente primeiro)
- **AND** o selector de ordenação reflete esta opção (ex.: "Mais recentes" ou "Data (desc.)")

#### Scenario: Utilizador escolhe ordenar por ordem da história ascendente

- **GIVEN** a secção Publicações está visível com vários posts
- **WHEN** o utilizador seleciona ordenar por "Ordem da história" (ou equivalente) em ordem ascendente
- **THEN** a lista é reordenada por `story_order` do menor para o maior
- **AND** a alteração é imediata (client-side)

#### Scenario: Utilizador filtra por linha da história "Velho Mundo"

- **GIVEN** a secção Publicações tem posts de ambas as linhas (velho_mundo e idade_das_trevas)
- **WHEN** o utilizador seleciona "Velho Mundo" no toggle/selector de linha da história
- **THEN** a lista mostra apenas posts com `story_type === 'velho_mundo'`
- **AND** o filtro de texto e a ordenação continuam a aplicar-se sobre esse subconjunto

#### Scenario: Layout — ordenação do lado oposto ao filtro de texto

- **GIVEN** o utilizador está na secção Publicações em /area-autor
- **WHEN** observa a barra de controlos acima da lista
- **THEN** o campo de pesquisa (filtro de texto) e o selector de linha da história estão de um lado (ex.: esquerda)
- **AND** o selector de ordenação está do lado oposto (ex.: direita)

#### Scenario: Filtro por story type e filtro de texto em conjunto

- **GIVEN** o utilizador selecionou "Idade das Trevas" e escreveu parte de um título no campo de pesquisa
- **WHEN** a lista é exibida
- **THEN** só aparecem posts com `story_type === 'idade_das_trevas'` que também correspondem ao texto
- **AND** a ordenação (ex.: data desc) aplica-se a esse resultado

