# Tasks: add-story-type-script-docs-changelog

## 1. Script SQL para coluna StoryType

- [x] 1.1 Criar o ficheiro `backend/api/Migrations/Scripts/add_story_type_to_posts.sql` com o conteúdo: ALTER TABLE Posts ADD COLUMN StoryType TEXT NOT NULL DEFAULT 'velho_mundo'; e comentários no cabeçalho indicando que é equivalente à migração AddStoryTypeToPost, executar uma vez, e que se a coluna já existir o SQLite devolverá erro (ignorar). Incluir exemplo de comando (ex.: sqlite3 blog.db < Migrations/Scripts/add_story_type_to_posts.sql).

## 2. Documentação no README da API

- [x] 2.1 Em `backend/api/README.md`, na secção "Migrações manuais (upgrade)", adicionar um parágrafo que descreve o script `add_story_type_to_posts.sql` para a coluna StoryType (tipo de história: Velho Mundo / Idade das Trevas), no mesmo estilo dos parágrafos para IncludeInStoryOrder e ScheduledPublishAt.
- [x] 2.2 Na secção "Troubleshooting", adicionar uma entrada para o erro "no such column: p.StoryType" (ou "no such column: StoryType") com passos de resolução: (1) Recomendado: reconstruir e reiniciar a API para que MigrateAsync() aplique a migração; (2) Migração manual: executar o script add_story_type_to_posts.sql uma vez e reiniciar a API. Formato alinhado às entradas existentes (ViewCount, IncludeInStoryOrder, ScheduledPublishAt).

## 3. Atualização do CHANGELOG

- [x] 3.1 Em `CHANGELOG.md` na raiz do repositório, adicionar uma nova secção **[1.7]** (ou o número de versão acordado para esta release) com a lista das changes OpenSpec aplicadas desde a 1.6: add-post-story-type-velho-mundo-idade-das-trevas, add-story-index-universe-toggle, post-edit-historia-field-toggle-ui, clarify-historia-required-in-post-edit, disable-auto-excerpt-when-editing-post, add-story-type-script-docs-changelog (com descrição breve de cada uma, conforme o estilo das secções [1.5] e [1.6]).

## 4. Guia de atualização (opcional)

- [x] 4.1 Criar ou atualizar um guia em `docs/local/` (ex.: atualizar-1-6-para-1-7.md) que descreva os passos para atualizar da versão anterior para esta (reconstruir API por causa da migração StoryType; referência ao script SQL opcional; resumo das alterações). Se o projeto não versionar docs/local, o guia pode ser apenas criado e referenciado no CHANGELOG ou no README.

## 5. Spec delta

- [x] 5.1 Em `openspec/changes/add-story-type-script-docs-changelog/specs/project-docs/spec.md`, ADDED requirement: o repositório deve incluir um script SQL manual em `backend/api/Migrations/Scripts/add_story_type_to_posts.sql` para adicionar a coluna StoryType à tabela Posts (upgrades sem migração EF); o README da API deve documentar o script e incluir troubleshooting para o erro "no such column: p.StoryType"; o CHANGELOG deve ter uma secção para a versão que inclui estas alterações (ex.: [1.7]) com a lista das changes aplicadas. Incluir cenário: operador com base antiga executa o script ou reconstrói a API e consulta o README em caso de erro; leitor consulta o CHANGELOG e vê a nova versão e as alterações listadas.

## 6. Validação

- [x] 6.1 Executar `openspec validate add-story-type-script-docs-changelog --strict` e corrigir falhas.
