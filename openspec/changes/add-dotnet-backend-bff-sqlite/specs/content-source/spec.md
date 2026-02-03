# content-source (delta)

## MODIFIED Requirements

### Requirement: Blog data from BFF (replacing mock-only)

The system SHALL provide all blog content (posts, authors, ordering) from the BFF (Backend-for-Frontend). The frontend SHALL call the BFF via a configured base URL (e.g. VITE_BFF_URL). The BFF SHALL obtain data from the internal backend API backed by SQLite. Mock data in the frontend SHALL no longer be the runtime source for blog posts; it MAY remain for tests or offline fallback only. The Post type (id, title, slug, excerpt, content, cover_image, published, published_at, story_order, author) SHALL remain compatible so that existing pages and components work without contract changes.

#### Scenario: Posts loaded from BFF at runtime

- **WHEN** the application runs and the user opens the home page, posts list, or a post by slug
- **THEN** data is fetched from the BFF (e.g. GET /bff/posts, GET /bff/posts/{slug})
- **AND** the hooks (e.g. usePublishedPosts, usePost) use the API client that targets the BFF
- **AND** loading and error states are handled when the BFF is unavailable

#### Scenario: Build and tests without requiring BFF

- **WHEN** the project is built (`npm run build`) or unit tests are run (`npm run test`)
- **THEN** the build and tests complete successfully without requiring the BFF to be running (e.g. client may use fallback or tests mock the client)
- **AND** integration or E2E tests that require the BFF may be run separately when the backend and BFF are available
