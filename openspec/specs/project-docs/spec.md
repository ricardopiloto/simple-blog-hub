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

The backend API project (`backend/api`) SHALL be buildable with the **.NET 8 SDK**. A `global.json` in the backend tree SHALL specify the SDK version (e.g. 8.0.x) so that `dotnet build` uses a consistent SDK when multiple versions are installed. The API README (`backend/api/README.md`) SHALL include a **Build** section with explicit commands (`dotnet restore`, `dotnet build`) and a **Troubleshooting** section describing what to do when the build fails (check `dotnet --version`, run `dotnet clean` and `dotnet restore`, link to .NET 8 SDK download).

#### Scenario: Build with correct SDK

- **WHEN** a developer runs `dotnet build` in `backend/api` with .NET 8 SDK installed
- **THEN** the build succeeds
- **AND** `global.json` (if present) ensures the 8.0.x SDK is selected when multiple SDKs exist

#### Scenario: Troubleshooting documented

- **WHEN** a developer opens `backend/api/README.md`
- **THEN** they find a Build section with restore and build commands
- **AND** they find a Troubleshooting section with steps to resolve build failures (version check, clean, restore) and reference to .NET 8 SDK

### Requirement: Document dotnet run port conflict resolution

When the API is run with `dotnet run`, it may fail with "Address already in use" if port 5001 is taken. The API README (`backend/api/README.md`) SHALL document in the Troubleshooting section how to resolve this: (1) run on another port using `ASPNETCORE_URLS=http://localhost:<port> dotnet run` and, if so, configure the BFF with the same API base URL; (2) optionally how to identify and stop the process using port 5001 (e.g. `lsof -i :5001` on macOS/Linux) so the default port can be used.

#### Scenario: User hits port in use

- **WHEN** a user runs `dotnet run` in `backend/api` and port 5001 is already in use
- **THEN** the README Troubleshooting section explains the error and offers at least one solution (use another port with ASPNETCORE_URLS or free the port)
- **AND** if using another port, the user is reminded to set the BFF's API base URL accordingly

### Requirement: README and project.md are comprehensive and consistent

The repository SHALL maintain both **README.md** and **openspec/project.md** so that they accurately describe the current system. Both SHALL state that the **backend** (API and BFF) uses the **.NET 8** SDK and runtime (not .NET 9). Tech stack, requirements, and install instructions SHALL reference .NET 8 (e.g. download link for .NET 8).

#### Scenario: Reader finds .NET 8 in both documents

- **WHEN** a developer or agent reads the README and then openspec/project.md
- **THEN** both documents state that the backend is .NET 8
- **AND** requirements and links point to .NET 8 SDK installation

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

### Requirement: README documenta configuração da chave partilhada BFF–API

O **README** **DEVE** (SHALL) incluir instruções para configurar a **chave partilhada** entre o BFF e a API: nome da configuração (ex.: `API:InternalKey` ou variável de ambiente `API__InternalKey`), indicação de que o **mesmo** valor deve ser definido na API e no BFF, recomendação de usar um valor forte e único em produção, e que a chave não é exposta ao frontend. O README **DEVE** indicar que, quando a chave não está configurada, a API aceita pedidos (útil em desenvolvimento local).

#### Scenario: Operador encontra instruções da chave BFF–API no README

- **Quando** um operador ou desenvolvedor consulta o README para configurar a aplicação (em especial para produção ou instalação em cloud)
- **Então** encontra a descrição da configuração da chave partilhada entre BFF e API (nome da variável ou secção appsettings, valor a definir em ambos os serviços)
- **E** entende que em produção deve configurar a chave e que o frontend não tem acesso a ela

### Requirement: README documents installation in cloud (Linux) environments

The **README** **SHALL** include a section (e.g. "Instalação em ambientes de nuvem (Linux)" or "Deploy em Linux") with instructions for installing and running the application on a **Linux** server or cloud environment. The instructions **SHALL** cover at least: installing prerequisites (Node.js, npm, .NET 9 SDK), cloning the repository, building the frontend and backend (API and BFF), configuring environment variables or appsettings (e.g. connection string, BFF API URL, optional Admin email, JWT secret for production), running the API and BFF (e.g. with dotnet run or published binaries), serving the frontend static build (e.g. via nginx or a reverse proxy), and performing the first login with the default admin (admin@admin.com when not configured) and completing the mandatory password change.

#### Scenario: Operator finds cloud/Linux deployment instructions in README

- **Given** a reader wants to deploy the application on a Linux server or cloud VM
- **When** they open the README
- **Then** they find a dedicated section for installation or deployment in cloud (Linux) environments
- **And** the section includes steps for installing dependencies, building the project, configuring the backend and frontend, running API and BFF, serving the frontend, and first login with the default admin account (admin@admin.com) and password change

#### Scenario: Default first-run experience is documented

- **When** the README describes the first-time setup or cloud deployment
- **Then** it states that by default (without Admin:Email configured) the initial admin account is **admin@admin.com** with the default password, and that the operator must change the password on first access
- **And** it mentions that the database starts without demo content (no demo authors or posts) unless demo seed is explicitly enabled

### Requirement: Manual SQL migration script for ViewCount column

The repository SHALL provide an **optional manual SQL migration script** that adds the **ViewCount** column to the **Posts** table (SQLite). The script SHALL be intended for operators or users who are **upgrading from a version that did not include the post view count feature** and who apply schema changes manually instead of relying on EF Core `MigrateAsync()` at startup. The script SHALL add a column equivalent to `ViewCount INTEGER NOT NULL DEFAULT 0`. The README or deploy documentation (e.g. DEPLOY-UBUNTU-CADDY.md, DEPLOY-DOCKER-CADDY.md) SHALL describe **when** to use the script (upgrade from pre–view-count version), **how** to run it (e.g. with `sqlite3` against the blog database file), and that if the column already exists the script may fail and the operator should skip or ignore the error.

#### Scenario: Operator finds and runs the script when upgrading

- **GIVEN** an existing database created by a version of the application that did not have the ViewCount column
- **WHEN** the operator upgrades to a version that includes the post view count feature and prefers to apply the schema change manually (e.g. before starting the new API)
- **THEN** the operator SHALL find a SQL script in the repository (e.g. under `backend/api/Migrations/Scripts/` or documented path) that adds the ViewCount column to Posts
- **AND** the documentation SHALL explain how to run the script (e.g. `sqlite3 blog.db < add_view_count_to_posts.sql`) and that it is run once; if the column already exists, the script will fail and can be ignored

#### Scenario: New install does not require the manual script

- **GIVEN** a new installation (fresh database) or an installation where the EF Core migration for ViewCount has already been applied
- **WHEN** the operator deploys or starts the application
- **THEN** the manual script is **optional** and need not be run; the normal path (EF Core migrations at startup or existing schema) is sufficient
- **AND** running the script when the column already exists is documented as safe to skip (script will fail with "duplicate column" or similar)

### Requirement: Documentation for updating the application on the server (Docker/Caddy)

The repository SHALL provide a **document** that describes how to **update the application code on the server** when the deployment was performed according to **DEPLOY-DOCKER-CADDY.md** (Docker for API and BFF, Caddy on the host serving the frontend and proxying `/bff`). The document SHALL be aimed at operators who have already completed the initial deployment and only need to apply a new version of the code. It SHALL include: (1) pulling the latest code from the repository (e.g. `git pull` in the repo directory); (2) rebuilding and restarting the backend containers (API and BFF), e.g. `docker compose build --no-cache` and `docker compose up -d`; (3) rebuilding the frontend (e.g. `npm install` and `npm run build` with the appropriate `VITE_BFF_URL`) and copying the built assets to the Caddy document root (e.g. `/var/www/blog/`); (4) optionally reloading Caddy when needed. The document MAY reference DEPLOY-DOCKER-CADDY.md for prerequisites and initial setup, and MAY mention when manual database migrations (e.g. SQL scripts for schema upgrades) are required when upgrading from an older version.

#### Scenario: Operator updates code on server using the update document

- **GIVEN** the operator has already deployed the blog on the server following DEPLOY-DOCKER-CADDY.md (directory layout, api.env, bff.env, Caddy configured)
- **WHEN** they want to update the application to the latest code
- **THEN** they can find the dedicated update document (e.g. ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) in the repository
- **AND** by following the steps in that document (pull, rebuild backend containers, rebuild frontend and copy to document root, optional Caddy reload), they successfully update the code on the server
- **AND** the running site reflects the new version without requiring a full re-deploy from scratch

### Requirement: CORS validation and optional config documented; no domain in git

The documentation (README and/or openspec/project.md) SHALL state that **with same-origin deployment** (frontend and BFF served under the same domain, e.g. reverse proxy serving the SPA and proxying `/bff` to the BFF), **no CORS domain configuration is required** for the application to work; the browser treats requests to the same origin as same-origin. The documentation MAY describe an optional BFF configuration (e.g. `Cors__AllowedOrigins`) to restrict CORS to specific origins; when described, it SHALL state that the **domain or origin value is set only on the server** (environment or appsettings not committed to the repository) and **must not be committed to git**. No deployment-specific domain (e.g. blog.1nodado.com.br) SHALL be hardcoded in repository code or in committed configuration files.

#### Scenario: Reader learns that same-origin deploy needs no CORS config

- **WHEN** a deployer or developer reads the README or project.md
- **THEN** they find a clear statement that when the frontend and the BFF are on the same domain (e.g. Caddy proxy), no CORS domain configuration is required for the app to work
- **AND** they understand that CORS applies to cross-origin requests and that same-origin requests do not trigger CORS

#### Scenario: Optional CORS config is server-only

- **WHEN** the documentation describes optional CORS allowed origins configuration (e.g. `Cors__AllowedOrigins`)
- **THEN** it states that the value (e.g. the public URL of the site) is set only on the server (environment variable or non-versioned appsettings)
- **AND** no example or default in the committed repository contains a real deployment domain (e.g. blog.1nodado.com.br); placeholders like "URL do seu domínio" or "https://seu-dominio.com" may be used

### Requirement: Deploy doc clarifies adding Caddy block when file has other sites

When the deploy documentation (e.g. DEPLOY-UBUNTU-CADDY.md) describes how to configure Caddy for the blog (e.g. a server block for blog.1nodado.com.br with static files and `/bff` reverse proxy), it SHALL state clearly that **if the Caddyfile already contains other server blocks** (for other domains or services), the deployer SHALL **add** the blog block to the existing file rather than replacing the entire Caddyfile. This prevents accidental removal of existing site configuration.

#### Scenario: Deployer with existing Caddyfile

- **WHEN** a deployer follows the deploy doc and their server already has a Caddyfile with other server blocks (e.g. for a main site or other subdomains)
- **THEN** the doc explicitly tells them to add the blog block to the existing file, not to replace the whole Caddyfile
- **AND** they can add the snippet without losing their current 1nodado.com.br, foundry.1nodado.com.br, or other blocks

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

