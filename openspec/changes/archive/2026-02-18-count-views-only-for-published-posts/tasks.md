# Tasks: count-views-only-for-published-posts

## 1. API — Incrementar view count apenas para posts publicados

- [x] 1.1 Em **backend/api/Controllers/PostsController.cs**, no método **GetBySlug** (GET /api/posts/{slug}), incrementar `post.ViewCount` **somente quando** `post.Published` for `true`. Se o post for rascunho ou agendado (não publicado), não alterar `ViewCount` e não chamar `SaveChangesAsync` para essa alteração (ou chamar SaveChangesAsync apenas quando houver incremento, para não gerar escrita desnecessária). Manter o retorno do post em ambos os casos.

## 2. API — Dashboard total views apenas de posts publicados

- [x] 2.1 Em **backend/api/Controllers/DashboardController.cs**, no método **GetStats**, calcular `totalViews` como a soma de `ViewCount` **apenas dos posts com** `Published == true` (ex.: `SumAsync(p => p.Published ? p.ViewCount : 0, cancellationToken)` ou `await _db.Posts.Where(p => p.Published).SumAsync(p => p.ViewCount, cancellationToken)`).

## 3. Spec delta post-view-count

- [x] 3.1 Criar **openspec/changes/count-views-only-for-published-posts/specs/post-view-count/spec.md** com secção **MODIFIED Requirements**: atualizar o requisito que trata do incremento do view count na leitura pública — o sistema SHALL incrementar o view count **only when the post is published** (`Published == true`); when the post is a draft or scheduled (not yet published), loading the post by slug SHALL **not** increment the view count. Adicionar cenários: (1) utilizador abre por slug um post **publicado** — o ViewCount desse post é incrementado; (2) utilizador abre por slug um post em **rascunho** — o ViewCount **não** é incrementado.

## 4. Validação

- [x] 4.1 Executar `openspec validate count-views-only-for-published-posts --strict` e corrigir até passar.
