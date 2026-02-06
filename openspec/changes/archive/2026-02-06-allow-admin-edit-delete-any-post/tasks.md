# Tasks: Admin pode editar e excluir qualquer post

## 1. API – permissões de edição e exclusão para Admin

- [x] 1.1 Injetar `IAdminService` em `PostsController`. Em `CanEditAsync`: além de dono ou colaborador, retornar `true` quando `await _adminService.IsAdminAsync(authorId, cancellationToken)` for `true`.
- [x] 1.2 Em `DeletePost` (DELETE): além de `post.AuthorId == authorId`, permitir a exclusão quando `await _adminService.IsAdminAsync(authorId.Value, cancellationToken)` for `true`. Manter 403 para colaborador ou outro autor não-Admin.

## 2. Frontend – Área do Autor

- [x] 2.1 Em `AreaAutor.tsx`, ajustar `canEdit(post)` para retornar `true` quando o utilizador for Admin (`isAdmin`), independentemente de ser dono ou colaborador.
- [x] 2.2 Exibir o botão **Excluir** (e o `AlertDialog` de confirmação) para um post quando o utilizador for dono **ou** Admin (`isOwner(post) || isAdmin`). Manter oculto para colaborador não-Admin.

## 3. Documentação

- [x] 3.1 Atualizar `openspec/project.md` na secção "Permissões por post": referir que o **Admin** (e-mail configurado em `Admin:Email`) pode **editar e excluir** qualquer post; dono pode editar e excluir; colaborador apenas editar.
- [x] 3.2 Atualizar `README.md` na secção de permissões/área do autor: indicar que o Admin pode editar e excluir qualquer post.

## 4. Validação

- [x] 4.1 Build da API e do frontend. Validar manualmente: como Admin, na Área do Autor deve ser possível ver "Editar" e "Excluir" em todos os posts; editar e excluir um post de outro autor deve ser aceite pela API e refletir na UI. Como autor não-Admin, apenas dono/colaborador continuam com Editar; apenas dono com Excluir.
