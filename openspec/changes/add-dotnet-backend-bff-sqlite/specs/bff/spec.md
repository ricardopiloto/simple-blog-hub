# bff (delta)

## ADDED Requirements

### Requirement: BFF as single public entry point for blog data

The system SHALL provide a Backend-for-Frontend (BFF) application in .NET Core that is the only public HTTP entry point for blog data. The frontend SHALL call only the BFF; the BFF SHALL call the internal backend API. The internal API SHALL NOT be exposed to the internet, so that attacks (e.g. DDoS, direct exploitation) target the BFF and not the API or database.

#### Scenario: Frontend talks only to BFF

- **WHEN** the frontend needs post list or post by slug
- **THEN** it sends requests only to the BFF base URL (e.g. GET /bff/posts, GET /bff/posts/{slug})
- **AND** no frontend code calls the internal API URL directly

#### Scenario: BFF forwards to internal API

- **WHEN** the BFF receives a request for posts or a post by slug
- **THEN** it forwards the request to the internal backend API (e.g. HttpClient to API base URL)
- **AND** it returns the API response (or a transformed version) to the client
- **AND** the internal API is not bound to a public port or is only reachable from the BFF in production

### Requirement: BFF endpoints for reading posts

The BFF SHALL expose at least: GET list of published posts (with ordering by date or story_order as needed by the frontend), and GET post by slug. Responses SHALL be compatible with the frontend Post type (id, title, slug, excerpt, content, cover_image, published, published_at, created_at, updated_at, story_order, author with name, avatar, bio).

#### Scenario: BFF returns posts and post by slug

- **WHEN** the client calls GET /bff/posts (or equivalent)
- **THEN** the BFF returns a list of published posts in the expected shape
- **WHEN** the client calls GET /bff/posts/{slug}
- **THEN** the BFF returns the post with that slug and its author, or 404 if not found
