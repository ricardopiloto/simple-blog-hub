# Tasks: Validar fluxo de postagens (publicados na página inicial e no índice)

## 1. Verificação backend

- [x] 1.1 Confirmar que a API em `GET /api/posts` (sem `editable` e sem `forAuthorArea`) aplica o filtro `published=true` por defeito e devolve apenas posts com `Published == true`. Confirmar que o BFF, ao chamar a API para listar posts públicos (página inicial e índice), envia `published: true`.
- [x] 1.2 Confirmar que a API em `CreatePost` (POST) e `UpdatePost` (PUT) persiste o campo `Published` a partir do body do pedido (ex.: `CreateOrUpdatePostRequest.Published`).

## 2. Verificação frontend

- [x] 2.1 Confirmar que o cliente (`fetchPosts`) chama o BFF sem parâmetros adicionais que forcem rascunhos (o BFF deve pedir à API apenas publicados para listas públicas). Confirmar que a página inicial e o índice usam essas listas (ex.: `usePublishedPosts`, `usePostsByStoryOrder`).
- [x] 2.2 Confirmar que o formulário de criar/editar post (`PostEdit.tsx`) envia o campo `published` no payload de create e update e que o estado local `published` é inicializado a partir do post ao editar.

## 3. UX – valor por defeito para novo post (opcional)

- [x] 3.1 No formulário de novo post, definir o valor inicial do estado "Publicado" como **true** (ex.: `useState(true)` para novo post, mantendo `useState(false)` apenas se a convenção for rascunho por defeito; ou inicializar com `true` quando `isNew`). Assim, novos posts passam a aparecer na página inicial e no índice salvo o utilizador desmarcar "Publicado". Ao editar um post existente, continuar a carregar o valor atual (`post.published`).

## 4. Documentação

- [x] 4.1 Atualizar `openspec/project.md` (e/ou README): indicar explicitamente que apenas posts **publicados** (campo "Publicado" marcado no formulário) aparecem na **página inicial** e no **Índice da História**; posts guardados como rascunho são visíveis na Área do autor e podem ser acedidos por link direto ao slug (conforme política do GET por slug).

## 5. Validação manual

- [x] 5.1 Criar um novo post com "Publicado" marcado; confirmar que aparece na página inicial e no índice. Criar um novo post com "Publicado" desmarcado; confirmar que não aparece nessas listas mas aparece na Área do autor. Editar um post rascunho e marcar "Publicado"; confirmar que passa a aparecer nas listas públicas.
