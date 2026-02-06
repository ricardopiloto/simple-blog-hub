# project-docs Specification

## Purpose
TBD - created by archiving change add-api-launch-profile-5002. Update Purpose after archive.
## Requirements
### Requirement: API launch profile for alternate port

When the default port 5001 is in use, the API SHALL be runnable without setting environment variables by using an alternate launch profile. A launch profile named `http-5002` SHALL exist in `backend/api/Properties/launchSettings.json` with `applicationUrl` set to `http://localhost:5002`. The API README SHALL document that users can run `dotnet run --launch-profile http-5002` when 5001 is in use and must then configure the BFF with the matching API base URL (e.g. `API__BaseUrl=http://localhost:5002`).

#### Scenario: Run API on port 5002 via launch profile

- **WHEN** port 5001 is in use and the user runs `dotnet run --launch-profile http-5002` in `backend/api`
- **THEN** the API starts listening on http://localhost:5002
- **AND** the README explains that the BFF must be configured to use that URL for the API

### Requirement: Backend API build documented and SDK pinned

The backend API project (`backend/api`) SHALL be buildable with the .NET 9 SDK. A `global.json` in the backend tree SHALL specify the SDK version (e.g. 9.0.x) so that `dotnet build` uses a consistent SDK when multiple versions are installed. The API README (`backend/api/README.md`) SHALL include a **Build** section with explicit commands (`dotnet restore`, `dotnet build`) and a **Troubleshooting** section describing what to do when the build fails (check `dotnet --version`, run `dotnet clean` and `dotnet restore`, link to .NET 9 SDK download).

#### Scenario: Build with correct SDK

- **WHEN** a developer runs `dotnet build` in `backend/api` with .NET 9 SDK installed
- **THEN** the build succeeds
- **AND** `global.json` (if present) ensures the 9.x SDK is selected when multiple SDKs exist

#### Scenario: Troubleshooting documented

- **WHEN** a developer opens `backend/api/README.md`
- **THEN** they find a Build section with restore and build commands
- **AND** they find a Troubleshooting section with steps to resolve build failures (version check, clean, restore)

### Requirement: Document dotnet run port conflict resolution

When the API is run with `dotnet run`, it may fail with "Address already in use" if port 5001 is taken. The API README (`backend/api/README.md`) SHALL document in the Troubleshooting section how to resolve this: (1) run on another port using `ASPNETCORE_URLS=http://localhost:<port> dotnet run` and, if so, configure the BFF with the same API base URL; (2) optionally how to identify and stop the process using port 5001 (e.g. `lsof -i :5001` on macOS/Linux) so the default port can be used.

#### Scenario: User hits port in use

- **WHEN** a user runs `dotnet run` in `backend/api` and port 5001 is already in use
- **THEN** the README Troubleshooting section explains the error and offers at least one solution (use another port with ASPNETCORE_URLS or free the port)
- **AND** if using another port, the user is reminded to set the BFF's API base URL accordingly

### Requirement: README and project.md are comprehensive and consistent

The repository SHALL maintain both **README.md** (user-facing) and **openspec/project.md** (project context for tooling and agents) so that they accurately and completely describe the current system. Both documents SHALL cover: (1) project purpose and architecture (Frontend → BFF → API → SQLite); (2) tech stack and versions (e.g. .NET 9, Node.js, Vite, React); (3) how to run the system (API, BFF, frontend) and main commands; (4) configuration and environment variables, including Admin account configuration (`Admin:Email` / `Admin__Email`, e.g. `ac.ricardosobral@gmail.com`); (5) authenticated author area: login, dashboard, post editing, and **account management** (Contas) for the Admin — creating accounts (email and name, default password `senha123`), resetting user passwords to default (triggering mandatory change on next login), and deleting users; (6) the **mandatory password change** flow: when a user logs in with the default password (e.g. after creation or reset), the system SHALL require a password change via a blocking modal before allowing access to the rest of the author area. The README and openspec/project.md SHALL be consistent with each other (same versions, same feature set, same flows) so that developers and automated tooling have a single source of truth.

#### Scenario: Reader finds Admin and Contas in both documents

- **WHEN** a developer or agent reads the README and then openspec/project.md
- **THEN** both documents describe the Admin account (identified by configured email) and the Contas area (`/area-autor/contas`) for account management (create, reset password, delete)
- **AND** the described behavior (default password, mandatory change on first login, reset flow) is the same in both

#### Scenario: Reader finds run instructions and tech stack in README

- **WHEN** a developer opens the README
- **THEN** they find requirements (Node.js, npm, .NET 9 SDK), step-by-step instructions to run API, BFF, and frontend, and the main npm scripts (dev, build, test, lint)
- **AND** the tech stack section matches the actual versions used in the project

#### Scenario: project.md supports OpenSpec and agent context

- **WHEN** an agent or OpenSpec workflow reads openspec/project.md
- **THEN** they find the full list of routes (including `/area-autor/contas`), domain context (blog, authors, account management, mandatory password change), and constraints (env, .env optional)
- **AND** the tech stack and external dependencies match the README and the codebase

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

### Requirement: README describes project and how to run it

The repository SHALL provide a README that describes what the project is and how to run it. The README SHALL include a short project description (e.g. Simple Blog Hub: a frontend-only blog with mock data), the required environment (Node.js and npm), step-by-step instructions to install dependencies and start the development server, and the main npm scripts (e.g. dev, build, test). Optional sections MAY cover deployment or third-party tooling (e.g. Lovable).

#### Scenario: New developer clones and runs the project

- **WHEN** a developer clones the repo and opens the README
- **THEN** they see what the project does (blog, mock data, no backend)
- **AND** they see clear steps: clone, `cd` into directory, `npm install`, `npm run dev`
- **AND** they can run the app locally without needing extra configuration or environment variables for backend

#### Scenario: README commands match package.json

- **WHEN** the README lists npm scripts (e.g. dev, build, test)
- **THEN** each listed script exists in `package.json` and can be executed successfully in a fresh install

### Requirement: README documents Admin email configuration

The README SHALL document how to configure the Admin account for the system. It SHALL state which environment variable (or configuration key) sets the Admin email (e.g. `Admin__Email` for the API) and SHALL give an example value (e.g. `ac.ricardosobral@gmail.com`). It SHALL explain that only the user with that email can create, update, and delete other user accounts, and that other authors can only change their own password.

#### Scenario: Operator configures Admin

- **WHEN** an operator reads the README to set up the blog
- **THEN** they find a section or table describing the Admin email configuration (variable name and example)
- **AND** they can set the variable (e.g. in .env or environment) so the system identifies the Admin account correctly

### Requirement: Documentation for initial admin account creation

The documentation (README and/or backend API README) SHALL state that, for initial configuration, the email set in `Admin:Email` (appsettings or `Admin__Email` environment variable) is used to automatically create the admin account with a default password (e.g. `senha123`). The user SHALL change this password on first access (e.g. via "Alterar minha senha" in the author area).

#### Scenario: Operator sets up initial system

- **WHEN** an operator reads the documentation to configure the system for the first time
- **THEN** they see that setting `Admin:Email` (or `Admin__Email`) causes the API to create the account with the default password
- **AND** they see that the user must change the password on first login

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

### Requirement: README inclui funcionalidades completas, estrutura dos serviços, stack e passo a passo de configuração

O **README** do repositório SHALL incluir: (1) uma **lista completa das funcionalidades** do projeto (leitura pública, índice com paginação/filtro/reordenação, área do autor, gestão de contas, perfil com descrição do autor, critério mínimo de senha, recuperação da senha do Admin, etc.); (2) uma descrição da **estrutura dos serviços** (fluxo Frontend → BFF → API → SQLite e estrutura de pastas relevante: `src/`, `backend/api/`, `backend/bff/` com subpastas); (3) a **stack de desenvolvimento** (versões e tecnologias: Node.js, npm, .NET 9, Vite, React, TypeScript, EF Core, SQLite, etc.) e referência aos comandos de build e scripts principais; (4) um **passo a passo de configuração** numerado, desde o build do projeto até o reset de senha do Admin (clone, instalar dependências, build/executar API e BFF, executar frontend, configurar Admin, primeiro login e troca de senha, e opcionalmente recuperar senha do Admin via ficheiro de trigger). O objetivo é que um novo desenvolvedor ou operador possa seguir uma única sequência lógica para pôr o sistema a funcionar e entender todas as capacidades do produto.

#### Scenario: Leitor encontra lista completa de funcionalidades no README

- **WHEN** a developer or operator opens the README
- **THEN** they find a section (or integrated list) that explicitly covers: public pages (home, posts list, single post with author description), story index (pagination, filter, reorder), theme, login, mandatory password change, author area, Contas (own profile and Admin management), password criteria, post permissions, and Admin password recovery via trigger file
- **AND** the list matches the current product capabilities described in openspec/project.md

#### Scenario: Leitor entende a estrutura dos serviços

- **WHEN** a developer reads the README
- **THEN** they find a clear description of the flow Frontend → BFF → API → SQLite and the folder structure (e.g. `src/` for frontend, `backend/api/` and `backend/bff/` with Controllers, Services, etc.)
- **AND** they can identify where the API, BFF, and frontend code live

#### Scenario: Leitor vê a stack e comandos de build

- **WHEN** a developer looks for technology stack and build instructions
- **THEN** the README lists Node.js, npm, .NET 9, Vite, React, TypeScript, and other key technologies with versions where relevant
- **AND** it references the main commands: frontend build (`npm run build`), backend build (`dotnet build` in api and bff), and scripts (dev, test, lint)

#### Scenario: Leitor segue o passo a passo desde o build até ao reset de senha Admin

- **WHEN** a new developer or operator follows the README step-by-step configuration section
- **THEN** the steps cover in order: clone and install dependencies, build and run API and BFF, run frontend, configure Admin email (and first-run account creation), first login and mandatory password change
- **AND** the section includes the optional procedure to recover Admin password (create trigger file, restart API, login with default password and change again)
- **AND** following these steps leads to a working system and ability to log in as Admin and (if needed) recover Admin password

