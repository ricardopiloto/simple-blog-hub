# Tasks: verify-app-after-folder-restructure

## 1. Document verification in README

- [x] 1.1 Add a subsection **"Verificar que a aplicação funciona"** (or "Verificação após alterações") in README.md. Include steps: (1) Build do frontend: `cd frontend && npm install && npm run build`; (2) Testes do frontend: `cd frontend && npm run test`; (3) Build do backend: `dotnet build` em `backend/api` e em `backend/bff`; (4) Executar API, BFF e frontend (`cd frontend && npm run dev` e, em outros terminais, `dotnet run` em backend/api e backend/bff); (5) No browser: abrir a página inicial, fazer login e confirmar que a Área do autor ou uma chamada ao BFF funciona. Objetivo: qualquer pessoa possa repetir estes passos após alterações de estrutura ou dependências para confirmar que não há regressões.

## 2. Update DEPLOY-UBUNTU-CADDY.md

- [x] 2.1 Ensure all frontend build and copy steps use the **`frontend/`** directory: clone repo, then run `cd frontend && npm install` and `cd frontend && VITE_BFF_URL=... npm run build`; copy `repo/frontend/dist` to the Caddy document root (e.g. `/var/www/blog.1nodado/dist`). Update sections "Clonar e build do frontend", "Copiar estáticos do frontend", and "Atualizar a aplicação (deploy posterior)" so paths reference `frontend/` and `frontend/dist`.
- [x] 2.2 In "Resumo rápido", set "Build frontend" to something like `cd frontend && VITE_BFF_URL=https://blog.1nodado.com.br npm run build` and note that static files come from `frontend/dist`.

## 3. Optional: verification script

- [x] 3.1 (Opcional) Add a script (e.g. `scripts/verify.sh` or a root `package.json` with a single script that runs from repo root) that executes: `cd frontend && npm run build && npm run test`, then `dotnet build backend/api/BlogApi.csproj` and `dotnet build backend/bff/BlogBff.csproj`. Exit 0 only if all commands succeed. Document the script in the new README verification section. If the team prefers not to add a root package.json or scripts folder, skip this task.

## 4. Validation

- [x] 4.1 Run `openspec validate verify-app-after-folder-restructure --strict` and resolve any issues.
