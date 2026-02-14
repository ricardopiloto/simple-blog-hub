# Changelog

Os releases são versionados por tag (ex.: `v1.9`, `v1.10`, `v2.0`). O resumo detalhado das changes OpenSpec aplicadas pode ser usado na mensagem do commit de release e está também na proposta da respetiva versão em `openspec/changes/`.

## [2.2]

- add-scene-weather-effect: **Efeito de clima (chuva/neve) na leitura**: ao abrir um artigo, o sistema analisa o texto em busca de palavras que indiquem chuva ou neve (incluindo sinónimos e conjugações verbais: chuva, choveu, chovendo, neva, nevou, nevava, etc., e equivalentes em inglês). Se detectar e o utilizador tiver os efeitos ativados, é exibido um efeito visual discreto (chuva ou neve) sobre a área de leitura. **Controlo no header**: botão (ao lado do tema claro/escuro) para ativar ou desativar os efeitos; preferência persistida em localStorage e aplicada a todas as páginas de artigo. Prioridade neve sobre chuva quando o texto contém ambos.
- ensure-version-footer-updated-on-release: Formalização no spec project-docs e no README: ao preparar uma **release versionada**, o campo **`version`** em **`frontend/package.json`** deve ser atualizado antes do build para que o rodapé exiba a versão correta; README secção 4 (Links para CHANGELOG) reforça esse passo.
- fix-date-filter-visible-to-all-visitors: **Filtro de data na página Artigos visível a todos**: o filtro por data (calendário, data única ou intervalo) na página **Artigos** (`/posts`) passou a ser **visível e utilizável por qualquer visitante**, independentemente de estar ou não autenticado. O spec posts-list exige que nenhuma condição de autenticação oculte o controlo; o DateRangePicker em `Posts.tsx` é sempre exibido; a listagem pública (BFF) já aceitava `fromDate`/`toDate` sem auth. Cenário no spec: visitante não autenticado em `/posts` vê o filtro ao lado da pesquisa e pode filtrar por data.
- Documentação e versão: CHANGELOG com secção [2.2]; versão no frontend (package.json) definida como 2.2.0; README secção 4 com tag v2.2.

## [2.1]

- fix-scheduled-publish-author-timezone: Correção do agendamento de publicação para respeitar a **timezone do autor**: quando o autor agenda para uma hora (ex.: 10:00), a publicação ocorre às 10:00 no fuso horário do utilizador. O frontend passou a enviar a data/hora em ISO 8601 **com offset do fuso** (ex.: `2025-02-14T10:00:00-03:00`); a API interpreta e armazena em UTC; o job em background mantém a comparação com `DateTime.UtcNow`. Elimina o desvio de horas (ex.: 3 horas) causado pela interpretação inconsistente de strings sem timezone entre browsers.
- add-date-filter-and-autocomplete-posts-author-area: Filtro por data (calendário, data única ou intervalo) e auto-complete no campo de pesquisa na **página Artigos** (`/posts`) e na **Área do autor** (secção Publicações em `/area-autor`). Por defeito não há filtro de data. Na página Artigos: parâmetros opcionais `fromDate` e `toDate` (yyyy-MM-dd) na API/BFF na listagem paginada; componente partilhado de date range picker; sugestões de pesquisa derivadas da primeira página de resultados (autores e títulos). Na Área do autor: filtro de data em memória (published_at/created_at); sugestões calculadas a partir da lista de posts carregada. Sem alterações de esquema na base de dados; não é necessário executar scripts SQL para a v2.1.
- add-cover-preview-on-edit-post: No formulário **Editar post** (e apenas neste), quando existir URL de imagem de capa (carregada do post ou definida pelo utilizador), o sistema exibe um **preview** visual dessa imagem na secção da capa (proporção e tamanho limitados); no formulário **Novo post** o preview não é exibido. URLs relativas (ex.: /images/posts/...) resolvidas para o origin; sem alterações de API.
- change-featured-post-label-to-novo: Na página inicial, a etiqueta do post em destaque (último criado entre publicados) passou de **"Destaque"** para **"Novo"**; critério de seleção do post mantido.
- fix-dashboard-stats-404-production: O BFF passou a responder ao endpoint de estatísticas do dashboard tanto em **/bff/dashboard/stats** como em **/dashboard/stats**, evitando 404 em produção quando o proxy reverso remove o prefixo /bff do path. Documentação de troubleshooting (imagem BFF atualizada, proxy) em guias de atualização quando aplicável.
- Documentação e versão: README, openspec/project.md, docs/README.md e guia de atualização **docs/local/atualizar-2-0-para-2-1.md** atualizados para a v2.1; versão no frontend (package.json) definida como 2.1.0.

## [2.0]

- adjust-dockerfiles-and-docs-after-hardening: Ajuste dos Dockerfiles (remover user não-root) e da documentação para corrigir o erro "readonly database" da API quando o volume data/ no host não tem permissões para o uid do contentor; contentores da API e do BFF passam a correr como **root**; documentação (DEPLOY, ATUALIZAR, PRODUCTION-CHECKLIST, SECURITY-HARDENING, SECURITY-REMEDIATION, EXPOR-DB-NO-HOST, guias local) atualizada para indicar que os contentores correm como root e que não é necessário chown para uid 1000; spec security-hardening atualizado para permitir exceção (MAY run as root quando volumes o exigirem) e documentar o trade-off.
- add-author-dashboard-inicial-v2: Dashboard como tela inicial da área do autor; seis indicadores (total de posts, publicados, planejados, rascunho, visualizações, autores); rota /area-autor para o dashboard; rota /area-autor/publicacoes para a lista de posts.
- add-dashboard-rascunho-metric: Indicador "Rascunho" (draft_count) no dashboard da área do autor.
- merge-dashboard-publications-single-page: Página única em /area-autor com "Visão geral do blog" (dashboard) no topo e secção "Publicações" (lista de posts) em baixo; /area-autor/publicacoes redireciona para /area-autor.
- style-dashboard-rascunho-card-yellow-border: Borda fina amarela no card Rascunho do dashboard (depois substituída por indicador dinâmico na indicate-dashboard-card-filter-with-yellow-border).
- make-dashboard-cards-clickable: Cards Total, Publicados, Planejados e Rascunho clicáveis (filtram a lista por estado); card Autores leva a /area-autor/contas; scroll suave até à secção Publicações ao clicar nos cards de filtro.
- add-author-area-sort-and-story-type-filter: Ordenação configurável na secção Publicações (por data ou ordem da história, asc/desc; default mais recentes); filtro por linha da história (Todos / Velho Mundo / Idade das Trevas); layout: pesquisa + linha da história de um lado, ordenação do outro.
- widen-author-area-search-input: Campo de pesquisa da secção Publicações com largura mínima para o placeholder "Pesquisar por autor, título ou data" ficar visível.
- indicate-dashboard-card-filter-with-yellow-border: Borda amarela fixa do card Rascunho removida; borda amarela indica o card de filtro ativo (Total, Publicados, Planejados ou Rascunho); ao alterar pesquisa, linha da história ou ordenação, o filtro por estado é desmarcado (nenhum card com borda).
- update-docs-and-changelog-for-v2: Atualização da documentação do projeto e CHANGELOG para a versão 2.0 (README, openspec/project.md, versão no frontend).

## [1.10]

- add-security-hardening-assessment: Avaliação de segurança do projeto (frontend, BFF, API, infra); documento SECURITY-HARDENING.md em docs/security/ com plano de melhorias em cinco fases; spec security-hardening com requisitos ADDED e cenários; sem alterações de código.
- add-security-remediation-proposal: Plano de correção de segurança; documento SECURITY-REMEDIATION.md em docs/security/; spec security-hardening; sem alterações de código.
- add-code-improvements-evaluation: Avaliação de melhorias de código (segurança, simplificação, reaproveitamento); documento CODE-IMPROVEMENTS.md em docs/improvements/ com propostas e prioridade; spec code-improvements com requisitos ADDED; sem alterações de código.
- add-changelog-1-10-docs-update: Atualização da documentação do projeto: reorganização em docs/ (changelog, deploy, database, security, improvements, local); CHANGELOG em docs/changelog/; README com referências a CHANGELOG, SECURITY-HARDENING e CODE-IMPROVEMENTS nos caminhos corretos, exemplos de tags v1.8–v1.10, estrutura de pastas com docs/ e openspec/ no local original; docs/README.md com tabela e nota OpenSpec; .gitignore para docs/local/; versão no rodapé (package.json); secção [1.10] inicial no changelog.
- harden-login-credentials-exposure: Redução da exposição de credenciais: documentação sem senha em texto claro; appsettings com placeholder; frontend sem string literal da senha; spec security-hardening.
- add-remaining-hardening-improvements-and-db-script-rule: Validação de slug com regex na API; documentação de logging e permissões da pasta data/; regra no README da API para alterações de esquema (script manual obrigatório); spec project-docs.
- apply-code-improvements: BFF: helper GetAuthorId(ClaimsPrincipal); API: base controller com X-Author-Id, Data Annotations e ModelState; frontend: requestPublic/requestWithAuth e refatoração do cliente BFF.
- apply-security-hardening: Sanitização HTML (backend + DOMPurify no frontend); CORS e security headers; validação de secrets em produção (Cors:AllowedOrigins, Jwt:Secret ≥ 32, API:InternalKey); magic bytes em uploads; política de senha 8 caracteres + maiúscula, minúscula e número; rate limiting e auditoria; Caddyfile.example; PRODUCTION-CHECKLIST.md e TOKEN-STORAGE.md em docs/security/. (Docker não-root foi revertido na change adjust-dockerfiles-and-docs-after-hardening; contentores correm como root por compatibilidade com volumes.)

## [1.9]

- fix-sitemap-xml-declaration-validation: Correção da declaração XML do sitemap (resposta GET /sitemap.xml sem BOM, primeira linha `<?xml version="1.0" encoding="UTF-8" ?>` com espaço antes de `?>`) para validadores externos (ex.: xml-sitemaps.com).

## [1.8]

- simplify-readme-docs-changelog-v1-8: README reorganizado em sete secções (explicação breve do projeto, stack de desenvolvimento, requisitos mínimos, links para CHANGELOG, funcionalidades existentes no blog, procedimentos de instalação e atualização com links para os guias, estrutura de pastas); documentação alinhada; nova versão no changelog.

## [1.7]

- add-post-story-type-velho-mundo-idade-das-trevas: Tipo de história obrigatório no post (Velho Mundo / Idade das Trevas); coluna StoryType na API; campo antes do Título no formulário Novo/Editar post; validação na API e no frontend.
- add-story-index-universe-toggle: Toggle no Índice da História para o leitor escolher o universo (Velho Mundo ou Idade das Trevas); por defeito Velho Mundo; toggle só visível quando existem posts dos dois tipos; paginação e filtro aplicam-se à lista filtrada por universo.
- post-edit-historia-field-toggle-ui: Campo "História" no formulário de post apresentado como toggle (dois lados) em vez de select.
- clarify-historia-required-in-post-edit: Label "História (obrigatório)" no formulário de post para indicar claramente que o campo é obrigatório.
- disable-auto-excerpt-when-editing-post: Campo Resumo não é atualizado automaticamente ao editar o conteúdo no formulário de Editar post (apenas no Novo post continua a sincronizar com os primeiros 32 caracteres).
- add-story-type-script-docs-changelog: Script SQL manual `add_story_type_to_posts.sql` para a coluna StoryType; documentação no README da API (migrações manuais e troubleshooting "no such column: p.StoryType"); CHANGELOG atualizado com a secção [1.7].

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
