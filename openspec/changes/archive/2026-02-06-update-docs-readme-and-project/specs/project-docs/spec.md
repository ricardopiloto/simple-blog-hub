# project-docs (delta)

## ADDED Requirements

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
