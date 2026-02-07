# project-docs — delta for add-update-server-doc-docker-caddy

## ADDED Requirements

### Requirement: Documentation for updating the application on the server (Docker/Caddy)

The repository SHALL provide a **document** that describes how to **update the application code on the server** when the deployment was performed according to **DEPLOY-DOCKER-CADDY.md** (Docker for API and BFF, Caddy on the host serving the frontend and proxying `/bff`). The document SHALL be aimed at operators who have already completed the initial deployment and only need to apply a new version of the code. It SHALL include: (1) pulling the latest code from the repository (e.g. `git pull` in the repo directory); (2) rebuilding and restarting the backend containers (API and BFF), e.g. `docker compose build --no-cache` and `docker compose up -d`; (3) rebuilding the frontend (e.g. `npm install` and `npm run build` with the appropriate `VITE_BFF_URL`) and copying the built assets to the Caddy document root (e.g. `/var/www/blog/`); (4) optionally reloading Caddy when needed. The document MAY reference DEPLOY-DOCKER-CADDY.md for prerequisites and initial setup, and MAY mention when manual database migrations (e.g. SQL scripts for schema upgrades) are required when upgrading from an older version.

#### Scenario: Operator updates code on server using the update document

- **GIVEN** the operator has already deployed the blog on the server following DEPLOY-DOCKER-CADDY.md (directory layout, api.env, bff.env, Caddy configured)
- **WHEN** they want to update the application to the latest code
- **THEN** they can find the dedicated update document (e.g. ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) in the repository
- **AND** by following the steps in that document (pull, rebuild backend containers, rebuild frontend and copy to document root, optional Caddy reload), they successfully update the code on the server
- **AND** the running site reflects the new version without requiring a full re-deploy from scratch
