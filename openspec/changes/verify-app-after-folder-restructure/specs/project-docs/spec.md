# project-docs — delta for verify-app-after-folder-restructure

## ADDED Requirements

### Requirement: Documented verification after structural changes

The README (or openspec/project.md) SHALL include a **verification** section that describes how to confirm the application works after cloning or after structural/dependency changes. The section SHALL list at least: (1) building the frontend from `frontend/` (`cd frontend && npm install && npm run build`); (2) running frontend tests (`cd frontend && npm run test`); (3) building the backend (`dotnet build` in `backend/api` and `backend/bff`); (4) running API, BFF, and frontend and performing a minimal smoke check (e.g. open home page, login, confirm one BFF-backed feature). The purpose is to allow anyone to repeat these steps to catch regressions after layout or dependency updates.

#### Scenario: Developer follows verification steps

- **WHEN** a developer (or CI) follows the documented verification steps after a clone or after changing folder structure or dependencies
- **THEN** they can run frontend build and tests and backend builds without ambiguity (paths and commands are clearly stated)
- **AND** they can run the app and confirm at least one end-to-end flow (e.g. home page loads, login works, one BFF call succeeds)

#### Scenario: Deploy doc matches frontend layout

- **WHEN** a deploy guide (e.g. DEPLOY-UBUNTU-CADDY.md) describes building and serving the frontend
- **THEN** all commands and paths use the **`frontend/`** directory (e.g. `cd frontend && npm run build`, copy from `frontend/dist`)
- **AND** the "update application" or redeploy section is consistent with the same layout
