# post-permissions Specification

## Purpose
TBD - created by archiving change add-auth-and-authors-area. Update Purpose after archive.
## Requirements
### Requirement: Post ownership and collaborators

The system SHALL treat the author who created the post (Post.AuthorId) as the owner. The system SHALL support collaborators via a PostCollaborator entity (PostId, AuthorId). Only the owner and explicitly added collaborators SHALL have write access to a post. The owner SHALL be able to edit and delete the post; a collaborator SHALL be able to edit but SHALL NOT be able to delete the post.

#### Scenario: Owner can edit and delete

- **WHEN** the authenticated user is the owner of the post (Post.AuthorId equals the user's AuthorId)
- **THEN** the user can edit and delete that post

#### Scenario: Collaborator can edit but not delete

- **WHEN** the authenticated user is a collaborator of the post (exists PostCollaborator for that PostId and AuthorId) and is not the owner
- **THEN** the user can edit the post but cannot delete it; a delete request SHALL be rejected (e.g. 403)

#### Scenario: Non-owner non-collaborator has no write access

- **WHEN** the authenticated user is neither the owner nor a collaborator of the post
- **THEN** edit and delete requests for that post SHALL be rejected (e.g. 403)

### Requirement: List of editable posts

The API and BFF SHALL provide an endpoint (e.g. GET /bff/posts/editable or equivalent) that, when called with a valid authenticated identity, returns only posts that the caller may edit (i.e. posts where the caller is the owner or a collaborator). The frontend area autoral SHALL use this list to show the dashboard of posts the author can manage.

#### Scenario: Editable list returns only permitted posts

- **WHEN** an authenticated author requests the list of editable posts
- **THEN** the response contains only posts for which the author is owner or collaborator

#### Scenario: Editable list requires authentication

- **WHEN** the client requests the editable posts list without a valid token
- **THEN** the server returns 401 and does not return the list

### Requirement: Create post assigns owner

When a new post is created via the API, the system SHALL set Post.AuthorId to the authenticated user's AuthorId. That user SHALL become the owner of the post and SHALL have permission to edit and delete it until the post or the collaboration model is changed.

#### Scenario: New post has creator as owner

- **WHEN** an authenticated user creates a new post via the protected create endpoint
- **THEN** the post is persisted with AuthorId equal to the caller's AuthorId, and the caller can edit and delete it

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

### Requirement: Owner can invite and remove collaborators

The owner of a post (Post.AuthorId) SHALL be able to add other authors as collaborators (insert into PostCollaborator) and to remove collaborators. Only the owner SHALL be allowed to add or remove collaborators. The API SHALL expose endpoints to list authors (for the invite selector), to add a collaborator to a post, and to remove a collaborator; the BFF SHALL expose equivalent protected endpoints and SHALL pass the caller identity to the API.

#### Scenario: Owner adds collaborator

- **WHEN** the authenticated user is the owner of the post and calls the add-collaborator endpoint with a valid author id (different from the owner)
- **THEN** that author is added as a collaborator and can edit the post but cannot delete it

#### Scenario: Non-owner cannot add collaborator

- **WHEN** the authenticated user is a collaborator (not the owner) and calls the add-collaborator endpoint
- **THEN** the API returns 403 Forbidden

#### Scenario: Owner removes collaborator

- **WHEN** the owner calls the remove-collaborator endpoint for an author who is currently a collaborator
- **THEN** that author is removed and no longer has edit access to the post

### Requirement: Post response includes collaborators for author area

When the API or BFF returns a post for the author area (editable list or get-by-id for edit), the response SHALL include a list of collaborators (authors who have been added to that post via PostCollaborator), so that the frontend can display the original author and the list of collaborators. The original author (owner) SHALL remain in the existing `author` / `author_id` fields; the `collaborators` field SHALL list only the collaborating authors (not the owner).

#### Scenario: Editable list includes collaborators

- **WHEN** the client requests the list of editable posts with a valid token
- **THEN** each post in the response includes `author` (owner), `author_id`, and `collaborators` (array of { id, name } or similar for the collaborating authors)

#### Scenario: Single post for edit includes collaborators

- **WHEN** the client requests a post by id for editing with a valid token
- **THEN** the response includes `collaborators` so the owner can manage the list in the UI

### Requirement: Author area card shows original author and collaborators

In the author area dashboard, each post card SHALL display the original author (owner) and, when present, the list of collaborators. The UI SHALL distinguish clearly between "Autor" (original) and "Colaboradores" so that it is visible who created the post and who was invited to collaborate.

#### Scenario: Card shows author and collaborators

- **WHEN** the user views the area-autor list and a post has an owner and one or more collaborators
- **THEN** the card shows the original author and the names of the collaborators (e.g. "Autor: X" and "Colaboradores: Y, Z")

#### Scenario: Card shows only author when no collaborators

- **WHEN** the post has no collaborators
- **THEN** the card shows only the original author; no collaborators line or empty list

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

