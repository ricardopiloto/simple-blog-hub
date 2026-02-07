# project-docs — delta for add-post-view-count-manual-migration-script

## ADDED Requirements

### Requirement: Manual SQL migration script for ViewCount column

The repository SHALL provide an **optional manual SQL migration script** that adds the **ViewCount** column to the **Posts** table (SQLite). The script SHALL be intended for operators or users who are **upgrading from a version that did not include the post view count feature** and who apply schema changes manually instead of relying on EF Core `MigrateAsync()` at startup. The script SHALL add a column equivalent to `ViewCount INTEGER NOT NULL DEFAULT 0`. The README or deploy documentation (e.g. DEPLOY-UBUNTU-CADDY.md, DEPLOY-DOCKER-CADDY.md) SHALL describe **when** to use the script (upgrade from pre–view-count version), **how** to run it (e.g. with `sqlite3` against the blog database file), and that if the column already exists the script may fail and the operator should skip or ignore the error.

#### Scenario: Operator finds and runs the script when upgrading

- **GIVEN** an existing database created by a version of the application that did not have the ViewCount column
- **WHEN** the operator upgrades to a version that includes the post view count feature and prefers to apply the schema change manually (e.g. before starting the new API)
- **THEN** the operator SHALL find a SQL script in the repository (e.g. under `backend/api/Migrations/Scripts/` or documented path) that adds the ViewCount column to Posts
- **AND** the documentation SHALL explain how to run the script (e.g. `sqlite3 blog.db < add_view_count_to_posts.sql`) and that it is run once; if the column already exists, the script will fail and can be ignored

#### Scenario: New install does not require the manual script

- **GIVEN** a new installation (fresh database) or an installation where the EF Core migration for ViewCount has already been applied
- **WHEN** the operator deploys or starts the application
- **THEN** the manual script is **optional** and need not be run; the normal path (EF Core migrations at startup or existing schema) is sufficient
- **AND** running the script when the column already exists is documented as safe to skip (script will fail with "duplicate column" or similar)
