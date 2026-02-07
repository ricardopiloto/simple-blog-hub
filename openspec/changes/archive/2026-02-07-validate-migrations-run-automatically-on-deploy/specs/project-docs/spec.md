# project-docs — delta for validate-migrations-run-automatically-on-deploy

## ADDED Requirements

### Requirement: API applies migrations at startup; deploy docs state rebuild required for schema updates

The API SHALL apply EF Core migrations **automatically at startup**: `MigrateAsync()` (or equivalent) SHALL be run before any seed or startup logic that writes to the database, so that the schema is up to date before seed or admin user creation. This is the **primary** way the database schema is updated when a new version of the API is deployed.

The deploy and update documentation (e.g. **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**) SHALL state **clearly** that when a new version includes **database schema changes** (new EF Core migrations), the operator **must rebuild** the API image (e.g. `docker compose build api` or `docker compose build --no-cache`) before starting the containers (`docker compose up -d`). The reason is that the new migration code is compiled into the API image; if the operator only runs `up -d` without rebuilding, the **old image** (without the new migrations) runs, and the schema will **not** be updated automatically. After rebuilding, when the new container starts, `MigrateAsync()` runs and applies any pending migrations. The API README (e.g. backend/api/README.md) SHALL also mention that when deploying with Docker, rebuilding the API image is required for schema updates so that migrations run automatically on startup.

#### Scenario: Deploy with new migration — rebuild and migrations run automatically

- **GIVEN** a new version of the code includes a new EF Core migration (e.g. a new column or table)
- **WHEN** the operator deploys by running `git pull`, then `docker compose build --no-cache api` (or `docker compose build api`), then `docker compose up -d`
- **THEN** the new API image contains the new migration assembly
- **AND** when the API container starts, `MigrateAsync()` runs and applies the pending migration(s)
- **AND** the database schema is updated **without** the operator having to run manual SQL or a separate migration command

#### Scenario: Skipping rebuild prevents schema update

- **GIVEN** a new version includes a new migration but the operator runs only `docker compose up -d` (without rebuilding the API image)
- **THEN** the existing (old) API image runs, which does not contain the new migration code
- **AND** the database schema will **not** be updated automatically; the operator would need to apply the change manually (e.g. SQL script) or rebuild and restart
