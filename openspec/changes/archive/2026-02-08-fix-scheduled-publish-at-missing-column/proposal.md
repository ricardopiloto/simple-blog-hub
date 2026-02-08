# Fix: API "no such column: p.ScheduledPublishAt" — script de migração manual

## Summary

Após a change **add-scheduled-publish-post**, a API pode falhar com:

```
Microsoft.Data.Sqlite.SqliteException: SQLite Error 1: 'no such column: p.ScheduledPublishAt'.
```

Isto ocorre quando a base de dados **não** teve a migração EF Core `AddScheduledPublishAtToPost` aplicada (ex.: imagem Docker antiga sem reconstruir, ou base restaurada de backup). O **ScheduledPublishBackgroundService** consulta a coluna `ScheduledPublishAt` e falha se ela não existir.

A change add-scheduled-publish-post adicionou a migração EF e o código, mas **não** adicionou o **script SQL manual** equivalente (como já existe para ViewCount e IncludeInStoryOrder). Sem esse script, operadores que tenham a base desatualizada não têm forma rápida de corrigir sem reconstruir a imagem e garantir que `MigrateAsync()` rode.

## Goals

1. **Script SQL manual**: Adicionar `backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql` que adiciona a coluna `ScheduledPublishAt` (TEXT, nullable) à tabela `Posts`, equivalente à migração EF `AddScheduledPublishAtToPost`.
2. **Documentação**: Incluir no README da API (secção Migrações manuais e Troubleshooting) o erro "no such column: p.ScheduledPublishAt" e as duas formas de resolver (reconstruir e reiniciar API; ou executar o script uma vez). Atualizar **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** e **EXPOR-DB-NO-HOST.md** para listar o novo script.
3. **Spec**: Delta em project-docs exigindo o script e a documentação para ScheduledPublishAt (consistente com ViewCount e IncludeInStoryOrder).

## Out of scope

- Alterar a migração EF Core (já está correta).
- Alterar o ScheduledPublishBackgroundService (comportamento correto; o problema é apenas o schema em falta).

## Success criteria

- Operador com erro "no such column: p.ScheduledPublishAt" encontra no README da API instruções para (1) reconstruir e reiniciar a API ou (2) executar o script SQL uma vez.
- O script existe em `backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql` e pode ser executado com `sqlite3 blog.db < ...` (local) ou equivalente no host/Docker.
- ATUALIZAR-SERVIDOR-DOCKER-CADDY.md e EXPOR-DB-NO-HOST.md referem o novo script na lista de scripts de banco.
- `openspec validate fix-scheduled-publish-at-missing-column --strict` passa.
