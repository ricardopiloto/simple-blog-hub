# Proposal: Bordas arredondadas nas imagens de capa dos posts

## Summary

As **imagens de capa** dos posts (enviadas por URL ou por upload) devem ser exibidas com **bordas arredondadas** em todos os contextos do site: página inicial (destaque e cards), lista de artigos, índice da história (vista em grelha e vista de lista/reordenação) e página do artigo. O objetivo é um aspeto visual consistente e moderno. O projeto já aplica `rounded-lg` ou `rounded-xl` em vários contextos (PostCard, FeaturedPost, PostPage, cards do StoryIndex); este change **garante** que **todos** os contextos que exibem a capa tenham cantos arredondados (e `overflow-hidden` no contentor quando necessário) e documenta o requisito no spec.

## Why

- **Experiência visual:** Bordas arredondadas dão um aspeto mais suave e alinhado com interfaces atuais.
- **Consistência:** Todas as exibições de capa (listas, índice, artigo) devem seguir o mesmo critério visual.

## What Changes

- **Frontend:** Garantir que em **cada** contexto onde a imagem de capa é exibida o contentor (ou a imagem) tenha classes de border-radius (ex.: `rounded-lg` ou `rounded-xl`) e, quando o contentor corta a imagem, `overflow-hidden` para que o arredondamento seja visível. Contextos a verificar/ajustar: (1) **PostCard** (lista de artigos) — já tem `rounded-lg` no contentor; (2) **FeaturedPost** (destaque na página inicial) — já tem `rounded-xl`; (3) **PostPage** (página do artigo) — já tem `rounded-xl`; (4) **StoryIndex** — vista em grelha já herda `rounded-lg` do card; vista de lista/reordenação (quando o autor arrasta para reordenar) tem um contentor `aspect-video` **sem** rounded; adicionar `rounded-lg overflow-hidden` a esse contentor para consistência.
- **Spec post-cover-display:** Adicionar requisito (ou MODIFIED): as imagens de capa **devem** ser exibidas com **bordas arredondadas** (border-radius) em todos os contextos (destaque, cards, lista, índice da história, página do artigo), com valor consistente (ex.: rounded-lg ou rounded-xl) e overflow-hidden no contentor quando aplicável.

## Goals

- Todas as exibições de imagem de capa no site têm bordas arredondadas.
- Nenhum contexto (incluindo a vista de reordenação no Índice da História) mostra a capa com cantos retos.
- O spec post-cover-display exige e descreve este comportamento.

## Scope

- **In scope:** Aplicar ou garantir rounded corners (e overflow-hidden onde falta) nos componentes que exibem a capa; spec delta em post-cover-display.
- **Out of scope:** Alterar o raio exato (rounded-sm vs rounded-lg vs rounded-xl) em contextos que já estão arredondados; arredondar outros elementos (avatares, botões); processamento de imagem no backend (cortar/redimensionar no servidor).

## Affected code and docs

- **frontend/src/pages/StoryIndex.tsx** — no contentor da capa na vista de lista/reordenação (o `div.aspect-video` que envolve o `<img>` da capa em cada item arrastável), adicionar `rounded-lg overflow-hidden` para que a imagem tenha bordas arredondadas. Os restantes contextos (PostCard, FeaturedPost, PostPage, StoryIndex grelha) já têm rounded; confirmar e deixar como está.
- **openspec/changes/add-rounded-corners-post-cover-images/specs/post-cover-display/spec.md** — delta ADDED com requisito e cenário para bordas arredondadas em todas as exibições de capa.

## Dependencies and risks

- **Dependências:** Nenhuma.
- **Riscos:** Nenhum. Apenas classes CSS.

## Success criteria

- Na página inicial, no destaque e nos cards, as imagens de capa têm bordas arredondadas.
- Na lista de artigos e no índice da história (grelha e vista de reordenação), as imagens de capa têm bordas arredondadas.
- Na página do artigo, a capa tem bordas arredondadas.
- `openspec validate add-rounded-corners-post-cover-images --strict` passa.
