# Tasks: Borda amarela como indicador do filtro selecionado

- [x] **Frontend (cards):** Remover a borda amarela fixa do card Rascunho. Aplicar borda amarela fina condicionalmente aos quatro cards (Total, Publicados, Planejados, Rascunho) conforme `statusFilter`: apenas o card que corresponde ao valor atual de `statusFilter` exibe `border-2 border-yellow-500` (ou equivalente).
- [x] **Frontend (desmarcar):** Ao alterar o campo de pesquisa (filterQuery), o selector "Linha da história" (storyTypeFilter) ou o selector "Ordenar por" (sortBy/sortDir), chamar `setStatusFilter('all')` para desmarcar o card e mostrar todos os posts no que diz respeito ao filtro por estado. Implementar nos handlers (onChange do Input, onValueChange dos dois Selects).
- [x] **Spec:** Atualizar author-area-dashboard (delta): requisito MODIFIED — borda amarela no card que indica o filtro por estado ativo (não mais borda fixa só no Rascunho); desmarcar ao alterar filtros manuais; cenários verificáveis.
- [x] Executar `openspec validate indicate-dashboard-card-filter-with-yellow-border --strict` e corrigir até passar.
