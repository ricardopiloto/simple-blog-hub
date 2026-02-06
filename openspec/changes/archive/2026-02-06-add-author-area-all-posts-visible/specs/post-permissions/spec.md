# post-permissions (delta)

## ADDED Requirements

### Requirement: Author area shows all posts; edit and delete actions only for owner or collaborator

In the Área do Autor (author dashboard), the system SHALL display **all posts** to every authenticated author, so that everyone can see the full catalog. For each post in the list, the frontend SHALL show the **Editar** (Edit) action only when the current user is the post owner (Post.AuthorId equals the user's AuthorId) or a collaborator (user's AuthorId appears in the post's collaborators). The frontend SHALL show the **Excluir** (Delete) action only when the current user is the post owner. The API SHALL provide an authenticated list endpoint that returns all posts with author_id and collaborators in the response, so the frontend can compute per-post visibility of actions. The API SHALL continue to enforce edit and delete permissions on the corresponding write endpoints (only owner or collaborator can edit; only owner can delete).

#### Scenario: Author sees all posts in dashboard

- **WHEN** an authenticated author opens the Área do Autor (dashboard)
- **THEN** the list shows all posts (owned by any author), each with author and collaborators information
- **AND** the author can see which posts they can edit (owner or collaborator) and which they cannot

#### Scenario: Editar visible only for owner or collaborator

- **WHEN** the author views the post list in the Área do Autor
- **THEN** the "Editar" button is shown only for posts where the current user is the owner or a collaborator
- **AND** for posts where the user is neither owner nor collaborator, "Editar" is not shown (and edit is still forbidden by the API if attempted)

#### Scenario: Excluir visible only for owner

- **WHEN** the author views the post list in the Área do Autor
- **THEN** the "Excluir" button is shown only for posts where the current user is the owner
- **AND** for posts where the user is collaborator or neither, "Excluir" is not shown
