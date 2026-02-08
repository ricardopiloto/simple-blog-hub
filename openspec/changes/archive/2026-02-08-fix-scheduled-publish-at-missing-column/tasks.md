# Tasks: fix-scheduled-publish-at-missing-column

## 1. Script SQL

- [x] 1.1 Criar `backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql` que adiciona a coluna `ScheduledPublishAt` (TEXT, nullable) à tabela `Posts`. Equivalente à migração EF `AddScheduledPublishAtToPost`. Comentário no ficheiro: executar uma vez; se a coluna já existir, o SQLite pode devolver erro (ignorar).

## 2. README da API

- [x] 2.1 Em `backend/api/README.md`, na secção **Migrações manuais (upgrade)**, adicionar parágrafo para a coluna **ScheduledPublishAt** (agendamento de publicação), referindo o script `add_scheduled_publish_at_to_posts.sql` e o mesmo padrão (executar uma vez; ignorar erro se a coluna já existir).
- [x] 2.2 Em `backend/api/README.md`, na secção **Troubleshooting**, adicionar entrada para o erro **"no such column: p.ScheduledPublishAt"**: (1) Recomendado: reconstruir e reiniciar a API para que `MigrateAsync()` aplique a migração. (2) Alternativa: executar o script `Migrations/Scripts/add_scheduled_publish_at_to_posts.sql` contra o `blog.db`, depois reiniciar a API. Indicar que se a coluna já existir o SQLite pode devolver erro (ignorar).

## 3. Guias de atualização e expor DB

- [x] 3.1 Em **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**, na tabela "Scripts de banco de dados" e nos exemplos de comando (Local e Docker), incluir `add_scheduled_publish_at_to_posts.sql` (coluna ScheduledPublishAt; quando usar: erro "no such column: p.ScheduledPublishAt").
- [x] 3.2 Em **EXPOR-DB-NO-HOST.md**, na lista de exemplos de scripts manuais, adicionar `add_scheduled_publish_at_to_posts.sql`.

## 4. Spec delta

- [x] 4.1 Em `openspec/changes/fix-scheduled-publish-at-missing-column/specs/project-docs/spec.md`, ADDED requirement: o repositório deve fornecer um script SQL manual opcional que adiciona a coluna ScheduledPublishAt à tabela Posts (para upgrades onde a migração EF não foi aplicada); o README da API deve descrever o erro "no such column: p.ScheduledPublishAt" e como resolver (reconstruir API ou executar o script). Incluir pelo menos um cenário.

## 5. Validação

- [x] 5.1 Executar `openspec validate fix-scheduled-publish-at-missing-column --strict` e corrigir falhas.
