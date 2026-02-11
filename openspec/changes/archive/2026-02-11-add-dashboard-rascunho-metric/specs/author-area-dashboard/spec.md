# author-area-dashboard — delta for add-dashboard-rascunho-metric

## ADDED Requirements

### Requirement: Dashboard exibe seis indicadores incluindo Rascunho (SHALL)

O dashboard da área do autor (na rota /area-autor ou na secção "Visão geral do blog") SHALL exibir **seis** indicadores na seguinte ordem: (1) **Total de posts**, (2) **Publicados**, (3) **Planejados**, (4) **Rascunho**, (5) **Visualizações**, (6) **Autores**. O indicador **Rascunho** SHALL corresponder ao número de posts com `Published == false` (rascunhos) e SHALL ser fornecido pelo backend no payload de stats com o nome `draft_count` (snake_case em JSON). O frontend SHALL exibir um card ou valor legível com a etiqueta "Rascunho" na posição indicada (entre Planejados e Visualizações).

#### Scenario: Utilizador vê o indicador Rascunho no dashboard

- **GIVEN** o utilizador está autenticado e acede à área do autor (dashboard)
- **WHEN** a secção de visão geral do blog é exibida
- **THEN** vê seis indicadores na ordem: Total de posts, Publicados, Planejados, Rascunho, Visualizações, Autores
- **AND** o valor exibido em "Rascunho" corresponde ao número de posts não publicados (Published = false) retornado pelo endpoint de stats (`draft_count`)

#### Scenario: Payload do backend inclui draft_count

- **GIVEN** o frontend chama o endpoint de estatísticas do dashboard (ex.: GET /bff/dashboard/stats)
- **WHEN** a resposta é recebida
- **THEN** o payload inclui o campo `draft_count` (número)
- **AND** o valor representa a contagem de posts com Published igual a false
