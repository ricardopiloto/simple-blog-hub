# Proposal: Capa com fundo transparente e comentários de secção na página do artigo

## Summary

Na **página do artigo** (single post page, `PostPage.tsx`), quando a imagem de capa não preenche todo o contentor 16:9 (object-contain gera faixas vazias — letterboxing ou pillarboxing), as faixas **deixam de ter fundo cinza** (`bg-muted`) e passam a ter **fundo transparente**, para um aspecto mais limpo. Em paralelo, adicionam-se **comentários no código** de `PostPage.tsx` para deixar claro o que é cada secção (loading, erro, link voltar, cabeçalho, capa, conteúdo, bio do autor, navegação anterior/próximo).

## Why

- **Visual:** O fundo cinza nas faixas pode distrair ou parecer pesado; transparente aproveita o fundo da página e melhora a integração visual.
- **Manutenção:** Comentários de secção em PostPage.tsx facilitam a leitura e futuras alterações por qualquer desenvolvedor.

## What Changes

- **frontend/src/pages/PostPage.tsx:** (1) No contentor da capa (div com `aspect-[16/9]`), substituir `bg-muted` por fundo transparente (ex.: remover a classe ou usar `bg-transparent`). (2) Adicionar comentários que identifiquem cada bloco: estado de loading, estado de erro/not found, link "Voltar para artigos", cabeçalho (título, autor, data, visualizações), bloco da imagem de capa, bloco do conteúdo HTML, secção de bio do autor, navegação anterior/próximo.
- **Spec post-cover-display:** O requisito que exige "fundo neutro (ex.: bg-muted)" nas faixas da página do artigo passa a exigir **fundo transparente** nas faixas (letterboxing/pillarboxing) quando a imagem não preenche o 16:9.

## Goals

- Faixas vazias do contentor da capa na página do artigo com fundo transparente.
- PostPage.tsx com comentários que descrevem cada secção do componente.

## Scope

- **In scope:** Alteração apenas na página do artigo (PostPage.tsx); spec post-cover-display (delta MODIFIED).
- **Out of scope:** Alterar listas, cards ou índice da história; alterar outras páginas.

## Affected code and docs

- **frontend/src/pages/PostPage.tsx** — classe do contentor da capa; comentários de secção.
- **openspec/changes/post-page-cover-transparent-bg-and-comments/specs/post-cover-display/spec.md** — delta MODIFIED.

## Success criteria

- Na página do artigo, com imagem não 16:9, as faixas ao redor da imagem são transparentes (sem bordas cinzas).
- PostPage.tsx contém comentários claros para cada secção principal.
- `openspec validate post-page-cover-transparent-bg-and-comments --strict` passa.
