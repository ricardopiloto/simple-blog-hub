## ADDED Requirements

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
