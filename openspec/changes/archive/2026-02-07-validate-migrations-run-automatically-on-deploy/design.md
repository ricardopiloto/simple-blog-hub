# Design: Migrations run automatically on deploy

## Problem

The user reports that every time they change something in the database (add a migration), the schema **does not** update automatically when they deploy a new version of the API on the server — they always have to run migrations manually.

## Root cause

The API **already** calls `db.Database.MigrateAsync()` in `Program.cs` at startup (before seed). So the automatic path exists. The most likely reason it does not take effect on deploy is:

- **The API Docker image is not rebuilt.** When the operator runs `docker compose up -d` without first running `docker compose build` (or `docker compose build api`), the **existing image** (built from an older version of the code) is used. That image does **not** contain the new migration assemblies. When the container starts, `MigrateAsync()` runs, but there are no "pending" migrations from that old image's point of view — the database may already be at the version that old image knows, or the new schema is simply not in the image. So the schema does not change until the operator manually runs a SQL script or runs a container with the new code that applies the migration.

**Conclusion**: For migrations to run automatically on deploy, the operator **must rebuild** the API image so it includes the new migration code, then start the container. The update guide (ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) already includes `docker compose build --no-cache` in the steps; we need to make the **reason** explicit (so that operators who sometimes skip the build understand that skipping it prevents schema updates) and ensure the same is stated in DEPLOY-DOCKER-CADDY and the API README.

## Decision: Document rebuild requirement and optional logging

1. **Documentation**: In DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, and backend/api README, add a clear note: when the new version includes **database schema changes** (new EF Core migrations), you **must** rebuild the API image so the new migrations are inside the image; then when the container starts, `MigrateAsync()` will apply them. If you only do `docker compose up -d` without rebuild, the old image runs and the schema will not update.

2. **Optional logging**: After `MigrateAsync()` in Program.cs, log a line (e.g. "Database migrations applied." or "Database is up to date.") so that in `docker compose logs api` the operator can see that the migration step ran. This does not fix the "old image" case but helps confirm when the correct image is running.

3. **No change to MigrateAsync order**: Keep the current order (MigrateAsync → seed → admin user → trigger). No new startup validation is required for this change; the spec already requires migrations before seed (force-password-change-on-first-login).
