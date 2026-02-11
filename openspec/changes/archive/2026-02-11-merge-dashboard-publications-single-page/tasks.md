# Tasks: Unir dashboard e publicações numa única página

- [x] **Frontend:** Unir numa única página em `/area-autor` a secção "Visão geral do blog" (dashboard com os cinco indicadores) no topo e a secção "Publicações" (lista de posts com filtro, scroll, Novo post, editar/excluir) em baixo; reutilizar a lógica e UI já existentes (dashboard + lista).
- [x] **Frontend (rotas):** Fazer com que `/area-autor` renderize essa página única; remover a rota `/area-autor/publicacoes` ou substituí-la por redirect para `/area-autor`; atualizar App.tsx e quaisquer links que apontem para `/area-autor/publicacoes`.
- [x] **Frontend (limpeza):** Remover ou simplificar o componente de página separada da lista (AreaAutor) se deixar de ser usado como rota própria; garantir que "Voltar à área do autor" em PostEdit/Contas continua a apontar para `/area-autor`.
- [x] **Spec:** Atualizar author-area-dashboard (delta): requisito MODIFIED — dashboard e lista na mesma página (secção Visão geral + secção Publicações); REMOVED ou reformulado o requisito que exige página Publicações separada e link para ela; scroll/filtro aplicam-se à secção Publicações.
- [x] Executar `openspec validate merge-dashboard-publications-single-page --strict` e corrigir até passar.
