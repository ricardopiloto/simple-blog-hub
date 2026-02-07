# Tasks: revert-next-story-order-to-published-only

## 1. API: Next story order apenas sobre publicados

- [x] 1.1 Em GetNextStoryOrder (backend/api/Controllers/PostsController.cs), alterar o cálculo de `maxOrder` para usar apenas posts com **Published == true** (ex.: `.Where(p => p.Published)`). O próximo valor SHALL ser max(story_order) sobre esses posts + 1 (ou 1 se nenhum). Atualizar o comentário do endpoint para "next suggested story_order (max over **published** posts + 1, or 1). Requires X-Author-Id."

## 2. Spec delta (post-edit-form)

- [x] 2.1 Em `openspec/changes/revert-next-story-order-to-published-only/specs/post-edit-form/spec.md`, adicionar um **MODIFIED** requirement: a ordem inicial sugerida para "Novo post" SHALL ser o maior `story_order` entre posts **publicados** (Published == true) + 1, ou 1 se não existir nenhum post publicado. Incluir cenário: dado que o maior story_order entre posts publicados é 6, quando o utilizador abre "Novo post", o campo Ordem é preenchido com 7. Manter cenário de zero posts (ordem 1).

## 3. Validação

- [x] 3.1 Executar `openspec validate revert-next-story-order-to-published-only --strict` e corrigir qualquer falha.
