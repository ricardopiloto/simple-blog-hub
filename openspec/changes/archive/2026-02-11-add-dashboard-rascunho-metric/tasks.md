# Tasks: Adicionar indicador Rascunho ao dashboard

- [x] **API:** Adicionar propriedade `DraftCount` ao `DashboardStatsDto` (JSON: `draft_count`); no `DashboardController`, calcular e devolver a contagem de posts com `Published == false`.
- [x] **Frontend (tipos e cliente):** Adicionar `draft_count: number` ao tipo `DashboardStats` em `frontend/src/api/types.ts` (o cliente já usa o tipo; não é necessário alterar a chamada se o backend passar a incluir o campo).
- [x] **Frontend (UI):** No componente que exibe os indicadores do dashboard (ex.: AreaAutorDashboard ou a secção "Visão geral" da página única), adicionar o card **Rascunho** exibindo `stats.draft_count`, na ordem: Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores; ajustar a grelha para 6 cards.
- [x] **Spec:** Atualizar author-area-dashboard (delta): requisito MODIFIED — o dashboard SHALL exibir seis indicadores incluindo Rascunho (draft_count), na ordem indicada; cenário verificável.
- [x] Executar `openspec validate add-dashboard-rascunho-metric --strict` e corrigir até passar.
