# Proposal: Exibir contador de visualizações apenas para posts publicados na UI

## Summary

Na **área do autor**, na listagem de postagens, o contador de visualizações (ex.: "· 42 visualizações") deve ser exibido **apenas quando o post está publicado**. Para posts em **rascunho** ou com **publicação agendada** (ainda não publicados), o contador **não** deve aparecer. O mesmo critério aplica-se na **página do artigo** quando o autor visualiza um post: mostrar o view count apenas se o post estiver publicado. Esta change altera apenas o **frontend** (condição de exibição); o backend já só incrementa e soma visualizações de posts publicados (change count-views-only-for-published-posts). Inclui a atualização do CHANGELOG para a **versão 2.5.1** com esta alteração, versão no frontend e tag no README.

## Why

- **Consistência:** O backend já contabiliza visualizações só para publicados; na UI não faz sentido mostrar "0 visualizações" ou um número para rascunhos/agendados, pois esse número não é incrementado ao abrir o post. Ocultar o contador para não publicados evita confusão e alinha a interface ao comportamento do sistema.
- **Clareza:** O autor vê o contador apenas onde ele tem significado (posts publicados).

## What Changes

- **Frontend — área do autor:** Em **AreaAutorDashboard.tsx** e **AreaAutor.tsx**, na linha que exibe o view count junto a "Publicado" ou "Rascunho", mostrar o texto de visualizações **somente quando** `post.published === true` **e** `typeof post.view_count === 'number'`. Para rascunhos e agendados (não publicados), não renderizar "· N visualizações".
- **Frontend — página do artigo:** Em **PostPage.tsx**, na metadada (autor, data, visualizações), exibir o view count **somente quando** o post estiver publicado **e** view_count estiver presente. Para um post em rascunho ou agendado aberto por link direto, não mostrar o bloco de visualizações.
- **CHANGELOG e versão:** Inserir secção **## [2.5.1]** no topo de **docs/changelog/CHANGELOG.md** com a descrição desta change e o item de documentação/versão; **frontend/package.json** `version` para **2.5.1**; **README.md** secção 4 com tag **v2.5.1**.

## Goals

- Na listagem da área do autor, posts **publicados** mostram "· N visualizações"; posts em **rascunho** ou **agendados** (não publicados) não mostram o contador.
- Na página do artigo, o view count só aparece quando o post está publicado.
- CHANGELOG com [2.5.1], package.json 2.5.1, README com v2.5.1.

## Scope

- **In scope:** Frontend (três ficheiros), CHANGELOG [2.5.1], package.json 2.5.1, README secção 4; spec delta post-view-count.
- **Out of scope:** Alterações no backend ou BFF; migração de dados.

## Affected code and docs

- **frontend/src/pages/AreaAutorDashboard.tsx** — condição de exibição do view count: adicionar `post.published &&`.
- **frontend/src/pages/AreaAutor.tsx** — idem.
- **frontend/src/pages/PostPage.tsx** — idem.
- **docs/changelog/CHANGELOG.md** — secção [2.5.1] no topo.
- **frontend/package.json** — version 2.5.1.
- **README.md** — secção 4: tag v2.5.1.
- **openspec/changes/show-view-count-only-for-published-in-ui/specs/post-view-count/spec.md** — delta MODIFIED.

## Dependencies and risks

- **Dependências:** Nenhuma. O tipo `Post` já tem `published: boolean`.
- **Riscos:** Nenhum.

## Success criteria

- Na área do autor, um post em rascunho ou agendado (não publicado) não exibe "· N visualizações".
- Na área do autor, um post publicado exibe o view count quando disponível.
- Na página do artigo, o view count só é exibido quando o post está publicado.
- CHANGELOG tem [2.5.1] no topo; package.json 2.5.1; README com v2.5.1.
- `openspec validate show-view-count-only-for-published-in-ui --strict` passa.
