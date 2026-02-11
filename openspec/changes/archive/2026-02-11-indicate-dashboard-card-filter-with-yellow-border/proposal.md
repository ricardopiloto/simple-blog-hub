# Borda amarela como indicador do filtro selecionado (cards do dashboard)

## Why

O card **Rascunho** tem hoje uma **borda amarela fixa** (change style-dashboard-rascunho-card-yellow-border). O utilizador pede remover essa borda fixa e usar a **borda amarela fina como indicador de qual filtro está selecionado**: ao clicar em Total de posts, Publicados, Planejados ou Rascunho, o card correspondente fica com borda amarela; quando o utilizador altera algum dos filtros manuais da secção Publicações (pesquisa, linha da história, ordenação), a seleção do card é desmarcada (nenhum card com borda amarela e filtro por estado volta a "todos"). Assim a borda amarela passa a indicar **estado ativo** do filtro por estado, não um estilo permanente do card Rascunho.

## What Changes

1. **Remover borda amarela fixa do card Rascunho**
   - O card "Rascunho" deixa de ter borda amarela **permanente**. Passa a usar o mesmo estilo base dos outros cards (ex.: `rounded-lg border bg-card p-4`), e só exibe borda amarela quando o filtro por estado está em "rascunho" (ou seja, quando o utilizador clicou nesse card e ainda não alterou os filtros manuais).

2. **Borda amarela como indicador de seleção**
   - Os quatro cards **Total de posts**, **Publicados**, **Planejados** e **Rascunho** passam a exibir **borda fina amarela** apenas quando o **filtro por estado** atual corresponde a esse card:
     - **Total de posts** → borda amarela quando `statusFilter === 'all'`.
     - **Publicados** → borda amarela quando `statusFilter === 'published'`.
     - **Planejados** → borda amarela quando `statusFilter === 'scheduled'`.
     - **Rascunho** → borda amarela quando `statusFilter === 'draft'`.
   - Apenas **um** card (ou nenhum) deve ter borda amarela em cada momento. Estilo sugerido: mesma borda fina amarela já usada (ex.: `border-2 border-yellow-500`), aplicada condicionalmente pela classe do card.

3. **Desmarcar ao alterar filtros manuais**
   - Quando o utilizador **alterar qualquer um** dos controlos da secção Publicações (barra de filtros/ordenação):
     - campo de **pesquisa** (input de texto),
     - selector **Linha da história** (Todos / Velho Mundo / Idade das Trevas),
     - selector **Ordenar por**,
   - o sistema SHALL **redefinir o filtro por estado** para "todos" (`statusFilter = 'all'`) e, em consequência, **remover a borda amarela** de todos os cards (nenhum card fica "marcado"). Assim, a borda amarela reflete apenas a seleção feita por **clique no card**; o uso dos filtros manuais abaixo indica que o utilizador está a refinar de outra forma e a "seleção por card" é limpa.

4. **Comportamento resumido**
   - Clicar num card (Total, Publicados, Planejados, Rascunho) → define `statusFilter` e esse card fica com borda amarela; a lista é filtrada conforme já implementado.
   - Alterar pesquisa, linha da história ou ordenação → `statusFilter` volta a `'all'`, nenhum card tem borda amarela, a lista mostra todos os posts (respeitando apenas o novo filtro/ordenação).

## Goals

- Remover a borda amarela fixa do card Rascunho.
- Borda amarela fina apenas no card que corresponde ao `statusFilter` ativo (Total / Publicados / Planejados / Rascunho).
- Ao alterar pesquisa, linha da história ou ordenação, desmarcar (statusFilter = all e sem borda em nenhum card).

## Non-Goals

- Não alterar o comportamento do card Visualizações nem do card Autores (link para Contas).
- Não alterar backend nem endpoints.
- Não adicionar um controlo explícito "Filtro por estado" na barra (a seleção continua a ser apenas por clique nos cards; a desmarcagem é implícita ao usar os outros filtros).

## Success Criteria

- Visualmente: o card Rascunho não tem borda amarela por defeito; apenas o card cujo filtro está ativo tem borda amarela.
- Ao clicar em Publicados, só o card Publicados tem borda amarela; ao alterar o texto da pesquisa (ou linha da história ou ordenação), a borda amarela desaparece de todos os cards e a lista deixa de estar filtrada por estado.
- `openspec validate indicate-dashboard-card-filter-with-yellow-border --strict` passa.
