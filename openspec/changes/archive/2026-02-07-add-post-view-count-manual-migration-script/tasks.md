# Tasks: add-post-view-count-manual-migration-script

## 1. Add SQL migration script

- [x] 1.1 Create a SQL script file (e.g. `backend/api/Migrations/Scripts/add_view_count_to_posts.sql`) containing the SQLite statement to add the ViewCount column: `ALTER TABLE Posts ADD COLUMN ViewCount INTEGER NOT NULL DEFAULT 0;`
- [x] 1.2 Add a short comment or header in the script (or in an adjacent README) stating that this script is for upgrading from a version that did not have the view count feature; run once; if the column already exists (e.g. EF migration was applied), the command will fail and can be ignored.

## 2. Document the script

- [x] 2.1 In README.md or in the deploy docs (DEPLOY-UBUNTU-CADDY.md / DEPLOY-DOCKER-CADDY.md), add a short section (e.g. "Migração manual: ViewCount" or "Upgrade: adicionar coluna ViewCount") that explains: (1) when to use the script (upgrade from a version without post view count); (2) how to run it (e.g. `sqlite3 /path/to/blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql` or equivalent); (3) that if the column already exists, the script will fail and the operator should skip it or ignore the error.
- [x] 2.2 Optionally mention in openspec/project.md that an optional manual SQL script is available for adding the ViewCount column when upgrading.

## 3. Spec and validation

- [x] 3.1 Add a spec delta under `openspec/changes/add-post-view-count-manual-migration-script/specs/project-docs/spec.md` requiring that the repository provides an optional manual SQL migration script for adding the ViewCount column to the Posts table and documents when and how to run it (upgrade from previous version).
- [x] 3.2 Run `openspec validate add-post-view-count-manual-migration-script --strict` and resolve any issues.
