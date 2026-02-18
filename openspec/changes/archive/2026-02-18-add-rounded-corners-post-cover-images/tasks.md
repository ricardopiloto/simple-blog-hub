# Tasks: add-rounded-corners-post-cover-images

## 1. Verificar e completar bordas arredondadas nos contextos de capa

- [x] 1.1 Em **frontend/src/pages/StoryIndex.tsx**, na vista de lista/reordenação (item arrastável): o contentor da imagem de capa é um `div` com `aspect-video w-full relative` que envolve o `<img>`. Adicionar ao contentor as classes **`rounded-lg overflow-hidden`** para que a capa seja exibida com bordas arredondadas. Confirmar que a vista em grelha (cards) já tem rounded (o card tem `rounded-lg overflow-hidden`).
- [x] 1.2 Opcional: Confirmar que **PostCard**, **FeaturedPost** e **PostPage** já aplicam rounded (rounded-lg ou rounded-xl) às capas; não alterar se já estiver correto.

## 2. Spec delta post-cover-display

- [x] 2.1 Criar **openspec/changes/add-rounded-corners-post-cover-images/specs/post-cover-display/spec.md** com um requisito **ADDED**: as imagens de capa dos posts **devem** (SHALL) ser exibidas com **bordas arredondadas** (border-radius, ex.: Tailwind `rounded-lg` ou `rounded-xl`) em **todos** os contextos: destaque na página inicial, cards na lista de artigos, índice da história (vista em grelha e vista de lista/reordenação), e página do artigo. O contentor da imagem **deve** usar `overflow-hidden` quando necessário para que o corte siga o border-radius. Incluir cenário: quando o utilizador visualiza capas em qualquer contexto (início, lista, índice, artigo), as imagens aparecem com cantos arredondados.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-rounded-corners-post-cover-images --strict` e corrigir até passar.
