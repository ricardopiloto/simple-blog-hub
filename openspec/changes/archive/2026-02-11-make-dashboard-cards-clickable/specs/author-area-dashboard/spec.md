# author-area-dashboard — delta for make-dashboard-cards-clickable

## ADDED Requirements

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
