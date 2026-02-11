# author-area-dashboard — delta for indicate-dashboard-card-filter-with-yellow-border

## MODIFIED Requirements

### Requirement: Borda amarela indica o card de filtro selecionado (SHALL)

Os cards **Total de posts**, **Publicados**, **Planejados** e **Rascunho** do dashboard na página /area-autor SHALL usar a **borda fina amarela** como indicador do **filtro por estado** atualmente selecionado: apenas o card que corresponde ao valor atual de `statusFilter` (all → Total, published → Publicados, scheduled → Planejados, draft → Rascunho) SHALL exibir borda amarela fina. Nenhum outro card desses quatro SHALL ter borda amarela nesse momento. O card **Rascunho** SHALL **não** ter borda amarela permanente; só a exibe quando `statusFilter === 'draft'`. Quando nenhum filtro por estado está ativo (`statusFilter === 'all'` e a seleção não foi alterada pelos filtros manuais), apenas o card **Total de posts** pode exibir a borda amarela (opcional) ou nenhum card; a proposta recomenda que, quando `statusFilter === 'all'`, o card Total de posts tenha a borda amarela para indicar "mostrar todos".

Quando o utilizador **alterar** qualquer um dos controlos da secção Publicações — campo de pesquisa (filtro de texto), selector "Linha da história" ou selector "Ordenar por" — o sistema SHALL **redefinir** o filtro por estado para "todos" (`statusFilter = 'all'`) e, em consequência, **remover** a borda amarela de todos os cards exceto, se desejado, do card Total de posts (ou de nenhum, conforme implementação). Assim a borda amarela reflete apenas a seleção feita por clique no card; a utilização dos filtros manuais desmarca a seleção do card.

#### Scenario: Borda amarela no card correspondente ao filtro ativo

- **GIVEN** o utilizador está em /area-autor
- **WHEN** clica no card "Publicados"
- **THEN** o card "Publicados" exibe borda amarela fina
- **AND** os cards Total, Planejados e Rascunho não exibem borda amarela
- **AND** a lista na secção Publicações mostra apenas posts publicados

#### Scenario: Desmarcar ao alterar filtro manual

- **GIVEN** o utilizador clicou no card "Rascunho" e esse card tem borda amarela
- **WHEN** o utilizador altera o texto no campo de pesquisa (ou altera "Linha da história" ou "Ordenar por")
- **THEN** o filtro por estado é redefinido para "todos" (statusFilter = 'all')
- **AND** nenhum card (ou apenas o card Total, conforme implementação) exibe borda amarela
- **AND** a lista deixa de estar filtrada apenas por rascunhos e passa a respeitar apenas o novo filtro/ordenação

#### Scenario: Rascunho sem borda fixa

- **GIVEN** o utilizador está em /area-autor e não clicou em nenhum card de filtro (ou alterou depois um filtro manual)
- **WHEN** observa o card "Rascunho"
- **THEN** o card Rascunho **não** tem borda amarela (estilo igual aos outros cards quando não selecionado)
- **AND** a borda amarela só aparece no Rascunho quando o utilizador clica nesse card e não altera os filtros manuais

---

## REMOVED Requirements

### (Referência) Card Rascunho com borda amarela fixa

**Removed / reformulado.** O requisito anterior (style-dashboard-rascunho-card-yellow-border) de que o card Rascunho tenha sempre borda amarela é substituído por: a borda amarela indica dinamicamente o **filtro por estado** selecionado (um dos quatro cards: Total, Publicados, Planejados, Rascunho) e é removida quando o utilizador altera os filtros manuais.
