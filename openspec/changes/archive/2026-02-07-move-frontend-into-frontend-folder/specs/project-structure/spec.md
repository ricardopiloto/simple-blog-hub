# project-structure — delta for move-frontend-into-frontend-folder

## MODIFIED Requirements

### Requirement: Backend directory reserved at repository root

The repository SHALL have a dedicated directory at the root named **`backend/`** containing the API and BFF (.NET) and SHALL be documented (e.g. README at root or inside backend/) so that it is clear the folder is for backend code. The frontend build and tests SHALL NOT depend on backend code; they run from the **`frontend/`** directory.

#### Scenario: Backend folder exists and is documented

- **WHEN** a developer inspects the repository root
- **THEN** they see a `backend/` directory
- **AND** documentation (README or backend/README) explains that the folder contains the API and BFF
- **AND** frontend build and tests are run from `frontend/` and do not depend on code inside `backend/`

### Requirement: Frontend directory at root; API client under frontend/src

The repository SHALL have a dedicated directory at the root named **`frontend/`** containing all frontend source, config, and assets. The frontend source tree SHALL include **`frontend/src/api/`** (or equivalent) for the API/BFF client (HTTP client, types, request helpers). The path alias **`@/`** SHALL resolve to **`src/`** relative to the frontend root (i.e. `frontend/src/`). Build and test commands for the frontend SHALL be run from the **`frontend/`** directory (e.g. `cd frontend && npm run build`, `cd frontend && npm run test`).

#### Scenario: Frontend folder exists and build passes

- **WHEN** the directory `frontend/` exists with `frontend/src/` (and `frontend/src/api/`) and config files (package.json, vite.config, etc.) inside `frontend/`
- **THEN** `npm run build` and `npm run test` complete successfully when run from the `frontend/` directory
- **AND** the path alias `@/` resolves to `frontend/src/` and existing imports (e.g. `@/data/`, `@/hooks/`) work unchanged

### Requirement: Root minimal; app behavior unchanged

The repository root SHALL contain only README.md, .gitignore, the openspec directory (openspec/), and any project/workspace metadata files (e.g. AGENTS.md). All frontend code and configuration SHALL live under **`frontend/`**; all backend code SHALL live under **`backend/`**. Moving the frontend into `frontend/` SHALL NOT change the runtime behavior of the application: the path alias `@/` SHALL continue to resolve to the frontend source directory, and the app SHALL continue to work with the same data and hooks as before.

#### Scenario: No regression after layout change

- **WHEN** the layout has `frontend/` and `backend/` at root and root contains only README, .gitignore, openspec, and optional metadata
- **THEN** all frontend tests pass when run from `frontend/`
- **AND** the frontend production build succeeds from `frontend/`
- **AND** the app still loads and behaves the same (e.g. data from BFF, same routes and UI)
