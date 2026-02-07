# Tasks: fix-prev-next-link-title-truncate-at-end

## 1. Frontend: truncar título pelo final nos links anterior/próximo

- [x] 1.1 Em `frontend/src/pages/PostPage.tsx`, na secção de navegação prev/next, envolver o texto do título (`prevPost.title` e `nextPost.title`) num elemento que trunca pelo final (ex.: `<span className="truncate min-w-0">` ou equivalente), de forma que o ícone (seta) fique fora desse span e sempre visível. Garantir que o link "Próximo post" (alinhado à direita) também trunca o título pelo final e não pelo início.

## 2. Spec delta

- [x] 2.1 O delta em `openspec/changes/fix-prev-next-link-title-truncate-at-end/specs/post-reading/spec.md` está preenchido com o requisito ADDED e cenários. Revisar se necessário.

## 3. Validação

- [x] 3.1 Executar `openspec validate fix-prev-next-link-title-truncate-at-end --strict` e corrigir qualquer falha.
