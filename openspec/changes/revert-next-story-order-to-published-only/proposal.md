# Proposal: Reverter regra do próximo story order para "último post publicado + 1"

## Summary

Reverter a regra do **próximo valor sugerido** para o campo Ordem (Novo Post) à regra **original**: o próximo SHALL ser **ordem do último post publicado + 1**. Ou seja, considerar apenas posts **publicados** (Published == true) para calcular o máximo de `story_order`; o valor sugerido será esse máximo + 1 (ou 1 se não existir nenhum post publicado). Exemplo: se o último publicado tiver ordem 6, o próximo (Novo Post) será 7. Isto desfaz a alteração introduzida pela change add-story-order-resilience-and-next-available (que passou a considerar todos os posts na história, incluindo rascunhos, para evitar “lacunas” na sequência). O aviso no formulário quando a ordem está “muito à frente” da sugerida mantém-se (opcional; pode ser mantido ou removido conforme preferência — neste change mantemos o aviso).

## Goals

- **Regra original**: GET /api/posts/next-story-order SHALL return max(story_order) over **published** posts only + 1 (or 1 if no published posts). "Novo Post" passa a ser preenchido com esse valor (ex.: último publicado 6 → próximo 7).
- **Sem considerar rascunhos**: Rascunhos (drafts) não entram no cálculo; apenas posts com Published == true.
- **Alinhamento com add-post-include-in-story-order (opcional)**: Podemos restringir ainda ao subconjunto "na história" (IncludeInStoryOrder == true) entre publicados, para que o próximo seja a próxima posição na sequência do Índice da História. Neste change definimos: **apenas Published** (último post publicado, sem filtro extra por IncludeInStoryOrder), para corresponder literalmente a "último post publicado + 1".

## Scope

- **In scope**: (1) **API**: Em GetNextStoryOrder, calcular `maxOrder` sobre posts com **Published == true** apenas (remover o uso de todos os posts na história com IncludeInStoryOrder; usar .Where(p => p.Published)). O próximo valor = max + 1 (ou 1 se nenhum publicado). (2) **Spec deltas**: post-edit-form — MODIFIED: requisito da ordem inicial sugerida passa a ser "max(story_order) entre posts **publicados** + 1", com cenário atualizado (ex.: último publicado 6 → próximo 7). (3) **Documentação**: Atualizar comentário no endpoint e, se existir, a proposta/design da add-story-order-resilience (ou referir nesta change que a regra foi revertida).
- **Out of scope**: Remover o aviso "Esta ordem está muito à frente da sequência atual" no frontend (mantemos); alterar filtros do Índice da História ou de GetPosts order=story.

## Affected code and docs

- **backend/api/Controllers/PostsController.cs**: Em GetNextStoryOrder, substituir o filtro atual (IncludeInStoryOrder) por `.Where(p => p.Published)` e calcular max(StoryOrder) sobre essa query. Comentário do endpoint: "next suggested story_order (max over **published** posts + 1, or 1)".
- **openspec/changes/revert-next-story-order-to-published-only/specs/post-edit-form/spec.md**: MODIFIED — próximo sugerido = max sobre **publicados** + 1; cenários com "último publicado 6 → próximo 7".

## Dependencies and risks

- **Risco baixo**: Comportamento revertido ao que existia antes da resilience; autores que tenham rascunhos com ordem alta deixam de ver esse número refletido no "próximo" (o próximo volta a ser último publicado + 1). Pode haver "lacunas" na numeração se alguém publicar na ordem 6 e outro tiver um rascunho em 30 — o próximo sugerido será 7, não 31.

## Success criteria

- GET /api/posts/next-story-order retorna max(story_order) sobre posts com Published == true + 1 (ou 1 se nenhum).
- Formulário "Novo Post" mostra no campo Ordem esse valor (ex.: 7 quando o último publicado tem ordem 6).
- Spec delta e `openspec validate revert-next-story-order-to-published-only --strict` passam.
