# Design: fix-scheduled-publish-at-missing-column

## Context

O projeto já segue o padrão de fornecer **scripts SQL manuais** para colunas adicionadas por migrações EF, permitindo que operadores apliquem o schema manualmente quando `MigrateAsync()` não foi executado (ou a imagem não foi reconstruída). Exemplos: `add_view_count_to_posts.sql`, `add_include_in_story_order_to_posts.sql`.

A change **add-scheduled-publish-post** introduziu a coluna `ScheduledPublishAt` (DateTime? em C#, TEXT nullable em SQLite) mas não adicionou o script correspondente. Quando a base está desatualizada, o background service que publica posts agendados falha ao fazer a query.

## Approach

- **Um único ficheiro SQL**: `ALTER TABLE Posts ADD COLUMN ScheduledPublishAt TEXT;` — em SQLite, TEXT sem NOT NULL é nullable; equivalente à migração EF que usa `type: "TEXT", nullable: true`.
- **Documentação alinhada** com os outros scripts: mesma secção "Migrações manuais" e Troubleshooting no README da API; mesma tabela e comandos em ATUALIZAR e EXPOR-DB-NO-HOST.
- Nenhuma alteração ao código da API ou ao fluxo de MigrateAsync(); apenas disponibilizar a via manual para quem precisar.
