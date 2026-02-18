# post-view-count Specification

## Purpose
TBD - created by archiving change add-post-view-count-for-logged-in-users. Update Purpose after archive.
## Requirements
### Requirement: View count stored per post and visible only to logged-in users

The system SHALL store a **view count** per post (e.g. integer column on the Post entity). The view count SHALL be **incremented only when** the post is **published** (`Published == true`) and is viewed via the public read path (e.g. GET post by slug); when the post is a **draft** or **scheduled** (not yet published), loading the post by slug SHALL **not** increment the view count. The **view count SHALL be exposed only to authenticated users**: the BFF SHALL include `view_count` in post responses only when the client request carries a valid JWT; for unauthenticated requests the BFF SHALL omit `view_count` so that anonymous readers never see it. The frontend SHALL display the view count only when it is present in the response (i.e. when the user is logged in).

#### Scenario: Logged-in user sees view count in author area

- **GIVEN** the user is logged in
- **WHEN** they open the Área do autor (author area) and the list of posts is loaded
- **THEN** each post card SHALL show the view count **next to** the "Publicado" or "Rascunho" indicator (e.g. "· Publicado · 42 visualizações" or with an icon)
- **AND** the count SHALL reflect the number of times that post has been viewed (incremented on each public read when the post is published)

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

#### Scenario: View count increments when published post is viewed

- **GIVEN** a post exists with `Published == true` and current view count N
- **WHEN** a client loads the post by slug via the public read path (e.g. GET /api/posts/:slug or GET /bff/posts/:slug that triggers the API)
- **THEN** the stored view count for that post SHALL be incremented to N+1
- **AND** subsequent responses that include `view_count` (for logged-in users) SHALL reflect the updated value

#### Scenario: View count does not increment when draft post is viewed

- **GIVEN** a post exists with `Published == false` (draft or scheduled not yet published) and current view count N
- **WHEN** a client loads the post by slug via the public read path
- **THEN** the stored view count for that post SHALL **not** change (remains N)
- **AND** the post content SHALL be returned as usual; only the increment is skipped

