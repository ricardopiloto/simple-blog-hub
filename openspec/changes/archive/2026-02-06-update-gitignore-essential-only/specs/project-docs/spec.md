# project-docs (delta)

## ADDED Requirements

### Requirement: .gitignore covers only essential artifacts

The repository SHALL provide a root `.gitignore` that ignores only what is necessary and SHALL NOT ignore project/solution files so they remain versioned. The file SHALL ignore: (1) Node dependencies and frontend build output (e.g. `node_modules`, `dist`, `dist-ssr`); (2) .NET build and dependency artifacts (e.g. `bin/`, `obj/`, `.vs/` under the backend tree); (3) environment and secrets (e.g. `.env`); (4) SQLite database files used by the backend (e.g. `backend/api/*.db`, `backend/api/*.db-*`); (5) logs and common temporary files (e.g. `*.log`, `*.local`); (6) editor and OS cruft (e.g. `.vscode/*` with optional exception for `!.vscode/extensions.json`, `.idea`, `.DS_Store`, `*.suo`, `*.sw?`). The `.gitignore` SHALL NOT ignore `*.sln`, `*.csproj`, or `*.njsproj` so that solution and project files are committed.

#### Scenario: Dependencies and build output not tracked

- **WHEN** a developer runs `npm install` or `dotnet build` in the repo
- **THEN** `node_modules`, `dist`, and backend `bin/` and `obj/` directories are not offered for commit by `git status`
- **AND** `.env` is not offered for commit

#### Scenario: Project and solution files are versioned

- **WHEN** the repo contains `.sln` or `.csproj` (or `.njsproj`) files
- **THEN** those files are not ignored by `.gitignore`
- **AND** they appear in `git status` when modified and can be committed
