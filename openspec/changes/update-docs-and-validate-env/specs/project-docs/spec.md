# project-docs (delta)

## ADDED Requirements

### Requirement: Documentation clarifies when .env is needed and which variables are used

The project documentation (README and, where applicable, openspec/project.md) SHALL state clearly: (1) the application runs without a `.env` file (frontend defaults to a configured BFF URL in code; backend uses appsettings and process environment variables). (2) A root `.env` file is optional and is only used by the frontend build (Vite) for `VITE_*` variables; the only one used in code is `VITE_BFF_URL`. (3) The backend (API and BFF) does not read the root `.env` by default; backend configuration (e.g. `Admin__Email`, `API__BaseUrl`) is read from appsettings or from the process environment when running the applications. (4) Any variables that are no longer used by the project (e.g. Supabase-related) SHALL be documented as removable from local `.env` so developers do not rely on them.

#### Scenario: New developer runs the project without .env

- **WHEN** a developer clones the repo and runs the frontend and backend without creating a `.env` file
- **THEN** the application runs with default configuration (e.g. frontend uses default BFF URL, backend uses appsettings/defaults)
- **AND** the README (or project docs) states that `.env` is optional and when it is useful (e.g. to override `VITE_BFF_URL`)

#### Scenario: Developer checks which env vars are used

- **WHEN** a developer reads the documentation to see which environment variables the project uses
- **THEN** they see a clear list: frontend uses only `VITE_BFF_URL` (optional); backend uses appsettings and process env (e.g. `Admin__Email` for API)
- **AND** they see that Supabase-related variables are not used and can be removed from local `.env`
