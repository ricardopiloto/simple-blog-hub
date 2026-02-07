# project-docs — delta for move-frontend-into-frontend-folder

## MODIFIED Requirements

### Requirement: README and project.md describe layout with frontend/ and backend/ at root

The README and openspec/project.md SHALL describe the repository layout so that: (1) the **frontend** lives entirely under a **`frontend/`** directory at the repository root (including `frontend/src/`, config files, and assets); (2) the **backend** lives under **`backend/`** (e.g. `backend/api/`, `backend/bff/`); (3) the root contains only README, .gitignore, openspec, and optional metadata. Run instructions for the frontend SHALL state that dependencies and scripts are executed from the **`frontend/`** directory (e.g. `cd frontend && npm install`, `cd frontend && npm run dev`, `cd frontend && npm run build`, `cd frontend && npm run test`). Run instructions for the backend SHALL continue to reference `backend/api` and `backend/bff` (e.g. `dotnet build` in `backend/api`, `dotnet run` in `backend/bff`).

#### Scenario: Reader finds frontend under frontend/ and correct run commands

- **WHEN** a developer opens the README or project.md
- **THEN** they see that the frontend source and config are under `frontend/` (e.g. `frontend/src/`, `frontend/package.json`)
- **AND** the documented steps to run the frontend include entering the `frontend/` directory before running `npm install` or `npm run dev` (or equivalent)
- **AND** the documented steps to run the backend reference `backend/api` and `backend/bff` unchanged

#### Scenario: README commands match package.json in frontend

- **WHEN** the README lists npm scripts (e.g. dev, build, test)
- **THEN** each listed script exists in **`frontend/package.json`**
- **AND** the README states or implies that these scripts are run from the `frontend/` directory

### Requirement: README describes project and how to run it

The repository SHALL provide a README that describes what the project is and how to run it. The README SHALL include a short project description, the required environment (Node.js and npm for frontend; .NET 9 for backend), step-by-step instructions to install dependencies and start the development server **from the frontend directory** (e.g. `cd frontend && npm install`, `cd frontend && npm run dev`), and the main npm scripts (e.g. dev, build, test) with the understanding that they are executed from **`frontend/`**. Optional sections MAY cover deployment or third-party tooling.

#### Scenario: New developer clones and runs the project

- **WHEN** a developer clones the repo and opens the README
- **THEN** they see what the project does (blog, BFF, API, SQLite)
- **AND** they see clear steps: clone, enter **`frontend/`**, `npm install`, `npm run dev` (and separately run API and BFF from `backend/api` and `backend/bff`)
- **AND** they can run the app locally by following these steps
