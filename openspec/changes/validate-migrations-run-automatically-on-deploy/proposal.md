# Proposal: Validate and document that migrations run automatically on deploy

## Summary

The API **already** runs EF Core migrations at startup (`MigrateAsync()` in `Program.cs` before seed). When the user deploys a new version of the API on the server, the database **should** be updated automatically — but in practice they often have to apply migrations manually. The most likely cause is that the **API Docker image is not rebuilt** when deploying: if the operator runs only `docker compose up -d` without rebuilding, the **old image** (without the new migration code) keeps running, so no new migrations are applied. This change (1) **validates** that the API startup **always** runs `MigrateAsync()` and that this is the primary way the schema is updated; (2) **documents** clearly in the deploy and update guides that when a new version includes **database schema changes** (new EF Core migrations), the operator **must rebuild** the API image (e.g. `docker compose build --no-cache api` or `docker compose build api`) so the new migration assemblies are in the image; then on the next start, migrations run automatically. Optionally (3) add a **startup check or log** so that it is visible when migrations were applied (e.g. log "Migrations applied" or the current migration version), helping operators confirm that the automatic path worked and making it easier to spot when an old image is running.

## Goals

- **Clarify the automatic path**: The API SHALL apply EF Core migrations at startup. For this to work on deploy, the **deployed image** must contain the latest migration code — i.e. the image must be **rebuilt** when there are new migrations.
- **Documentation**: Deploy and update docs (DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, backend/api README) SHALL state explicitly that after pulling code that includes new migrations, the operator **must** run `docker compose build` (or `docker compose build --no-cache api`) before `docker compose up -d`, so that the new API image includes the new migrations and they run on container start.
- **Visibility (optional)**: Log at API startup that migrations were run (or "Database up to date") so operators can confirm from logs that the schema was updated.

## Scope

- **In scope**: (1) Confirm in code that `MigrateAsync()` runs at startup (it already does) and that the order is: MigrateAsync → seed → admin user → trigger file. (2) Update DEPLOY-DOCKER-CADDY.md and ATUALIZAR-SERVIDOR-DOCKER-CADDY.md (and optionally backend/api README) with a short **"Migrações de base de dados"** or **"Atualizar o esquema"** note: when you deploy a new version that changes the database (new EF migrations), you **must rebuild** the API image so the new migrations are inside the image; then when the container starts, migrations run automatically. If you only do `up -d` without rebuild, the old image runs and the schema will not change. (3) Optionally add a log line after `MigrateAsync()` (e.g. "Database migrations applied" or log pending migrations count) so startup logs show that migrations ran. (4) Spec delta: project-docs (or backend) requiring that the API applies migrations at startup and that deploy documentation states the need to rebuild the image for schema updates.
- **Out of scope**: Changing how EF Core migrations work; adding a separate migration runner job; blocking startup if migrations fail (current behaviour can remain: app may crash and restart, and operators see logs).

## Affected code and docs

- **backend/api/Program.cs**: Optionally add a log after `MigrateAsync()` (e.g. `logger.LogInformation("Database migrations applied.")`) so it is visible in container logs.
- **DEPLOY-DOCKER-CADDY.md**: Add a short section or note (e.g. in "Atualizar a aplicação" or "Comandos úteis") that when the new version includes **alterações na base de dados** (novas migrações EF), é necessário **reconstruir** a imagem da API (`docker compose build api` ou `docker compose build --no-cache`) antes de `up -d`, para que as migrações sejam aplicadas automaticamente ao arranque.
- **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Emphasise that the update steps already include `docker compose build --no-cache` and that this is **required** for database schema updates (migrations run when the new container starts); if the operator skips the build, the schema will not update.
- **backend/api/README.md**: In "Migrações manuais" or a new "Migrações automáticas" note, state that the API runs `MigrateAsync()` at startup; when deploying (e.g. Docker), rebuild the API image so the new migrations are included, then restart — migrations will run automatically.
- **openspec/changes/validate-migrations-run-automatically-on-deploy/specs/project-docs/spec.md**: ADDED requirement that deploy documentation SHALL state that for database schema updates (new EF migrations) the operator must rebuild the API image so migrations run automatically on startup; and that the API applies EF Core migrations at startup.

## Dependencies and risks

- **None**: Documentation and optional logging only; no change to migration logic.

## Success criteria

- Deploy and update docs clearly state: rebuild API image when there are new migrations, then migrations run automatically on start.
- Optional: API logs a message after MigrateAsync so operators can confirm from logs.
- Spec delta and `openspec validate validate-migrations-run-automatically-on-deploy --strict` pass.
