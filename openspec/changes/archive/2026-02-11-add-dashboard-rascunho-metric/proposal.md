# Adicionar indicador "Rascunho" ao dashboard da área do autor

## Why

O dashboard da área do autor deve exibir **seis** indicadores, incluindo **Rascunho** (posts não publicados), para dar visibilidade ao número de rascunhos. A ordem desejada é: **Total de posts | Publicados | Planejados | Rascunho | Visualizações | Autores**.

## What Changes

1. **Métrica Rascunho**  
   **Rascunho** = número de posts em que `Published == false` (rascunhos). Incluir este valor no payload do endpoint de stats do dashboard.

2. **API**  
   No DTO e no endpoint `GET /api/dashboard/stats`: adicionar o campo **`draft_count`** (ou `rascunho_count`; em JSON snake_case: `draft_count`), calculado como contagem de posts com `Published == false`. Manter os campos existentes; ordem no DTO pode ser: total_posts, published_count, scheduled_count, **draft_count**, total_views, authors_count.

3. **BFF**  
   O BFF repassa o payload da API; não é obrigatório alterar código se a API passar a incluir o novo campo (o JSON é repassado). Garantir que a resposta inclui `draft_count`.

4. **Frontend**  
   - Tipo **DashboardStats**: adicionar **`draft_count: number`**.
   - Na UI do dashboard (seção "Visão geral do blog"): adicionar um **card "Rascunho"** exibindo `stats.draft_count`, na ordem: Total de posts, Publicados, Planejados, **Rascunho**, Visualizações, Autores. Ajustar o layout da grelha se necessário (ex.: 6 cards).

5. **Spec author-area-dashboard**  
   **MODIFIED:** O dashboard SHALL exibir **seis** indicadores na ordem: (1) Total de posts, (2) Publicados, (3) Planejados, (4) **Rascunho** (draft_count), (5) Visualizações, (6) Autores. Cenário verificável para a presença do indicador Rascunho.

## Goals

- Endpoint de stats devolve `draft_count` (rascunhos = posts com Published false).
- Dashboard na área do autor mostra seis cards na ordem: Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores.
- Spec atualizado; `openspec validate add-dashboard-rascunho-metric --strict` passa.

## Out of scope

- Alterar a definição de "Planejados" ou "Publicados"; apenas adicionar a métrica Rascunho.
- Alteração de esquema da base de dados (usa coluna Published já existente).

## Success criteria

- GET /api/dashboard/stats e GET /bff/dashboard/stats incluem `draft_count`.
- A página/secção do dashboard exibe o card "Rascunho" com o valor correto na posição indicada.
- Validação OpenSpec em modo strict passa.
