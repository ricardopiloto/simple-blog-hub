# Desativar atualização automática do Resumo ao editar post

## Summary

Alterar o funcionamento do formulário de **Editar post** de forma que o campo **Resumo** (excerpt) **não seja mais atualizado automaticamente** quando o autor altera o conteúdo. Uma vez que o Resumo já está preenchido (carregado do post ao abrir a edição), ele **não** deve ser sobrescrito pela lógica que define o resumo a partir dos primeiros 32 caracteres do conteúdo. O autor pode continuar a editar o Resumo manualmente; apenas a sincronização automática é desativada **no fluxo de edição**.

No fluxo de **Novo post**, o comportamento atual pode manter-se: o Resumo pode continuar a ser preenchido e atualizado automaticamente a partir dos primeiros 32 caracteres do conteúdo, para ajudar o autor a ter um resumo inicial sem preencher à mão.

## Goals

1. **Editar post**: No formulário de **edição** de um post existente, quando o autor altera o campo Conteúdo (Content), o campo Resumo (Excerpt) **não** deve ser atualizado automaticamente. O Resumo é preenchido uma vez ao carregar o post (a partir de `post.excerpt`) e só muda se o autor editar o campo Resumo manualmente.
2. **Novo post** (opcional): Manter o comportamento atual — Resumo preenchido e atualizado automaticamente a partir dos primeiros 32 caracteres do conteúdo. (Se se quiser o mesmo comportamento em Novo post, pode ser tratado nesta change ou numa futura.)
3. **Spec**: Delta em post-edit-form: MODIFIED do requisito atual de "Excerpt auto-filled from first 32 characters" para excluir o formulário de **edição**, ou ADDED requisito que no formulário de edição o Resumo não é atualizado automaticamente quando o Conteúdo muda.

## Out of scope

- Alterar a API ou o BFF (o excerpt continua a ser enviado e persistido no create/update).
- Alterar o comportamento do formulário de **Novo post** (a proposta mantém a sincronização automática em novo post).

## Success criteria

- Ao editar um post, alterar o texto do Conteúdo não altera o valor do campo Resumo; o Resumo só muda se o autor editar esse campo diretamente.
- Ao criar um novo post, o Resumo continua a ser preenchido/atualizado automaticamente a partir do Conteúdo (comportamento atual), salvo decisão em contrário.
- `openspec validate disable-auto-excerpt-when-editing-post --strict` passa.
