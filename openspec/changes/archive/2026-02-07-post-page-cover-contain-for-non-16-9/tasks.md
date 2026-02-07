# Tasks: post-page-cover-contain-for-non-16-9

## 1. Página do artigo (PostPage)

- [x] 1.1 Em `frontend/src/pages/PostPage.tsx`, no contentor da imagem de capa (div com aspect-[16/9] ou equivalente), adicionar classe de fundo neutro (ex.: `bg-muted`) para as faixas de letterboxing/pillarboxing.
- [x] 1.2 Na `<img>` da capa, trocar `object-cover` por `object-contain`, mantendo `object-center` e aspect 16:9 no contentor.

## 2. Spec delta

- [x] 2.1 Preencher `openspec/changes/post-page-cover-contain-for-non-16-9/specs/post-cover-display/spec.md` com requisito ADDED (ou MODIFIED) que na página do artigo a capa seja exibida com object-contain e fundo neutro nas faixas, com cenário adequado.

## 3. Validação

- [x] 3.1 Executar `openspec validate post-page-cover-contain-for-non-16-9 --strict` e corrigir falhas.
