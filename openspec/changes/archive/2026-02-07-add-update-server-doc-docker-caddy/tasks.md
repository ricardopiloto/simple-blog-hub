# Tasks: add-update-server-doc-docker-caddy

## 1. New update document

- [x] 1.1 Create `ATUALIZAR-SERVIDOR-DOCKER-CADDY.md` at the repository root. The document SHALL: (1) state that it is for operators who have already deployed the blog using **DEPLOY-DOCKER-CADDY.md**; (2) list prerequisites (same directory layout and env files as in that doc); (3) provide step-by-step instructions to update: `cd` to repo, `git pull`, `docker compose build --no-cache`, `docker compose up -d`, then frontend `cd frontend`, `npm install`, build with `VITE_BFF_URL` set, and copy `dist` to `/var/www/blog/`; (4) mention optional `sudo systemctl reload caddy`; (5) optionally mention that when upgrading from an older version, manual database migrations (if any) may be required and point to backend/api README or migration script documentation.

## 2. Cross-reference in DEPLOY-DOCKER-CADDY.md

- [x] 2.1 In DEPLOY-DOCKER-CADDY.md, in section 10 ("Atualizar a aplicação (deploy posterior)"), add a short sentence at the beginning or end pointing to the new document (e.g. "Para um guia dedicado apenas à atualização, ver **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**.").

## 3. Spec delta (project-docs)

- [x] 3.1 Add in `openspec/changes/add-update-server-doc-docker-caddy/specs/project-docs/spec.md` one **ADDED** requirement: the repository SHALL provide a document that describes how to **update the application code on the server** when the deployment follows the Docker/Caddy setup described in DEPLOY-DOCKER-CADDY.md. The document SHALL include pulling the latest code, rebuilding and restarting the backend containers (API and BFF), rebuilding the frontend and copying the built assets to the Caddy document root, and optionally reloading Caddy. Add one scenario: an operator who has already deployed using DEPLOY-DOCKER-CADDY.md finds this update document and successfully updates the code on the server by following its steps.

## 4. Validation

- [x] 4.1 Run `openspec validate add-update-server-doc-docker-caddy --strict` and resolve any issues.
