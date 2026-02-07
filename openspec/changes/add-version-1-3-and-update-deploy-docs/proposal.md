# Proposal: Versão 1.3, atualização da documentação e guia de atualização (local vs Docker)

## Summary

(1) **Atualizar toda a documentação** do projeto (README, READMEs dos subprojetos, DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, openspec/project.md quando relevante) para refletir o estado atual do sistema. (2) **Introduzir versionamento** dos lançamentos: a partir desta proposta, os commits de release serão marcados com uma versão (ex.: v1.3); esta change corresponde à **versão 1.3**. (3) **Reorganizar o passo a passo de atualização** para incluir **secções claras** que separem **deploy/atualização local** (desenvolvimento: `dotnet run`, frontend com Vite, SQLite em `backend/api`) e **deploy/atualização Docker** (contentores API/BFF, Caddy no host). (4) Incluir no guia de atualização a **lista de todos os scripts de banco de dados** que podem ser aplicados manualmente (ViewCount, IncludeInStoryOrder), com instruções explícitas para **ambiente local** e para **Docker** (incl. como obter o volume e executar o script dentro do contentor ou no host), para que um operador saiba exatamente o que fazer em cada cenário.

## Goals

- **Documentação alinhada**: README principal e guias de deploy/atualização refletem as funcionalidades atuais (upload de capa, paginação em Artigos, Índice da História, Contas, migrações, etc.) e a convenção de versionamento.
- **Guia de atualização estruturado**: Um único documento (ou secção) de "Como atualizar" com subsecções **Atualização local** (dev) e **Atualização Docker** (produção), e em cada uma: passos gerais (pull, build, run) e, quando aplicável, **scripts de banco aplicados manualmente** (quando usar, onde estão os ficheiros, comandos para local e para Docker).
- **Versão 1.3**: Marcar este conjunto de alterações como **v1.3**; fornecer um **resumo para o commit** (changelog das changes em `openspec/changes`, excluindo `archive`) para o autor usar na mensagem do commit e na tag.

## Scope

- **In scope**: (1) Revisão e pequenas correções/atualizações em README.md (raiz), backend/api/README.md, backend/bff/README.md, frontend (se houver README relevante), DEPLOY-DOCKER-CADDY.md e ATUALIZAR-SERVIDOR-DOCKER-CADDY.md. (2) Em ATUALIZAR-SERVIDOR-DOCKER-CADDY.md (ou num ficheiro dedicado "ATUALIZAR.md" na raiz): criar secções **Atualização local** e **Atualização Docker**, com passos numerados e subsecção **Scripts de banco de dados (aplicação manual)** listando cada script (`add_view_count_to_posts.sql`, `add_include_in_story_order_to_posts.sql`) com comandos para **local** (ex.: `cd backend/api && sqlite3 blog.db < ...`) e para **Docker** (ex.: executar no volume ou copiar base para o host, executar script, devolver). (3) Documentar a convenção de versionamento (ex.: tags `v1.3`, `v1.4`; opcionalmente CHANGELOG.md com entradas por versão). (4) Incluir nesta proposta o **Resumo para commit v1.3** (ver secção abaixo) com a lista das changes em `openspec/changes` (excluindo `archive`) para o autor colar na mensagem do commit e usar como referência para a tag. (5) Spec delta: project-docs — requisito ADDED de que a documentação de atualização tenha secções distintas para local e Docker e liste os scripts de banco aplicáveis manualmente.
- **Out of scope**: Automatizar a geração do CHANGELOG a partir do OpenSpec; alterar o código da aplicação além do que já foi feito nas changes existentes.

## Resumo para commit v1.3 (changelog)

Utilizar o texto abaixo (ou uma variante) na mensagem do commit que marca a **versão 1.3**, e criar a tag `v1.3` (ex.: `git tag v1.3`). As changes listadas são apenas as que estão em `openspec/changes` (não inclui `openspec/changes/archive`).

```
Release v1.3

- add-contas-bio-70-char-limit: Limite de 70 caracteres na Bio (Contas); validação na API.
- add-github-link-to-footer-and-docs: Link do GitHub no rodapé; documentação atualizada com URL do repositório.
- add-post-cover-image-upload-local: Upload de imagem de capa do post para armazenamento local (frontend/public/images/posts); endpoint BFF POST /bff/uploads/cover; opção no formulário de post.
- add-post-include-in-story-order: Opção por post "Faz parte da ordem da história"; coluna IncludeInStoryOrder; filtro no Índice e em anterior/próximo.
- add-posts-page-pagination-and-search: Paginação (6 por página) e filtro de pesquisa dinâmico na página Artigos.
- add-story-order-resilience-and-next-available: Próximo story order sobre posts na história (publicados e rascunho); aviso quando ordem está muito à frente.
- fix-api-missing-column-include-in-story-order: Script SQL e Troubleshooting para erro "no such column: p.IncludeInStoryOrder".
- fix-frontend-upload-cover-nullish-coalescing-syntax: Corrigir sintaxe em client.ts (?? com ||) para o frontend compilar sem erro.
- fix-prev-next-link-title-truncate-at-end: Truncar título nos links anterior/próximo pelo final (reticências no fim).
- fix-sqlite-connection-path-for-migrate-async: Caminho da base SQLite resolvido pelo Content Root para MigrateAsync() aplicar corretamente.
- revert-next-story-order-to-published-only: Próximo story order = último post publicado + 1 (apenas publicados).
- validate-migrations-run-automatically-on-deploy: Documentação de que migrações correm ao arranque e que é necessário reconstruir a imagem API quando há novas migrações.

Documentação: guia de atualização com secções local vs Docker e lista de scripts de banco (ViewCount, IncludeInStoryOrder). Versionamento a partir de v1.3.
```

## Affected code and docs

- **README.md** (raiz): Pequenas atualizações se necessário; referência à versão ou ao repositório já pode existir.
- **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Reestruturar com secções **Atualização local** e **Atualização Docker**; adicionar subsecção **Scripts de banco de dados (aplicação manual)** com tabela ou lista dos scripts (`add_view_count_to_posts.sql`, `add_include_in_story_order_to_posts.sql`), comandos para local e para Docker (incl. uso de volume e exemplo de `docker run` com sqlite3).
- **backend/api/README.md**: Manter ou ajustar a secção de migrações manuais e Troubleshooting para estar alinhada com o guia de atualização (referência cruzada).
- **DEPLOY-DOCKER-CADDY.md**: Garantir que a secção de migrações e a menção a scripts manuais estão consistentes; opcionalmente referir a versão ou o guia de atualização.
- **CHANGELOG.md** (opcional, novo ficheiro): Entrada para v1.3 com o resumo acima; ou a convenção de que a mensagem do commit e a tag constituem o registo da versão.
- **openspec/changes/add-version-1-3-and-update-deploy-docs/specs/project-docs/spec.md**: ADDED — documentação de atualização SHALL ter secções claras para **atualização local** e **atualização Docker** e SHALL listar os scripts de banco aplicáveis manualmente com instruções para cada ambiente.

## Dependencies and risks

- **Nenhum**: Apenas documentação e convenção de versionamento. As changes de código já estão aplicadas.

## Success criteria

- Existe um guia de atualização (em ATUALIZAR-SERVIDOR-DOCKER-CADDY.md ou ficheiro dedicado) com secções **Atualização local** e **Atualização Docker** e com a lista de scripts de banco (ViewCount, IncludeInStoryOrder) e comandos para aplicar em cada cenário.
- O resumo para commit v1.3 (acima) está disponível para o autor usar na mensagem do commit e na tag.
- Documentação geral do projeto revisada e alinhada com o estado atual.
- Spec delta e `openspec validate add-version-1-3-and-update-deploy-docs --strict` passam.
