# Changelog

Os releases são versionados por tag (ex.: `v1.3`, `v1.4`, `v1.5`, `v1.6`). O resumo detalhado das changes OpenSpec aplicadas pode ser usado na mensagem do commit de release e está também na proposta da respetiva versão em `openspec/changes/`.

## [1.6]

- add-scheduled-publish-post: Publicação agendada de posts (calendário e hora no formulário Novo/Editar Post; campo ScheduledPublishAt na API; background service publica automaticamente à data/hora agendada).
- fix-scheduled-publish-at-missing-column: Script SQL manual add_scheduled_publish_at_to_posts.sql e documentação no README da API e em ATUALIZAR para o erro "no such column: p.ScheduledPublishAt".
- schedule-publish-toggle-show-calendar-when-on: Toggle "Agendar publicação" no formulário de post; calendário e hora só visíveis quando o toggle está ligado; desligado = publicação imediata.
- docker-bff-upload-volume-host-public-images: Volume no docker-compose (BFF) para ./frontend/public/images/posts no host; Caddy deve servir esse diretório em /images/posts/ (handle no Caddyfile) para as imagens de capa enviadas aparecerem no post.
- hide-newsletter-section-until-implemented: Secção "Fique por dentro" na página inicial oculta até a funcionalidade de newsletter estar implementada.

## [1.5]

- persist-story-order-when-saving-index: Requisito explícito de que "Salvar ordem" no Índice da História atualiza a coluna StoryOrder no banco para refletir a ordem da tela.
- fix-story-order-save-204-no-content: Correção do erro "Unexpected end of JSON input" ao salvar ordem no Índice; o cliente trata respostas 204 No Content sem parsear JSON.
- add-cover-size-guidance-and-framing: Texto de ajuda no formulário de post com proporção recomendada 16:9 (ex.: 1200×675 px) para não cortar a capa; object-center nas imagens de capa (página do post, cards, índice).
- post-page-cover-contain-for-non-16-9: Na página do artigo, capa exibida com object-contain e fundo neutro (bg-muted) para imagens fora de 16:9, mostrando a imagem inteira sem corte.

## [1.4]

- add-dynamic-sitemap-and-robots: Sitemap dinâmico (GET /sitemap.xml) e robots.txt (GET /robots.txt) servidos pelo BFF; Caddy encaminha /sitemap.xml e /robots.txt para o BFF (documentado em DEPLOY-DOCKER-CADDY).
- expose-db-on-host-for-docker: Base de dados no host via bind mount (pasta data/); documento EXPOR-DB-NO-HOST.md; documentação local em docs/local/ não commitada.
- add-version-1-4-and-update-docs: Documentação do projeto e procedimentos de atualização/instalação revisados e alinhados para v1.4.

## [1.3]

- add-contas-bio-70-char-limit: Limite de 70 caracteres na Bio (Contas); validação na API.
- add-github-link-to-footer-and-docs: Link do GitHub no rodapé; documentação atualizada com URL do repositório.
- add-post-cover-image-upload-local: Upload de imagem de capa do post para armazenamento local; endpoint BFF POST /bff/uploads/cover; opção no formulário de post.
- add-post-include-in-story-order: Opção por post "Faz parte da ordem da história"; coluna IncludeInStoryOrder; filtro no Índice e em anterior/próximo.
- add-posts-page-pagination-and-search: Paginação (6 por página) e filtro de pesquisa dinâmico na página Artigos.
- add-story-order-resilience-and-next-available: Próximo story order sobre posts na história; aviso quando ordem está muito à frente.
- fix-api-missing-column-include-in-story-order: Script SQL e Troubleshooting para erro "no such column: p.IncludeInStoryOrder".
- fix-frontend-upload-cover-nullish-coalescing-syntax: Corrigir sintaxe em client.ts para o frontend compilar sem erro.
- fix-prev-next-link-title-truncate-at-end: Truncar título nos links anterior/próximo pelo final (reticências no fim).
- fix-sqlite-connection-path-for-migrate-async: Caminho da base SQLite resolvido pelo Content Root para MigrateAsync() aplicar corretamente.
- revert-next-story-order-to-published-only: Próximo story order = último post publicado + 1 (apenas publicados).
- validate-migrations-run-automatically-on-deploy: Documentação de que migrações correm ao arranque e que é necessário reconstruir a imagem API quando há novas migrações.
- Documentação: guia de atualização com secções local vs Docker e lista de scripts de banco (ViewCount, IncludeInStoryOrder). Versionamento a partir de v1.3.
