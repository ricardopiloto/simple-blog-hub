# post-view-count — delta for show-view-count-only-for-published-in-ui

## ADDED Requirements

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
