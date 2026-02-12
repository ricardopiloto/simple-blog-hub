# author-area-dashboard Specification (delta: fix-dashboard-stats-404-production)

## Purpose
Spec delta for change fix-dashboard-stats-404-production. Base spec: openspec/specs/author-area-dashboard/spec.md

## MODIFIED Requirements

### Requirement: Endpoint de estatísticas do dashboard acessível com path completo ou sem prefixo /bff (SHALL)

O endpoint de estatísticas do dashboard (GET que devolve total de posts, publicados, planejados, rascunho, visualizações, autores) **DEVE** (SHALL) ser servido pelo BFF e **DEVE** ser acessível tanto pelo path **/bff/dashboard/stats** como pelo path **/dashboard/stats**, de forma a que funcione em produção quer o proxy reverso reencaminhe o path completo quer remova o prefixo /bff. A resposta (payload JSON e códigos 200/401) **DEVE** ser idêntica para ambos os paths. Requisitos de autorização (JWT) aplicam-se da mesma forma.

#### Scenario: Dashboard stats responde 200 com path /bff/dashboard/stats

- **GIVEN** o BFF está em execução e o utilizador tem um JWT válido
- **WHEN** o cliente faz GET /bff/dashboard/stats com o header Authorization
- **THEN** o BFF responde com HTTP 200 e o payload JSON de estatísticas (total_posts, published_count, scheduled_count, draft_count, total_views, authors_count)
- **AND** sem JWT válido o BFF responde 401

#### Scenario: Dashboard stats responde 200 com path /dashboard/stats (proxy com strip)

- **GIVEN** o BFF está em execução e o proxy reverso reencaminha pedidos para o BFF removendo o prefixo /bff (o BFF recebe GET /dashboard/stats)
- **WHEN** o cliente faz um pedido que chega ao BFF como GET /dashboard/stats com JWT válido
- **THEN** o BFF responde com HTTP 200 e o mesmo payload JSON de estatísticas
- **AND** sem JWT válido o BFF responde 401
