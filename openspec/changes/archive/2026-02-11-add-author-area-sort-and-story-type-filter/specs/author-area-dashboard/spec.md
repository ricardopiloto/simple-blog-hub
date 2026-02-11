# author-area-dashboard — delta for add-author-area-sort-and-story-type-filter

## ADDED Requirements

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
