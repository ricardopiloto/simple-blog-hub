# Tasks: add-cover-preview-on-edit-post

## 1. Frontend: preview da imagem de capa em Editar post

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, na secção "URL da imagem de capa" (campo e upload), quando **não** é novo post (`!isNew`) e o estado da URL da capa (`coverImage`) tem valor não vazio, renderizar um **preview** da imagem: um elemento `<img>` com `src` igual à URL (resolver URLs relativas, ex.: `/images/posts/...`, para o origin atual ou para a base do site conforme o projeto, para que a imagem carregue corretamente).
- [x] 1.2 Aplicar estilos ao preview (ex.: largura máxima, aspect-ratio 16:9, object-fit cover, borda ou cantos arredondados) para que não ocupe todo o formulário e mantenha a proporção recomendada.
- [x] 1.3 Garantir que em "Novo post" (`isNew === true`) o preview **não** é renderizado.

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/add-cover-preview-on-edit-post/specs/post-edit-form/spec.md`, ADDED requirement: no formulário **Editar post** (e apenas neste), quando existir uma URL de imagem de capa (carregada do post ou definida pelo utilizador), o sistema **DEVE** exibir um preview visual dessa imagem na secção da capa; no formulário **Novo post** o preview **NÃO** deve ser exibido. Cenário: utilizador abre Editar post com post que tem capa → vê o preview; utilizador abre Novo post → não vê preview da capa.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-cover-preview-on-edit-post --strict` e corrigir eventuais falhas.
