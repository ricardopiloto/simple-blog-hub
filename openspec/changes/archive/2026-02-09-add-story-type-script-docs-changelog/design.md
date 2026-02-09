# Design: Script, documentação e CHANGELOG para StoryType

## Script SQL

- **Ficheiro**: `backend/api/Migrations/Scripts/add_story_type_to_posts.sql`
- **Conteúdo**: Em SQLite, para adicionar uma coluna NOT NULL com default, usar:
  `ALTER TABLE Posts ADD COLUMN StoryType TEXT NOT NULL DEFAULT 'velho_mundo';`
- **Comentários**: Incluir cabeçalho indicando que é equivalente à migração EF AddStoryTypeToPost; executar uma vez; se a coluna já existir, SQLite devolverá erro (ignorar). Exemplo de comando: `sqlite3 blog.db < Migrations/Scripts/add_story_type_to_posts.sql`

## Documentação no README da API

- **Secção "Migrações manuais (upgrade)"**: Adicionar parágrafo após o de ScheduledPublishAt: "Para a coluna **StoryType** (tipo de história do post: Velho Mundo / Idade das Trevas), use o script `Migrations/Scripts/add_story_type_to_posts.sql` da mesma forma (executar uma vez; se a coluna já existir, ignorar o erro)."
- **Secção "Troubleshooting"**: Adicionar entrada "Se aparecer 'no such column: p.StoryType' (ou 'no such column: StoryType'):" com (1) Recomendado: reconstruir e reiniciar a API para que MigrateAsync() aplique a migração; (2) Migração manual: executar o script add_story_type_to_posts.sql uma vez e reiniciar a API. Alinhar o texto ao estilo das entradas existentes (ViewCount, IncludeInStoryOrder, ScheduledPublishAt).

## CHANGELOG

- **Nova secção**: [1.7] (ou a versão que o projeto adoptar para esta release).
- **Itens a listar** (resumo das changes aplicadas desde 1.6):
  - add-post-story-type-velho-mundo-idade-das-trevas: Tipo de história obrigatório no post (Velho Mundo / Idade das Trevas); coluna StoryType na API; toggle no formulário Novo/Editar post.
  - add-story-index-universe-toggle: Toggle no Índice da História para filtrar por universo (Velho Mundo / Idade das Trevas); por defeito Velho Mundo; toggle só visível quando existem posts dos dois tipos.
  - post-edit-historia-field-toggle-ui: Campo História no formulário de post apresentado como toggle (dois lados) em vez de select.
  - clarify-historia-required-in-post-edit: Label "História (obrigatório)" no formulário de post.
  - disable-auto-excerpt-when-editing-post: Campo Resumo não é atualizado automaticamente ao editar o conteúdo no formulário de Editar post.
  - add-story-type-script-docs-changelog: Script SQL manual add_story_type_to_posts.sql; documentação no README da API e atualização do CHANGELOG.

## Guia de atualização (docs/local)

- Se o projeto mantiver guias em `docs/local/` (ex.: atualizar-1-4-para-1-6.md), criar ou actualizar um documento (ex.: atualizar-1-6-para-1-7.md) que inclua: reconstruir a imagem da API (nova migração StoryType); opcionalmente referir o script SQL para quem preferir aplicar manualmente; resumo das alterações da versão (tipo de história, toggle no índice, etc.). O documento pode estar em docs/local e ser referenciado no CHANGELOG ou no README.
