# Tasks: Dashboard inicial na área do autor (v2.0)

- [x] **API:** Criar endpoint GET /api/dashboard/stats (protegido por X-Author-Id) que retorna { total_posts, published_count, scheduled_count, total_views, authors_count }; implementar agregação a partir de Posts e Authors.
- [x] **BFF:** Criar endpoint GET /bff/dashboard/stats (Authorize) que chama a API e devolve o mesmo payload ao frontend.
- [x] **Frontend (cliente):** Adicionar função para obter stats do dashboard (ex.: fetchDashboardStats()) em `frontend/src/api/client.ts`; definir tipo para o payload (ex.: DashboardStats).
- [x] **Frontend (dashboard):** Criar página/componente para o dashboard em `/area-autor`: exibir os cinco indicadores (total de posts, publicados, planejados, total de visualizações, autores) e link/navegação para "Publicações" (`/area-autor/publicacoes`).
- [x] **Frontend (rotas):** Definir rota `/area-autor` para o novo dashboard; criar rota `/area-autor/publicacoes` que renderiza a lista de posts (conteúdo atual de AreaAutor); manter `/area-autor/posts/novo` e `/area-autor/posts/:id/editar`; ajustar redirect de `/area-autor/posts` para `/area-autor`.
- [x] **Frontend (lista):** Garantir que a lista de posts (scroll, filtro, Novo post, editar/excluir) está em `/area-autor/publicacoes` (mover ou reutilizar o componente atual de AreaAutor nessa rota); atualizar links internos (ex.: "Voltar" para dashboard ou Publicações conforme contexto).
- [x] **Frontend (login):** Confirmar que após login o redirect continua para `/area-autor` (agora o dashboard).
- [x] **Header/navegação:** Manter "Área do autor" no header apontando para `/area-autor`; na página Publicações, incluir forma de voltar ao dashboard (breadcrumb ou link).
- [x] **Spec:** Atualizar author-area-dashboard com requisitos ADDED (dashboard como tela inicial, cinco métricas, link para Publicações) e MODIFIED (requisito de scroll/filtro aplica-se à página Publicações em /area-autor/publicacoes); cenários verificáveis.
- [x] Executar `openspec validate add-author-dashboard-inicial-v2 --strict` e corrigir até passar.
