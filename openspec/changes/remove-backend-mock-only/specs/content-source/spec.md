# content-source (delta)

## ADDED Requirements

### Requirement: Mock-only blog data

The system SHALL provide all blog content (posts, authors, ordering) exclusively from in-app mock data. A remote backend, database, or external persistence layer SHALL NOT be used. Data sources SHALL be limited to frontend-defined structures (e.g. `mockPosts`) and in-memory state (e.g. store in `usePosts` hooks).

#### Scenario: No backend at runtime

- **WHEN** the application runs (development or production build)
- **THEN** no Supabase client, environment variables for Supabase, or backend API calls are required or used for blog content
- **AND** posts and related data are served only from mock data and in-memory store

#### Scenario: Build and tests without backend

- **WHEN** the project is built (`npm run build`) or tests are run (`npm run test`)
- **THEN** the build and tests complete successfully without any Supabase or backend configuration or connectivity
