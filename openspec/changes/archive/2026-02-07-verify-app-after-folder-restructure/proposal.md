# Proposal: Verify application after folder restructure

## Summary

After the repository layout change (frontend in `frontend/`, backend in `backend/`), ensure there is a **documented verification** that the application still works end-to-end. This change adds a short verification checklist (and optionally a script or CI step) so that developers and maintainers can confirm builds and basic flows without regressions.

## Goals

- **Documented verification**: README or a dedicated section (e.g. "Verificar após alterações de estrutura") describes how to confirm the app works: build frontend from `frontend/`, build backend from `backend/api` and `backend/bff`, run all three, and perform a minimal smoke check (e.g. open home page, login, one BFF call).
- **Repeatable**: The same steps can be run after future structural or dependency changes to catch breakage early.
- **Optional automation**: A simple script (e.g. `scripts/verify.sh` or npm script at root) that runs frontend build + tests and backend builds can be added; if not, the manual checklist is sufficient.

## Scope

- **In scope**: Add verification steps to README (or project.md); optionally add a script that runs `cd frontend && npm install && npm run build && npm run test` and `dotnet build` in both backend projects; update DEPLOY-UBUNTU-CADDY.md so deploy and "Atualizar aplicação" steps use `frontend/` paths and mention verification if relevant.
- **Out of scope**: Full E2E test suite; changing application code; OpenSpec folder structure.

## Affected code and docs

- **README.md**: New subsection (e.g. under "Configuração passo a passo" or "Outros comandos") describing how to verify the app after cloning or after structure changes: 1) build frontend (`cd frontend && npm install && npm run build`), 2) run frontend tests (`cd frontend && npm run test`), 3) build backend (`dotnet build` in `backend/api` and `backend/bff`), 4) run API and BFF and frontend dev server, 5) open browser, load home, login, and confirm one authenticated action (e.g. Área do autor).
- **DEPLOY-UBUNTU-CADDY.md**: Already to be updated separately for `frontend/` paths; ensure "Atualizar a aplicação" and build steps use `cd frontend` and `frontend/dist` so that deploy verification is consistent.
- **Optional**: Root or `scripts/` script that runs the above build and test steps and exits with code 0 only if all pass.

## Dependencies and risks

- **No risk**: Documentation and optional script only; no change to application behavior.
- **Dependency**: Depends on the current layout (`frontend/`, `backend/`) from change move-frontend-into-frontend-folder.

## Success criteria

- README (or project.md) contains a clear "Verificação" (or equivalent) section with the steps above.
- DEPLOY-UBUNTU-CADDY.md uses `frontend/` for all frontend paths and is consistent with README.
- `openspec validate verify-app-after-folder-restructure --strict` passes.
