# Tasks: fix-date-filter-visible-to-all-visitors

## 1. Código: filtro de data sem condição de autenticação

- [x] 1.1 Em `frontend/src/pages/Posts.tsx`, verificar se o **DateRangePicker** (filtro por data) está condicionado a `isAuthenticated` ou a qualquer hook/contexto de autenticação. Se estiver (ex.: `{isAuthenticated && <DateRangePicker ... />}`), **remover** essa condição para que o filtro seja **sempre** exibido a qualquer visitante. Se não existir condição, confirmar que o componente está sempre renderizado e marcar como concluído.

## 2. Spec delta posts-list

- [x] 2.1 Em `openspec/changes/fix-date-filter-visible-to-all-visitors/specs/posts-list/spec.md`, adicionar requisito MODIFIED ao "Filtro por data com calendário (data única ou intervalo) na página Artigos": o filtro **deve** ser **visível e utilizável por todos os visitantes** da página Artigos (`/posts`), **independentemente** de estarem ou não autenticados. Nenhuma condição de autenticação **deve** ocultar o controlo. Adicionar cenário: visitante não autenticado acede a /posts → vê o filtro de data ao lado da pesquisa e pode selecionar data ou intervalo.

## 3. Validação

- [x] 3.1 Executar `openspec validate fix-date-filter-visible-to-all-visitors --strict` e corrigir até passar.
