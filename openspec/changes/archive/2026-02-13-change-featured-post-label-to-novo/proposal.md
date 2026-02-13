# Proposal: Alterar o label do post em destaque na página inicial de "Destaque" para "Novo"

## Summary

Na **página inicial** (`/`), o post que aparece em destaque (o primeiro da lista, último criado entre os publicados) exibe atualmente o texto **"Destaque"** como etiqueta (badge) acima do título. Este change altera esse texto para **"Novo"**, mantendo toda a lógica existente (ordenação por data de criação, destaque = primeiro da lista). Apenas o **texto visível** da etiqueta muda de "Destaque" para "Novo".

## Goals

- Na página inicial, o bloco do post em destaque **DEVE** exibir a etiqueta **"Novo"** (em vez de "Destaque") acima do título do post.
- O critério de qual post aparece nesse bloco permanece inalterado (último post criado entre os publicados).

## Scope

- **In scope**: Alterar em `frontend/src/components/blog/FeaturedPost.tsx` o texto da etiqueta de "Destaque" para "Novo". Atualizar o spec home-page para refletir que o label exibido é "Novo".
- **Out of scope**: Alterar ordenação, API, ou qualquer outro comportamento da página inicial.

## Affected code and docs

- **frontend/src/components/blog/FeaturedPost.tsx**: Uma linha — substituir o texto "Destaque" por "Novo" na span da etiqueta.
- **openspec/changes/change-featured-post-label-to-novo/specs/home-page/spec.md**: Spec delta (MODIFIED ou ADDED) indicando que o label do bloco em destaque é "Novo".

## Dependencies and risks

- **Nenhum**: Alteração de copy apenas; sem impacto em lógica ou APIs.

## Success criteria

- Na página inicial, a etiqueta do post em destaque mostra "Novo" em vez de "Destaque".
- `openspec validate change-featured-post-label-to-novo --strict` passa.
