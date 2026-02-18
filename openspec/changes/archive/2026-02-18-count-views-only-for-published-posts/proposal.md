# Proposal: Contabilizar visualizações apenas para posts publicados

## Summary

Ajustar a funcionalidade de **contagem de visualizações** para que o contador seja **incrementado somente quando o post está publicado** (`Published == true`). Abertura de um post em rascunho (ou agendado e ainda não publicado) por slug **não** deve incrementar o `ViewCount`. O dashboard da área do autor deve exibir "Total de visualizações" como a soma dos `ViewCount` **apenas dos posts publicados**, para que o indicador reflita apenas leituras de conteúdo efetivamente publicado.

## Why

- **Comportamento atual:** O endpoint público GET /api/posts/{slug} incrementa `ViewCount` em toda a leitura por slug, independentemente de o post ser publicado ou rascunho. Assim, quando o autor (ou alguém com link direto) abre um rascunho, a visualização é contabilizada, o que distorce a métrica.
- **Objetivo:** As visualizações devem representar **leituras de artigos publicados**. Rascunhos e posts agendados (ainda não publicados) não devem contribuir para o contador ao serem abertos.
- **Consistência:** O indicador "Total de visualizações" no dashboard deve somar apenas os `ViewCount` dos posts publicados, alinhado com o critério de "só contabilizar posts publicados".

## What Changes

- **API (PostsController):** No GET /api/posts/{slug}, incrementar `ViewCount` **somente se** `post.Published` for `true`. Se o post for rascunho ou agendado (não publicado), devolver o post normalmente mas **não** incrementar o contador.
- **API (DashboardController):** No GET /api/dashboard/stats, calcular `TotalViews` como a soma de `ViewCount` **apenas dos posts com** `Published == true`, em vez da soma de todos os posts.
- **Spec post-view-count:** Atualizar o requisito que descreve o incremento na leitura pública: o view count SHALL be incremented only when the post is published; viewing a draft or scheduled (unpublished) post SHALL NOT increment the count.

## Goals

- Ao abrir um post **publicado** por slug, o `ViewCount` desse post é incrementado.
- Ao abrir um post em **rascunho** ou **agendado** (não publicado) por slug, o `ViewCount` **não** é incrementado.
- O dashboard "Total de visualizações" reflete apenas a soma das visualizações dos posts publicados.
- A exibição de `view_count` por post (na área do autor e na página do artigo) mantém-se inalterada para utilizadores autenticados; o valor de rascunhos pode permanecer 0 ou o que tiver sido acumulado antes desta alteração.

## Scope

- **In scope:** API GetBySlug (incremento condicional), API Dashboard GetStats (totalViews apenas publicados), spec delta em post-view-count.
- **Out of scope:** Alterar quem vê o view_count (continua apenas para autenticados); alterar frontend; migração de dados ou reset de contadores existentes.

## Affected code and docs

- **backend/api/Controllers/PostsController.cs** — método GetBySlug: condicionar `post.ViewCount++` a `post.Published`.
- **backend/api/Controllers/DashboardController.cs** — GetStats: `totalViews` como `SumAsync(p => p.Published ? p.ViewCount : 0)` ou equivalente (soma apenas onde `Published`).
- **openspec/changes/count-views-only-for-published-posts/specs/post-view-count/spec.md** — delta MODIFIED no requisito de incremento na leitura pública.

## Dependencies and risks

- **Dependências:** Nenhuma.
- **Riscos:** Nenhum. Comportamento retrocompatível: posts já publicados continuam a incrementar; rascunhos deixam de incrementar.

## Success criteria

- GET /api/posts/{slug} para um post com `Published == false` não altera o `ViewCount` desse post.
- GET /api/posts/{slug} para um post com `Published == true` incrementa o `ViewCount` em 1.
- GET /api/dashboard/stats devolve `TotalViews` igual à soma dos `ViewCount` dos posts com `Published == true`.
- `openspec validate count-views-only-for-published-posts --strict` passa.
