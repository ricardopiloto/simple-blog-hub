# Tasks: clarify-historia-required-in-post-edit

## 1. Frontend – indicador visual no label do campo História

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, no label do campo "História", adicionar um indicador visível de que o campo é obrigatório. Exemplos: alterar o texto do label para "História (obrigatório)" ou "História *", ou renderizar o label como "História" seguido de um span com " *" ou "(obrigatório)" em estilo discreto. O objectivo é que o autor perceba à primeira vista que deve escolher uma das opções do toggle antes de guardar.

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/clarify-historia-required-in-post-edit/specs/post-edit-form/spec.md`, ADDED (ou MODIFIED do requisito do toggle): o label ou a área do campo "História" deve exibir de forma clara que o campo é obrigatório (ex.: asterisco ou texto "(obrigatório)"). Incluir cenário: ao abrir Novo post ou Editar post, o autor vê no campo História uma indicação visível de que é obrigatório escolher uma das opções.

## 3. Validação

- [x] 3.1 Executar `openspec validate clarify-historia-required-in-post-edit --strict` e corrigir falhas.
