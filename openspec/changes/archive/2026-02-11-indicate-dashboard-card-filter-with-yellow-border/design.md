# Design: Borda amarela como indicador de filtro selecionado

## Decisão: quando desmarcar

A "desmarcagem" (reset de `statusFilter` para `'all'`) ocorre quando o utilizador **altera** qualquer um destes controlos da secção Publicações:

- **filterQuery** — onChange do input de pesquisa.
- **storyTypeFilter** — onValueChange do Select "Linha da história".
- **sortBy / sortDir** — onValueChange do Select "Ordenar por".

Implementação: em cada handler (onChange do Input, onValueChange dos Selects), além de atualizar o estado próprio, chamar `setStatusFilter('all')`. Alternativa: um `useEffect` que observa `filterQuery`, `storyTypeFilter`, `sortBy`, `sortDir` e chama `setStatusFilter('all')` quando algum muda — cuidado para não criar loop (só resetar quando estes valores mudam por interação do utilizador, não no mount). A abordagem mais simples e previsível é **incluir `setStatusFilter('all')` nos handlers** dos três controlos (input, story type select, sort select).

## Estilo dos cards

- Base comum para os quatro cards (Total, Publicados, Planejados, Rascunho): `rounded-lg border bg-card p-4 ...` (sem borda amarela).
- Quando o card é o "selecionado" (statusFilter corresponde a esse card), adicionar `border-2 border-yellow-500` (ou a mesma classe usada na change anterior). Exemplo: `className={cn("rounded-lg border bg-card p-4 ...", statusFilter === 'draft' && "border-2 border-yellow-500")}` para o Rascunho, e análogo para os outros três.

## Relação com change anterior

A change **style-dashboard-rascunho-card-yellow-border** introduziu borda amarela **sempre** no card Rascunho. Esta change **substitui** esse comportamento: a borda amarela deixa de ser fixa no Rascunho e passa a indicar dinamicamente o filtro selecionado (e a desmarcar ao usar os filtros manuais). O spec delta pode referir que o requisito de "borda amarela no card Rascunho" é reformulado para "borda amarela no card cujo filtro está ativo".
