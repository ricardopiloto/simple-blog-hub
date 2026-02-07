# Tasks: validate-migrations-run-automatically-on-deploy

## 1. Confirm startup order in code

- [x] 1.1 Confirm in `backend/api/Program.cs` that `MigrateAsync()` runs at startup before any seed or admin logic, and that the order is correct (migrations → seed → initial admin → trigger file). No change required if already correct; document in the proposal that this is the validated behaviour.

## 2. Document rebuild requirement for schema updates

- [x] 2.1 In **DEPLOY-DOCKER-CADDY.md**, add a short note (e.g. in section 4 "Build e arranque" or in section 10 "Atualizar a aplicação") stating that when the new version includes **alterações na base de dados** (novas migrações EF Core), é necessário **reconstruir** a imagem da API (`docker compose build api` ou `docker compose build --no-cache`) antes de `docker compose up -d`, para que as migrações sejam aplicadas automaticamente ao arranque do contentor. Se não reconstruir, a imagem antiga não contém as novas migrações e o esquema não será atualizado.

- [x] 2.2 In **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**, in the "Backend" or "Passos para atualizar" section, add one sentence emphasising that the `docker compose build --no-cache` step is **necessary for database schema updates**: when there are new EF migrations, the rebuild ensures the new API image contains them, and migrations run automatically when the container starts. If the operator skips the build, the schema will not update.

- [x] 2.3 In **backend/api/README.md**, in the "Migrações manuais" section or in a new short "Migrações automáticas" paragraph, state that the API runs `MigrateAsync()` at startup; when deploying (e.g. Docker), the operator must **rebuild** the API image when there are new migrations so the new code is in the image — then on container start, migrations run automatically. Manual scripts remain an option for operators who prefer to apply schema changes before starting the new API.

## 3. Optional: Log after MigrateAsync

- [x] 3.1 In `backend/api/Program.cs`, after `await db.Database.MigrateAsync();`, add a log line (e.g. `logger.LogInformation("Database migrations applied.");`) so that container logs show that the migration step ran. This helps operators confirm that the automatic path executed.

## 4. Spec delta (project-docs)

- [x] 4.1 Add in `openspec/changes/validate-migrations-run-automatically-on-deploy/specs/project-docs/spec.md` one **ADDED** requirement: the API SHALL apply EF Core migrations automatically at startup (`MigrateAsync()` before seed and other startup logic). The deploy and update documentation (e.g. DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) SHALL state clearly that when a new version includes **database schema changes** (new EF Core migrations), the operator **must rebuild** the API image (e.g. `docker compose build api` or `docker compose build --no-cache`) so the new migration code is in the image; then when the container starts, migrations run automatically. If the image is not rebuilt, the old image runs and the schema will not update. Add a scenario: operator deploys a new version that includes a new migration; they run `git pull`, `docker compose build --no-cache api`, `docker compose up -d`; the new container starts and applies pending migrations at startup; the database schema is updated without manual SQL.

## 5. Validation

- [x] 5.1 Run `openspec validate validate-migrations-run-automatically-on-deploy --strict` and resolve any issues.
