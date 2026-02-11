# author-area-dashboard — delta for widen-author-area-search-input

## MODIFIED Requirements

### Requirement: Campo de pesquisa com placeholder visível (usabilidade)

O **campo de pesquisa** (filtro por autor, título e data) da secção "Publicações" na página /area-autor SHALL ter **largura mínima** suficiente para que o texto do placeholder ("Pesquisar por autor, título ou data") seja exibido de forma visível e legível, sem truncagem em viewports típicos (ex.: largura mínima equivalente a ~20rem ou ~320px). Isto aplica-se ao input com identificador `author-area-search` no componente da área do autor. O objectivo é garantir que o utilizador percebe a função do campo antes de interagir.

#### Scenario: Placeholder do campo de pesquisa visível

- **GIVEN** o utilizador está na página /area-autor e a secção Publicações está visível
- **WHEN** o campo de pesquisa está vazio (estado inicial ou após limpar)
- **THEN** o placeholder "Pesquisar por autor, título ou data" é exibido por completo de forma legível
- **AND** o campo não está truncado de forma a esconder parte substancial do placeholder em viewports de desktop ou tablet
