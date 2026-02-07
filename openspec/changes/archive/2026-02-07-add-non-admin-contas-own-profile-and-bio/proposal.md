# Proposal: Non-admin users see only own profile in Contas and can edit their bio

## Summary

Formalize in OpenSpec that **non-admin** (non-Admin) users can access the **Contas** screen (`/area-autor/contas`) and **see only their own user** (single profile), and that they **can adjust their own author bio** (and author name and password) through that screen. The Admin continues to see the list of all accounts and to manage them; the non-admin experience is restricted to viewing and editing the single profile linked to their account. This behavior is already implemented; the change adds an explicit requirement and scenarios so it is specified and validated.

## Goals

- **Spec clarity**: The auth (or account-management) capability SHALL state that any authenticated author can access Contas; non-admin users SHALL see only their own profile (one user) on that screen, and SHALL be able to edit their own **author name**, **author bio** (descrição do autor), and **password** there. The Admin SHALL see all accounts and retain full management (create, edit any user, reset password, delete).
- **No new UI**: Implementation already exists (frontend uses `isAdmin ? fetchUsers() : fetchCurrentUser().then(u => [u])`; API exposes GET /api/users/me and PUT /api/users/{id} with isSelf allowing Bio/AuthorName updates). The change only documents and validates the requirement.

## Scope

- **In scope**: Add one requirement (and scenarios) to the auth spec: non-admin access to Contas with single-profile view and ability to edit own author name, author bio, and password; Admin sees all accounts. Optionally ensure project.md/README already describe this (they do).
- **Out of scope**: Changing API or frontend behavior; adding new endpoints or UI.

## Affected code and docs

- **openspec/specs/auth** (via change delta): ADDED or MODIFIED requirement for non-admin Contas: see only own user, can edit own bio (and name, password). Scenarios: non-admin opens Contas and sees only one profile; non-admin can edit own bio/name/password; Admin sees list of all users.
- **openspec/project.md**: Already states that non-admin see "apenas o próprio perfil" and can edit "nome do autor", "descrição do autor", "senha". No change required unless we add one sentence for clarity.

## Dependencies and risks

- **No risk**: Spec and documentation only; behavior already implemented in API (UpdateUser allows Bio when isSelf, GetUsers is Admin-only, GetCurrentUser for /me) and frontend (AreaContas).

## Success criteria

- Auth spec (or delta) includes a requirement that non-admin users can access Contas, see only their own profile, and edit their own author name, author bio, and password.
- At least one scenario covers non-admin viewing Contas and seeing a single user; at least one covers non-admin editing their own bio (and the change persisting).
- `openspec validate add-non-admin-contas-own-profile-and-bio --strict` passes.
