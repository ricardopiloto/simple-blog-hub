## ADDED Requirements

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

The API SHALL allow DELETE of a post only when the authenticated user is the owner (Post.AuthorId equals the user's AuthorId). If the user is a collaborator but not the owner, the API SHALL reject the delete request (e.g. 403 Forbidden).

#### Scenario: Collaborator cannot delete

- **WHEN** an authenticated user who is a collaborator (and not the owner) sends DELETE for that post
- **THEN** the API returns 403 (or equivalent) and the post is not deleted

#### Scenario: Owner can delete

- **WHEN** the authenticated user is the owner and sends DELETE for that post
- **THEN** the API deletes the post and returns success
