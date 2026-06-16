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

### Requirement: View count displayed in UI only for published posts (SHALL)

In the **author area** (list of posts in Área do autor) and on the **article page** (`/post/:slug`), the view count SHALL be **displayed only when the post is published** (`Published == true`). For **draft** or **scheduled** (not yet published) posts, the view count SHALL **not** be displayed: no "· N visualizações" in the author area list, and no view count block in the article metadata row. This ensures the UI does not show a count for posts that do not accumulate views (backend only increments for published posts).

#### Scenario: Author area — published post shows view count

- **GIVEN** the user is logged in and the author area list of posts is loaded
- **AND** a post in the list is **published** and has a view count (e.g. 42)
- **WHEN** the user views the list
- **THEN** that post card SHALL show the view count next to the "Publicado" indicator (e.g. "· Publicado · 42 visualizações")

#### Scenario: Author area — draft or scheduled post does not show view count

- **GIVEN** the user is logged in and the author area list of posts is loaded
- **AND** a post in the list is a **draft** or **scheduled** (not yet published), i.e. `published === false`
- **WHEN** the user views the list
- **THEN** that post card SHALL **not** display any view count text (no "· 0 visualizações" or similar)
- **AND** the card SHALL still show "Rascunho" or the scheduled date as applicable

#### Scenario: Article page — view count only when post is published

- **GIVEN** the user is logged in
- **WHEN** they open an article page (`/post/:slug`)
- **THEN** the view count SHALL be displayed in the metadata row **only if** the post is **published**
- **AND** if the post is draft or scheduled (not published), the view count block (icon + number) SHALL **not** be displayed

