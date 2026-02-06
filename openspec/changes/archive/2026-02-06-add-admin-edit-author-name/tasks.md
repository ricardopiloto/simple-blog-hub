# Tasks: Admin pode alterar o nome do autor na gestão de contas

## 1. API

- [x] 1.1 Em `UpdateUserRequest` (UserDtos.cs), adicionar propriedade opcional `AuthorName` (string, nullable ou omitida no JSON).
- [x] 1.2 Em `UsersController.UpdateUser`: quando o chamador for Admin (`isAdmin`) e `request.AuthorName` for fornecido (não nulo nem vazio após trim), atualizar `user.Author.Name` com o valor (trim). O utilizador já está carregado com `Include(u => u.Author)`. Não permitir que não-Admin altere o nome (apenas Admin).

## 2. BFF

- [x] 2.1 Garantir que o body do `PUT /bff/users/{id}` seja repassado à API sem remover campos; a API passará a aceitar `author_name`. Se o BFF fizer serialização explícita do body, incluir `author_name` no modelo/DTO usado.

## 3. Frontend

- [x] 3.1 Em `src/api/types.ts`, adicionar `author_name?: string` a `UpdateUserPayload`.
- [x] 3.2 Em `src/api/client.ts`, na função `updateUser`, incluir `author_name` no body quando `payload.author_name !== undefined`.
- [x] 3.3 Em `AreaContas.tsx`: no diálogo "Editar conta", adicionar estado para o nome do autor (ex.: `editAuthorName`) e um campo **Nome do autor** (Input). Ao abrir o diálogo de edição (ao clicar "Editar" numa conta), inicializar `editAuthorName` com o nome atual da conta (`u.author_name`). Ao submeter o formulário, incluir `author_name: editAuthorName.trim()` no payload quando o valor for diferente do original ou sempre enviar para simplificar. Ao fechar o diálogo, limpar também `editAuthorName`.

## 4. Documentação e validação

- [x] 4.1 Atualizar `openspec/project.md` (secção Gestão de contas): referir que o Admin pode alterar o **nome do autor** (nome exibido ao publicar) ao editar uma conta. Opcional: README.
- [x] 4.2 Build da API, BFF e frontend. Validar manualmente: como Admin, abrir Contas, editar uma conta e alterar o "Nome do autor"; salvar e confirmar que o nome foi persistido e que aparece na lista e nos posts desse autor.
