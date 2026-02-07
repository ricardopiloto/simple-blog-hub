# Tasks: fix-api-missing-column-include-in-story-order

## 1. Script SQL para a coluna IncludeInStoryOrder

- [x] 1.1 Criar ficheiro `backend/api/Migrations/Scripts/add_include_in_story_order_to_posts.sql` que adiciona a coluna `IncludeInStoryOrder` (INTEGER NOT NULL DEFAULT 1) à tabela `Posts`. Equivalente à migração EF Core `AddIncludeInStoryOrderToPost`. Em SQLite: `ALTER TABLE Posts ADD COLUMN IncludeInStoryOrder INTEGER NOT NULL DEFAULT 1;`

## 2. Documentação: Troubleshooting e referência no README principal

- [x] 2.1 Em `backend/api/README.md`, na secção **Troubleshooting**, adicionar instruções para o erro **"no such column: p.IncludeInStoryOrder"**: (1) Recomendado: reconstruir a imagem/processo da API e reiniciar, para que `MigrateAsync()` execute a migração ao arranque. (2) Alternativa: executar o script `Migrations/Scripts/add_include_in_story_order_to_posts.sql` contra o ficheiro `blog.db` (ou o DB em uso), depois reiniciar a API. Referir o script pelo nome e indicar que se a coluna já existir o SQLite pode devolver erro (ignorar nesse caso).
- [x] 2.2 Em `README.md` (raiz do projeto), na secção após "Recuperar senha do Admin", adicionar um parágrafo que remeta para o Troubleshooting de `backend/api/README.md` quando a API falhar com "no such column" (ex.: IncludeInStoryOrder), para que quem faz pull saiba onde resolver.

## 3. Spec delta

- [x] 3.1 O delta em `openspec/changes/fix-api-missing-column-include-in-story-order/specs/project-docs/spec.md` está preenchido (README da API documenta resolução para "no such column" para colunas de migrações). Revisar se necessário.

## 4. Validação

- [x] 4.1 Executar `openspec validate fix-api-missing-column-include-in-story-order --strict` e corrigir qualquer falha.
