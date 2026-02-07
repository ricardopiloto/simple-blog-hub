# Proposal: Move frontend into `frontend/` folder

## Summary

Reorganize the repository so that all frontend code and configuration live under a single **`frontend/`** directory, the backend remains under **`backend/`**, and the **root** contains only README, .gitignore, and the openspec tree. This improves clarity and separates concerns at the filesystem level.

## Goals

- **Root minimal**: Only README.md, .gitignore, and the openspec/ directory (and any root-level workspace/agent files such as AGENTS.md) remain at the repository root.
- **Frontend contained**: Everything needed to build and run the React/Vite app (source, config, assets, lockfiles) moves into `frontend/`.
- **Backend unchanged**: The existing `backend/` layout (api/, bff/, global.json, README) is kept as-is.
- **Openspec unchanged**: The openspec/ folder and its structure (changes/, specs/, project.md) stay at root; only references inside docs (README, project.md) are updated to the new paths.

## Scope

- **In scope**: Moving frontend files into `frontend/`, updating README and openspec/project.md to describe the new layout and commands (e.g. `cd frontend && npm run dev`), updating the project-structure spec and project-docs where they reference paths. No change to backend code or to openspec folder structure.
- **Out of scope**: Changing build tools, adding a root-level wrapper package.json, or modifying CI beyond path updates if any scripts assume frontend at root.

## Affected code and docs

- **New**: Directory `frontend/` containing: `src/`, `public/`, `index.html`, `package.json`, `package-lock.json` (and/or `bun.lockb`), `vite.config.ts`, `vitest.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `components.json`, `eslint.config.js`, `.env.example` (if present).
- **Moved**: All of the above from repository root into `frontend/` (no content change inside files; paths inside frontend configs are already relative to their directory, so they remain valid once in `frontend/`).
- **Updated**: `README.md` (estrutura de pastas, comandos “na raiz” → “em frontend/”, referências a `src/` → `frontend/src/` onde aplicável); `openspec/project.md` (Estrutura de pastas, path alias description, Testing Strategy paths, qualquer referência a `src/` na raiz).
- **Specs**: `openspec/specs/project-structure/spec.md` — MODIFIED to require `frontend/` at root and to state that frontend source lives under `frontend/src/`; `openspec/specs/project-docs/spec.md` — MODIFIED only if it mandates exact path wording (e.g. “frontend na raiz” → “frontend em frontend/”); otherwise covered by README/project.md updates.

## Dependencies and risks

- **Low risk**: Move is mechanical; Vite/TypeScript/ESLint/Vitest resolve paths relative to the config file location, so no code changes inside frontend files are required.
- **Documentation**: README and project.md must be updated so new contributors run `cd frontend && npm install` and `cd frontend && npm run dev` (and similar). Any external doc or deployment guide (e.g. DEPLOY-UBUNTU-CADDY.md) that references repo paths should be updated in a follow-up or in this change if it is versioned.

## Success criteria

- Repository root contains only README.md, .gitignore, openspec/, and optional AGENTS.md (or equivalent).
- All frontend source, config, and assets live under `frontend/`.
- `cd frontend && npm install && npm run build` and `cd frontend && npm run test` succeed.
- Backend build and run unchanged: `dotnet build` in `backend/api` and `backend/bff` still work.
- README and project.md accurately describe the new layout and commands.
- `openspec validate move-frontend-into-frontend-folder --strict` passes.
