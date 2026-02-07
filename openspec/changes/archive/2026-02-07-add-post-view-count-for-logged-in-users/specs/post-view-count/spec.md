# post-view-count — delta for add-post-view-count-for-logged-in-users

## ADDED Requirements

### Requirement: View count stored per post and visible only to logged-in users

The system SHALL store a **view count** per post (e.g. integer column on the Post entity) and SHALL increment it when the post is viewed via the public read path (e.g. GET post by slug). The **view count SHALL be exposed only to authenticated users**: the BFF SHALL include `view_count` in post responses only when the client request carries a valid JWT; for unauthenticated requests the BFF SHALL omit `view_count` so that anonymous readers never see it. The frontend SHALL display the view count only when it is present in the response (i.e. when the user is logged in).

#### Scenario: Logged-in user sees view count in author area

- **GIVEN** the user is logged in
- **WHEN** they open the Área do autor (author area) and the list of posts is loaded
- **THEN** each post card SHALL show the view count **next to** the "Publicado" or "Rascunho" indicator (e.g. "· Publicado · 42 visualizações" or with an icon)
- **AND** the count SHALL reflect the number of times that post has been viewed (incremented on each public read of the post by slug)

#### Scenario: Logged-in user sees view count on article page

- **GIVEN** the user is logged in
- **WHEN** they open an article page (`/post/:slug`)
- **THEN** the view count SHALL be displayed on the **same line** as the author name and publication date (metadata row at the top of the article)
- **AND** the view count SHALL be shown with an **icon** (e.g. eye icon) so it sits inline with author and date
- **AND** the value SHALL be the current view count for that post

#### Scenario: Anonymous user does not see view count

- **GIVEN** the user is not logged in
- **WHEN** they open an article page or any page that could show post data
- **THEN** the response SHALL NOT include `view_count` (BFF omits it for unauthenticated requests)
- **AND** the UI SHALL NOT display any view count (no placeholder or zero)

#### Scenario: View count increments on public read

- **GIVEN** a post exists with a current view count N
- **WHEN** a client (authenticated or not) loads the post by slug via the public read path (e.g. GET /bff/posts/:slug or equivalent that triggers API GET by slug)
- **THEN** the stored view count for that post SHALL be incremented to N+1 (or the system SHALL apply a defined increment policy; in this change, one increment per public read)
- **AND** subsequent responses that include `view_count` (for logged-in users) SHALL reflect the updated value
