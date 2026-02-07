# Proposal: Add manual SQL migration script for ViewCount (post view count)

## Summary

Provide a **standalone SQL migration script** that adds the **ViewCount** column to the **Posts** table. This is for operators or users who are **upgrading from a version that did not include the post view count feature** and who prefer to apply the schema change manually (e.g. before deploying the new API, or in environments where EF Core `MigrateAsync()` is not used at startup). The script is **optional**: the normal upgrade path remains applying the EF Core migration (from change add-post-view-count-for-logged-in-users) when the API starts.

## Goals

- **Script**: A single, runnable SQL script (SQLite) that adds `ViewCount INTEGER NOT NULL DEFAULT 0` to the `Posts` table.
- **Documentation**: Clear instructions on when to use the script (upgrade from pre–view-count version) and that it must be run only once (or not at all if the column already exists; SQLite will error if the column exists, and that is documented).
- **Placement**: Script lives in the repository (e.g. under `backend/api/Migrations/Scripts/` or `backend/api/Sql/`) and is referenced from the README or deploy docs so that operators upgrading from an older version can find it.

## Scope

- **In scope**: Add one SQL file (e.g. `add_view_count_to_posts.sql`), document it in README or in the deploy doc (DEPLOY-UBUNTU-CADDY.md / DEPLOY-DOCKER-CADDY.md) under an "Upgrade" or "Migrações manuais" section; add a short spec delta (project-docs) requiring the script and its documentation.
- **Out of scope**: Changing EF Core migrations or the add-post-view-count-for-logged-in-users implementation; automation (e.g. CI) that runs the script.

## Affected code and docs

- **New file**: e.g. `backend/api/Migrations/Scripts/add_view_count_to_posts.sql` (or `backend/api/Sql/`) containing the single statement: `ALTER TABLE Posts ADD COLUMN ViewCount INTEGER NOT NULL DEFAULT 0;`
- **README.md** or **DEPLOY-UBUNTU-CADDY.md** / **DEPLOY-DOCKER-CADDY.md**: Short section describing when to run the script (upgrade from version without view count) and that if the column already exists (e.g. EF migration was applied), the script will fail and should be skipped.
- **openspec/project.md** (optional): One line mentioning that an optional manual SQL script exists for adding ViewCount when upgrading.

## Dependencies and risks

- **Dependency**: Schema change is defined in change **add-post-view-count-for-logged-in-users** (ViewCount on Post). This change only adds an alternative, manual way to apply that same schema change.
- **Risk**: None if the script is run once; running it twice on SQLite will fail (column already exists), which is documented so operators know to skip or ignore the error.

## Success criteria

- The repository contains a SQL script that adds the ViewCount column to Posts and is documented (when to use it, run once, skip if column exists).
- `openspec validate add-post-view-count-manual-migration-script --strict` passes.
