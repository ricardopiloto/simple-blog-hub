# Tasks: show-view-count-only-for-published-in-ui

## 1. Frontend — Área do autor: view count só para publicados

- [x] 1.1 Em **frontend/src/pages/AreaAutorDashboard.tsx**, na linha que exibe o view count (ex.: `{typeof post.view_count === 'number' && \` · ${post.view_count} visualizações\`}`), alterar para exibir **somente quando** o post está publicado: `{post.published && typeof post.view_count === 'number' && \` · ${post.view_count} visualizações\`}` (ou equivalente).
- [x] 1.2 Em **frontend/src/pages/AreaAutor.tsx**, aplicar a mesma condição: mostrar o view count apenas quando `post.published` e `view_count` estiver presente.

## 2. Frontend — Página do artigo: view count só para publicados

- [x] 2.1 Em **frontend/src/pages/PostPage.tsx**, no bloco que exibe o view count (metadada com ícone de olho), alterar a condição para incluir `post.published`: exibir o view count apenas quando `post.published && typeof post.view_count === 'number'`.

## 3. CHANGELOG e versão 2.5.1

- [x] 3.1 Em **docs/changelog/CHANGELOG.md**, inserir no topo (acima de `## [2.5]`) a secção **## [2.5.1]** com:
  - **show-view-count-only-for-published-in-ui:** Na área do autor (listagem de postagens) e na página do artigo, o **contador de visualizações** só é exibido quando o post está **publicado**; para rascunhos e posts agendados (ainda não publicados) o contador não aparece.
  - **Documentação e versão:** CHANGELOG com secção [2.5.1]; versão no frontend (package.json) definida como 2.5.1; README secção 4 com tag v2.5.1.
- [x] 3.2 Em **frontend/package.json**, alterar o campo `version` de `"2.5"` para `"2.5.1"`.
- [x] 3.3 Em **README.md**, na secção 4 (Links para CHANGELOG), adicionar **v2.5.1** à lista de exemplos de tags (ex.: … `v2.5`, `v2.5.1`).

## 4. Spec delta post-view-count

- [x] 4.1 Criar **openspec/changes/show-view-count-only-for-published-in-ui/specs/post-view-count/spec.md** com secção **MODIFIED Requirements**: o requisito que trata da exibição do view count na área do autor e na página do artigo deve indicar que o view count **SHALL be displayed only for published posts**; for **draft** or **scheduled** (not yet published) posts, the view count **SHALL NOT** be displayed in the author area list nor on the article page. Ajustar o cenário "Logged-in user sees view count in author area" para que cada post card mostre o view count **only when the post is published**; adicionar cenário: para um post em rascunho ou agendado, o card **não** exibe o contador de visualizações.

## 5. Validação

- [x] 5.1 Executar `openspec validate show-view-count-only-for-published-in-ui --strict` e corrigir até passar.
