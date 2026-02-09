# Tasks: disable-auto-excerpt-when-editing-post

## 1. Frontend – lógica do Resumo ao editar

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, na função que atualiza o Conteúdo (ex.: `handleContentChange`), **não** atualizar o estado do Resumo (excerpt) quando o formulário for de **edição** (quando existe `id` / não é novo post). Ou seja: só aplicar `setExcerpt(value.slice(0, EXCERPT_LENGTH).trim())` quando for **novo post** (`isNew === true`). Quando for edição, apenas `setContent(value)`.

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/disable-auto-excerpt-when-editing-post/specs/post-edit-form/spec.md`: MODIFIED do requisito "Excerpt auto-filled from first 32 characters" — restringir ao formulário de **novo post**; no formulário de **edição**, o Resumo **não** deve ser atualizado automaticamente quando o Conteúdo muda (o Resumo é carregado do post e só muda se o autor editar o campo manualmente). Ajustar ou adicionar cenários: (1) Novo post: ao digitar no Conteúdo, o Resumo continua a ser preenchido com os primeiros 32 caracteres; (2) Editar post: ao digitar no Conteúdo, o Resumo **não** é alterado; o autor pode editar o Resumo manualmente.

## 3. Validação

- [x] 3.1 Executar `openspec validate disable-auto-excerpt-when-editing-post --strict` e corrigir falhas.
