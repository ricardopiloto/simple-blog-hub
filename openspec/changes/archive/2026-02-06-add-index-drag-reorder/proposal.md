# Change: Índice – reordenação por arrastar (drag-and-drop)

## Why

Melhorar a experiência de edição da ordem do Índice da História: além do método atual (alterar o número da ordem no campo numérico), o utilizador autenticado deve poder **arrastar** os cards para uma nova posição. Duas formas de reordenar tornam o fluxo mais flexível e intuitivo.

## What Changes

- **Frontend**: Na página do Índice (`/indice`), quando o utilizador autenticado clicar em "Editar ordem", além do **input numérico** por card (comportamento atual), os cards devem ser **arrastáveis** (drag-and-drop) para reordenar. Arrastar um card para outra posição deve atualizar a ordem em memória da mesma forma que alterar o número (reatribuir `story_order` 1..N); "Salvar ordem" e "Cancelar" continuam a funcionar. A implementação deve usar uma biblioteca de drag-and-drop (ex.: `@dnd-kit/core` + `@dnd-kit/sortable`) aplicada à lista de cards em modo de edição.
- **Backend**: Sem alterações; a persistência já existe via `PUT /bff/posts/story-order`.
- **Spec**: Extensão da capability **story-index** (presente no change add-index-pagination-filter-reorder): novo requisito que exige **duas maneiras** de editar a ordem — (1) editar o número da ordem no input, (2) arrastar o card para a nova posição — ambas com o mesmo resultado e persistência.

## Impact

- Affected specs: **story-index** (ADDED requirement for dual reorder methods; MODIFIED "Apenas autenticados podem editar" to explicitly require both methods).
- Affected code: `src/pages/StoryIndex.tsx` (integrar sortable/drag-and-drop na grid de cards quando `editingOrder` está ativo; manter input numérico e lógica de `applyManualReorder` / `handleSaveOrder`); `package.json` (adicionar dependências de drag-and-drop, ex.: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`).
