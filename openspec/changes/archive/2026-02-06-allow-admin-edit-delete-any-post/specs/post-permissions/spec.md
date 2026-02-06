# post-permissions (delta)

## ADDED Requirements

### Requirement: Admin can edit and delete any post

The system SHALL allow the Admin (the user whose email matches the configured Admin email, e.g. `Admin:Email` / `Admin__Email`) to **edit** and **delete** any post, regardless of ownership or collaboration. The API SHALL treat the Admin as having both edit and delete permission on every post when enforcing GET edit, PUT, and DELETE endpoints. The frontend SHALL show the "Editar" and "Excluir" actions for every post in the Área do Autor when the current user is the Admin.

#### Scenario: Admin can edit any post

- **WHEN** the authenticated user is the Admin (email matches configured Admin email)
- **AND** the user requests to get a post for edit (GET edit) or to update a post (PUT) for a post they do not own and are not a collaborator of
- **THEN** the API allows the request and returns or updates the post successfully

#### Scenario: Admin can delete any post

- **WHEN** the authenticated user is the Admin
- **AND** the user sends DELETE for a post they do not own
- **THEN** the API deletes the post and returns success (e.g. 204)

#### Scenario: Author area shows Editar and Excluir for Admin on all posts

- **WHEN** the Admin views the post list in the Área do Autor
- **THEN** the "Editar" button is shown for every post (including those owned by other authors)
- **AND** the "Excluir" button is shown for every post (including those owned by other authors)

## MODIFIED Requirements

### Requirement: Delete only by owner

**Delta:** Extend to allow the Admin to delete any post. The API SHALL allow DELETE when the caller is the owner **or** when the caller is the Admin (email matches `Admin:Email`).

#### Scenario: Admin can delete post owned by another author

- **WHEN** the authenticated user is the Admin and sends DELETE for a post whose owner is a different author
- **THEN** the API deletes the post and returns success (e.g. 204 No Content)

### Requirement: Author area shows all posts; edit and delete actions only for owner or collaborator

**Delta:** Extend visibility for the Admin. The frontend SHALL show **Editar** when the current user is the post owner, a collaborator, **or** the Admin. The frontend SHALL show **Excluir** when the current user is the post owner **or** the Admin. The API SHALL enforce: owner or collaborator or Admin can edit; owner or Admin can delete.

#### Scenario: Editar visible for Admin on any post

- **WHEN** the Admin views the post list in the Área do Autor
- **THEN** the "Editar" button is shown for every post, including posts owned by other authors

#### Scenario: Excluir visible for Admin on any post

- **WHEN** the Admin views the post list in the Área do Autor
- **THEN** the "Excluir" button is shown for every post, including posts owned by other authors
