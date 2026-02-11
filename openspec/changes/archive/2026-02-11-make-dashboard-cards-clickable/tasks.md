# Tasks: Tornar os cards do dashboard clicáveis

- [x] **Frontend (estado):** Na página `/area-autor` (AreaAutorDashboard), adicionar estado para "filtro por estado" da lista (ex.: `statusFilter`: todos | publicados | planejados | rascunho). Inicializar como "todos".
- [x] **Frontend (lista):** Aplicar o filtro por estado na lista de posts da secção Publicações em conjunto com o filtro de texto existente: primeiro filtrar por estado (quando não for "todos"), depois por autor/título/data. Critérios: publicados = `published === true`; planejados = `scheduled_publish_at` presente; rascunho = `published === false`.
- [x] **Frontend (cards):** Tornar os cards do dashboard clicáveis: Publicados, Planejados e Rascunho como botões que definem `statusFilter` (e opcionalmente fazem scroll até à secção Publicações); Autores como `Link` para `/area-autor/contas`; Visualizações sem ação; Total de posts opcional (ex.: botão que limpa `statusFilter` para "todos"). Usar semântica adequada (button/Link) e acessibilidade (aria-label ou texto visível).
- [x] **Frontend (UX):** Garantir que os cards clicáveis têm cursor pointer e estilo de hover; o card Visualizações pode manter o mesmo estilo mas sem ação.
- [x] **Spec:** Adicionar requisito em author-area-dashboard (delta): cards do dashboard SHALL ser clicáveis com o comportamento descrito (filtrar lista por estado ou navegar para Contas); cenários verificáveis.
- [x] Executar `openspec validate make-dashboard-cards-clickable --strict` e corrigir até passar.
