# Change: Admin pode alterar o nome do autor na gestão de contas

## Why

Na gestão de contas (Contas), o Admin já pode criar contas com e-mail e **nome do autor**, editar e-mail e senha ao editar uma conta, e resetar senha. Falta a possibilidade de **alterar o nome do autor** (nome exibido ao publicar) ao editar uma conta — por exemplo, mudar de "Admin" para "Ricardo" ou de "Ana" para "Ana Luisa". Apenas o Admin deve poder alterar esse nome, no diálogo de edição de conta.

## What Changes

- **API**: No endpoint `PUT /api/users/{id}`, aceitar um campo opcional `author_name` no body. Quando o chamador for Admin e `author_name` for enviado (não nulo/vazio), atualizar o `Name` do `Author` associado ao utilizador alvo. O modelo `UpdateUserRequest` passa a incluir `AuthorName` (opcional). Apenas Admin pode alterar o nome; utilizador a editar a própria conta continua a poder alterar apenas a senha.
- **BFF**: Repassar o campo `author_name` do body para a API no `PUT /bff/users/{id}` (o BFF já encaminha o body; garantir que o contrato aceita e repassa `author_name`).
- **Frontend**: Na página **Contas** (`/area-autor/contas`), no diálogo **Editar conta**, adicionar um campo **Nome do autor** (valor inicial = nome atual da conta em edição). Ao salvar, incluir `author_name` no payload de `updateUser` quando o valor for alterado. A página já é restrita ao Admin, portanto o campo fica disponível apenas no fluxo de edição pelo Admin.
- **Spec**: Extensão da capability **auth**: novo requisito que exige que o Admin possa alterar o **nome do autor** (display name) de qualquer conta ao editar essa conta na gestão de contas.

## Impact

- Affected specs: **auth** (ADDED requirement).
- Affected code: `backend/api/Models/UserDtos.cs` (UpdateUserRequest + AuthorName); `backend/api/Controllers/UsersController.cs` (UpdateUser: aplicar AuthorName no Author quando isAdmin); `src/pages/AreaContas.tsx` (estado e campo "Nome do autor" no diálogo Editar; incluir no payload); `src/api/types.ts` (UpdateUserPayload + author_name opcional); `src/api/client.ts` (enviar author_name no body do PUT); opcionalmente `openspec/project.md` e README (mencionar que o Admin pode alterar o nome do autor ao editar conta).
