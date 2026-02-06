# project-docs (delta)

## MODIFIED Requirements

### Requirement: README describes project, backend, BFF, and how to run

The repository README SHALL describe the Simple Blog Hub (blog de leitura), the architecture (Frontend → BFF → API → SQLite), and how to run the full system. It SHALL include: requirements (Node.js and npm for frontend; .NET SDK for backend API and BFF); instructions to run the backend API, the BFF, and the frontend (including order and ports); environment variables (e.g. VITE_BFF_URL for frontend; API and BFF configuration for backend). It SHALL list the main npm scripts for the frontend (dev, build, test) and how to run the .NET projects (e.g. dotnet run for api and bff). Optional: single creation credit (e.g. Lovable) may remain.

#### Scenario: Developer runs full stack from README

- **WHEN** a developer follows the README
- **THEN** they can start the backend API, then the BFF, then the frontend
- **AND** they see how to set VITE_BFF_URL (or default) so the frontend talks to the BFF
- **AND** they understand that the BFF protects the API (only BFF is public)

#### Scenario: Project context documents backend and BFF

- **WHEN** an AI or developer reads openspec/project.md
- **THEN** the Tech Stack includes .NET Core, SQLite, and BFF
- **AND** Architecture Patterns describe the BFF as the single public entry point and the API as internal
- **AND** folder structure documents backend/api, backend/bff, and src/api (client)
- **AND** data source for posts is described as the BFF (and no longer mock-only)
