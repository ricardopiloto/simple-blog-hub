# Proposal: Corrigir erro "no such column: p.IncludeInStoryOrder" na API

## Summary

A API pode lançar **SQLite Error 1: 'no such column: p.IncludeInStoryOrder'** quando o código já utiliza a propriedade `IncludeInStoryOrder` no modelo `Post`, mas a base de dados **ainda não tem** a coluna. A change que introduziu este fluxo é **add-post-include-in-story-order** (coluna e uso em GetPosts, GetNextStoryOrder, Create/Update e DTOs). O erro surge quando a migração EF Core não foi aplicada ao ficheiro SQLite em uso — por exemplo após um pull sem reconstruir/reiniciar a API, ou ao usar um `blog.db` antigo noutro ambiente. Este change documenta a causa, a correção e onde procurar ajuda (Troubleshooting no README da API e referência no README principal).

## Goals

- **Correção imediata**: Fornecer uma forma de aplicar a alteração ao esquema (coluna `IncludeInStoryOrder`) quando o erro ocorre: (1) reconstruir e reiniciar a API para que `MigrateAsync()` execute a migração existente; ou (2) aplicar manualmente um script SQL equivalente à migração, quando o operador preferir não depender do arranque da API.
- **Documentação**: Incluir no **Troubleshooting** do `backend/api/README.md` (ou documentação equivalente) a entrada para o erro "no such column: p.IncludeInStoryOrder", com os passos de resolução (reconstruir/reiniciar API ou executar script SQL manual). Manter consistência com a secção já existente para ViewCount.
- **Script SQL opcional**: Adicionar em `backend/api/Migrations/Scripts/` um script SQL que adiciona a coluna `IncludeInStoryOrder` à tabela `Posts` (INTEGER NOT NULL DEFAULT 1), para uso em upgrades manuais quando o operador não pode ou não quer depender de `MigrateAsync()`.

## Scope

- **In scope**: (1) **Script SQL** em `backend/api/Migrations/Scripts/add_include_in_story_order_to_posts.sql` que adiciona a coluna `IncludeInStoryOrder` (INTEGER NOT NULL DEFAULT 1) à tabela `Posts`. (2) **backend/api/README.md**: na secção Troubleshooting, adicionar subsecção ou parágrafo para o erro "no such column: p.IncludeInStoryOrder" com os mesmos tipos de solução (reconstruir e reiniciar API; ou executar o novo script SQL no `blog.db`). (3) **Spec delta** (opcional): project-docs — documentar que o Troubleshooting da API cobre erros "no such column" para colunas adicionadas por migrações (ViewCount, IncludeInStoryOrder) e como resolvê-los.
- **Out of scope**: Alterar o comportamento de `MigrateAsync()` ou a ordem de arranque da API; adicionar verificação automática de colunas em runtime.

## Affected code and docs

- **backend/api/Migrations/Scripts/add_include_in_story_order_to_posts.sql**: novo ficheiro (ALTER TABLE Posts ADD COLUMN IncludeInStoryOrder INTEGER NOT NULL DEFAULT 1).
- **backend/api/README.md**: secção Troubleshooting — adicionar instruções para o erro "no such column: p.IncludeInStoryOrder" (reconstruir/reiniciar API; ou executar o script SQL no blog.db).
- **openspec/changes/fix-api-missing-column-include-in-story-order/specs/project-docs/spec.md** (opcional): ADDED — README da API documenta resolução para "no such column" quando a coluna foi introduzida por uma migração (ex.: IncludeInStoryOrder).

## Dependencies and risks

- **Nenhum**: Script SQL e documentação. A migração EF Core `AddIncludeInStoryOrderToPost` já existe; este change apenas oferece alternativa manual e documenta o erro.

## Success criteria

- Existe um script SQL que adiciona a coluna `IncludeInStoryOrder` à tabela `Posts`, utilizável quando o operador aplica o esquema manualmente.
- O README da API descreve como resolver o erro "no such column: p.IncludeInStoryOrder" (reconstruir/reiniciar ou executar o script).
- Spec delta (se incluído) e `openspec validate fix-api-missing-column-include-in-story-order --strict` passam.
