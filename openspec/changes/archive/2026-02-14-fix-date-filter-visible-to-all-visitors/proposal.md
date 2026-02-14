# Proposal: Filtro de data na página Artigos visível a todos os visitantes

## Summary

O **filtro de data** (calendário para data única ou intervalo) na página **Artigos** (`/posts`) **deve** ser visível e utilizável por **qualquer pessoa que visite o site**, independentemente de estar ou não autenticada. Se atualmente o filtro estiver condicionado ao estado de login (ex.: renderizado apenas quando `isAuthenticated`), essa condição **deve** ser removida. O endpoint da lista pública de posts (BFF/API) já aceita `fromDate` e `toDate` sem exigir autenticação; a página Artigos **deve** exibir sempre o controlo de filtro por data ao lado do campo de pesquisa.

## Why

- **Problema**: O filtro de data na tela de artigos só aparece quando o utilizador está logado; visitantes anónimos não conseguem filtrar artigos por data.
- **Objetivo**: Qualquer visitante (autenticado ou não) **deve** ver e usar o filtro de data na página Artigos, em paridade com a pesquisa por texto e a paginação.

## What Changes

- **Spec posts-list**: Requisito MODIFIED (ou ADDED) que explicita que o **filtro por data** na página Artigos **deve** ser **visível e utilizável por todos os visitantes** (não apenas por utilizadores autenticados). Nenhuma condição de autenticação **deve** ocultar o controlo de data.
- **Frontend**: Em `Posts.tsx` (página Artigos), garantir que o **DateRangePicker** (filtro por data) **não** está envolvido por nenhuma condição que dependa de `isAuthenticated` ou de token. Se existir essa condição, removê-la para que o filtro seja sempre exibido.

## Goals

- Visitante não autenticado que acede a `/posts` vê o filtro de data (calendário) ao lado do campo de pesquisa e pode filtrar artigos por data ou intervalo.
- Comportamento alinhado com o spec: a lista pública de artigos e os seus filtros (texto e data) são acessíveis a todos.

## Scope

- **In scope**: (1) Spec posts-list: exigir que o filtro de data na página Artigos seja visível a todos. (2) Código: garantir que em `Posts.tsx` o DateRangePicker não está condicionado a autenticação (remover condição se existir).
- **Out of scope**: Alterar a Área do autor; alterar o BFF/API (a lista pública já suporta fromDate/toDate sem auth).

## Affected code and docs

- **openspec/changes/fix-date-filter-visible-to-all-visitors/specs/posts-list/spec.md**: Delta MODIFIED no requisito "Filtro por data com calendário" (ou ADDED cenário) a explicitar visibilidade para todos os visitantes.
- **frontend/src/pages/Posts.tsx**: Verificar e, se necessário, remover qualquer condição que oculte o DateRangePicker quando o utilizador não está autenticado.

## Success criteria

- Spec posts-list exige que o filtro de data na página Artigos seja visível a todos os visitantes (sem condição de login).
- Na página `/posts`, o controlo "Filtrar por data" está sempre visível, com ou sem sessão iniciada.
- `openspec validate fix-date-filter-visible-to-all-visitors --strict` passa.
