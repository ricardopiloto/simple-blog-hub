# Tasks: move-frontend-into-frontend-folder

## 1. Create frontend directory and move files

- [x] 1.1 Create the directory `frontend/` at the repository root.
- [x] 1.2 Move the following from root into `frontend/`: `src/`, `public/`, `index.html`, `package.json`, `package-lock.json`, `bun.lockb` (if present), `vite.config.ts`, `vitest.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `components.json`, `eslint.config.js`, `.env.example` (if present). Ensure no frontend config or source remains at root.
- [x] 1.3 Verify that, after the move, the root contains only README.md, .gitignore, openspec/, and optional AGENTS.md (or similar); no `src/`, `public/`, or frontend config files at root.

## 2. Verify frontend build and tests

- [x] 2.1 From the repository root, run `cd frontend && npm install` and confirm dependencies install without error.
- [x] 2.2 Run `cd frontend && npm run build` and confirm the production build succeeds and produces `frontend/dist/`.
- [x] 2.3 Run `cd frontend && npm run test` and confirm all tests pass.
- [x] 2.4 Optionally run `cd frontend && npm run lint` and fix any newly reported issues.

## 3. Update README.md

- [x] 3.1 Update the "Estrutura de pastas" / "Estrutura de arquivos" section so that the frontend is described as living under `frontend/` (e.g. `frontend/src/`, `frontend/public/`, `frontend/package.json`) and the root layout shows `frontend/` and `backend/` at top level.
- [x] 3.2 Update all step-by-step and command instructions: frontend commands (npm install, npm run dev, npm run build, npm run test, npm run lint, npm run preview) must be run from the `frontend/` directory (e.g. "Na raiz: `cd frontend && npm run dev`" or "Em `frontend`: `npm run dev`").
- [x] 3.3 Update the file tree in the README (if present) so that the root lists `frontend/` and `backend/` and the frontend tree is under `frontend/`.
- [x] 3.4 Ensure the "Requisitos", "Configuração passo a passo", "Instalação em ambientes de nuvem", and "Outros comandos" sections consistently reference `frontend/` for npm and `backend/api` and `backend/bff` for .NET.

## 4. Update openspec/project.md

- [x] 4.1 In "Estrutura de pastas" (or equivalent), state that the frontend lives under **`frontend/`** (e.g. `frontend/src/`, path alias `@/` for `frontend/src/`) and the backend under **`backend/`**.
- [x] 4.2 Update "Testing Strategy" and any path references: test setup and globs refer to `frontend/src/` (e.g. `frontend/src/test/setup.ts`, tests in `frontend/src/**/*.{test,spec}.{ts,tsx}`); commands are run from `frontend/`.
- [x] 4.3 Ensure tech stack and external dependencies still accurately describe where code lives (frontend in `frontend/`, backend in `backend/`).

## 5. Optional .gitignore and CI

- [x] 5.1 Review root `.gitignore`: ensure `node_modules` and `dist` still apply (they are root-relative and will match `frontend/node_modules` and `frontend/dist`). Add a brief comment if desired (e.g. that frontend deps and build output are under `frontend/`).
- [x] 5.2 If the repository has CI or scripts that run `npm install`, `npm run build`, or `npm run test` from the root, update them to run from `frontend/` (e.g. `cd frontend && npm run build`).

## 6. Validation

- [x] 6.1 Run `openspec validate move-frontend-into-frontend-folder --strict` and resolve any reported issues.
- [x] 6.2 Confirm backend build unchanged: `dotnet build` in `backend/api` and `dotnet build` in `backend/bff` both succeed.
