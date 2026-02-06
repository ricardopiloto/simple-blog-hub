# Change: Admin pode editar e excluir qualquer post

## Why

O administrador do sistema (identificado pelo e-mail configurado em `Admin:Email` / `Admin__Email`) deve poder **editar** e **excluir** qualquer post, independentemente de ser o dono ou colaborador. Hoje apenas o dono pode excluir e apenas dono ou colaborador podem editar; isso impede o Admin de moderar ou remover conteúdo de qualquer autor.

## What Changes

- **API**: Nos endpoints de post (GET edit, PUT, DELETE), além das regras atuais (dono pode editar/excluir; colaborador pode editar), o utilizador cujo e-mail coincide com `Admin:Email` **pode editar e excluir qualquer post**. A API já possui `IAdminService` e usa-o em Auth e Users; será usado também em `PostsController` para permitir acesso total aos posts.
- **BFF**: Sem alteração de contrato; continua a repassar `X-Author-Id` para a API. A decisão de permitir edição/exclusão por Admin fica na API.
- **Frontend**: Na Área do Autor, exibir o botão **Editar** para qualquer post quando o utilizador for Admin (além de dono/colaborador). Exibir o botão **Excluir** para qualquer post quando o utilizador for Admin (além de dono). O frontend já tem `is_admin` no contexto de autenticação.
- **Spec**: Extensão da capability **post-permissions**: novo requisito "Admin can edit and delete any post"; requisitos existentes "Delete only by owner" e "Author area... edit and delete actions" são modificados para incluir o Admin.

## Impact

- Affected specs: **post-permissions** (ADDED requirement; MODIFIED requirements for delete and author-area UI).
- Affected code: `backend/api/Controllers/PostsController.cs` (injetar `IAdminService`, usar em `CanEditAsync` e em `DeletePost`); `src/pages/AreaAutor.tsx` (`canEdit` e visibilidade de "Excluir" quando `isAdmin`); `openspec/project.md` e `README.md` (documentar que o Admin pode editar e excluir qualquer post).
