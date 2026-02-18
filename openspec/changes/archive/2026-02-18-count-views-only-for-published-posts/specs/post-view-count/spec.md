# post-view-count — delta for count-views-only-for-published-posts

## MODIFIED Requirements

### Requirement: View count stored per post and visible only to logged-in users; increment only for published posts (SHALL)

The system SHALL store a **view count** per post (e.g. integer column on the Post entity). The view count SHALL be **incremented only when** the post is **published** (`Published == true`) and is viewed via the public read path (e.g. GET post by slug). When the post is a **draft** or **scheduled** (not yet published), loading the post by slug SHALL **not** increment the view count. The **view count SHALL be exposed only to authenticated users**: the BFF SHALL include `view_count` in post responses only when the client request carries a valid JWT; for unauthenticated requests the BFF SHALL omit `view_count` so that anonymous readers never see it. The frontend SHALL display the view count only when it is present in the response (i.e. when the user is logged in).

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
