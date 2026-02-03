# backend-api (delta)

## ADDED Requirements

### Requirement: Internal API for posts and authors

The system SHALL provide an internal .NET Core Web API that serves blog posts and authors from a SQLite database. The API SHALL NOT be exposed directly to the internet; only the BFF SHALL call it. It SHALL use Entity Framework Core with SQLite, and SHALL expose at least: list posts (with optional filter by published and ordering by date or story_order), and get post by slug (including author). Response shape SHALL support the frontend Post type (e.g. author as nested object with name, avatar, bio).

#### Scenario: API returns posts from SQLite

- **WHEN** the BFF or a client calls the internal API endpoint for listing posts (e.g. GET /api/posts)
- **THEN** the API returns posts stored in SQLite, with author information included
- **AND** only the BFF (or trusted callers) can reach this API; it is not bound to a public interface in production

#### Scenario: Seed data matches previous mock content

- **WHEN** the API database is initialized (migrations and seed)
- **THEN** the database contains content equivalent to the previous mock (e.g. same posts and author)
- **AND** the frontend can display the same articles as before, now coming from the API via the BFF

### Requirement: SQLite persistence and migrations

The backend API SHALL persist posts and authors in SQLite. The schema SHALL be managed via Entity Framework Core migrations. The connection string SHALL be configurable (e.g. environment or appsettings). At least one migration SHALL create the initial tables (e.g. Authors, Posts) and seed data SHALL be applied so the application has initial content.

#### Scenario: Database created and seeded

- **WHEN** the API runs for the first time (or migrations are applied)
- **THEN** the SQLite database file exists and contains Authors and Posts tables
- **AND** seed data is present so GET /api/posts returns at least one post
