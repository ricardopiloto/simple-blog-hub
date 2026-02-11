# author-area-dashboard — delta for style-dashboard-rascunho-card-yellow-border

## ADDED Requirements

### Requirement: Card Rascunho tem borda fina amarela (SHALL)

O **card que exibe o indicador "Rascunho"** (draft_count) no dashboard da área do autor SHALL ter uma **borda fina em amarelo** para distinção visual em relação aos demais indicadores. A borda SHALL ser fina (ex.: 1px ou 2px) e a cor amarela (ex.: yellow-500 ou equivalente no sistema de design). Os outros cards do dashboard não SHALL ter essa borda amarela.

#### Scenario: Utilizador identifica visualmente o card Rascunho

- **GIVEN** o utilizador está na página do dashboard da área do autor (visão geral do blog)
- **WHEN** observa os seis cards (Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores)
- **THEN** o card "Rascunho" tem uma borda fina amarela
- **AND** os restantes cards não têm borda amarela
