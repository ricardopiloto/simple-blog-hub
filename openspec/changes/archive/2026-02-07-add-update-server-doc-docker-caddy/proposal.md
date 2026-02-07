# Proposal: Document for updating code on server (Docker/Caddy deployment)

## Summary

Add a **dedicated document** that explains how to **update the application code on the server** when the deployment was done following **DEPLOY-DOCKER-CADDY.md** (Docker for API and BFF, Caddy on host serving frontend and proxying `/bff`). The document will be the single place for operators who only need to perform an update (pull latest code, rebuild backend containers, rebuild frontend and copy to document root, optionally reload Caddy), with optional notes on manual database migrations when upgrading from an older version. The existing section 10 in DEPLOY-DOCKER-CADDY.md already describes the same steps; the new doc will either stand alone (and DEPLOY-DOCKER-CADDY §10 can point to it) or expand that content with more context and references.

## Goals

- **Operator clarity**: Anyone who installed the blog using DEPLOY-DOCKER-CADDY.md can find a clear, focused guide to update the code on the server (git pull, rebuild Docker images, rebuild frontend, copy assets, optional Caddy reload).
- **Single reference**: The new document will reference DEPLOY-DOCKER-CADDY.md for initial setup and prerequisites; it will not duplicate the full deploy flow, only the update flow.
- **Optional migrations**: If the project provides manual migration scripts (e.g. for ViewCount or other schema changes), the update doc can mention when and how to run them when upgrading from an older version.

## Scope

- **In scope**: Create one new file (e.g. `ATUALIZAR-SERVIDOR-DOCKER-CADDY.md` or `UPDATE-DEPLOY-DOCKER-CADDY.md`) at the repository root that describes the update procedure for the Docker/Caddy setup: prerequisites (already deployed per DEPLOY-DOCKER-CADDY.md), steps (cd repo, git pull, docker compose build/up, frontend npm install + build + copy to `/var/www/blog/`, optional Caddy reload), and optionally when to run manual SQL migrations. Add a short cross-reference in DEPLOY-DOCKER-CADDY.md (e.g. in section 10) to this new doc. Add a project-docs spec delta requiring that the repository documents the update procedure for the Docker/Caddy deployment.
- **Out of scope**: Changing the actual update steps or tooling; changing DEPLOY-DOCKER-CADDY.md beyond adding a link to the new doc.

## Affected code and docs

- **New file**: `ATUALIZAR-SERVIDOR-DOCKER-CADDY.md` (or similar name) at repo root — content: audience (operator who already deployed with DEPLOY-DOCKER-CADDY), reference to that doc, step-by-step update (backend + frontend + optional Caddy), optional note on manual migrations (e.g. link to backend/api README or migration script doc).
- **DEPLOY-DOCKER-CADDY.md**: In section 10, add one sentence pointing to the new document for a focused update guide.
- **openspec/specs/project-docs** (via change delta): ADDED requirement that the repository SHALL provide documentation for updating the application on the server when using the Docker/Caddy deployment (as in DEPLOY-DOCKER-CADDY.md).

## Dependencies and risks

- **No risk**: Documentation only. The update procedure is already documented in DEPLOY-DOCKER-CADDY.md §10; this change adds a dedicated doc and a spec requirement.

## Success criteria

- New document exists at repo root and describes the update workflow (pull, backend build/up, frontend build/copy, optional Caddy reload; optional migrations).
- DEPLOY-DOCKER-CADDY.md section 10 references the new doc.
- project-docs spec delta includes a requirement and at least one scenario (e.g. operator who deployed with DEPLOY-DOCKER-CADDY finds the update doc and follows it to update the code).
- `openspec validate add-update-server-doc-docker-caddy --strict` passes.
