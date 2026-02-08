# project-docs — delta for fix-scheduled-publish-at-missing-column

## ADDED Requirements

### Requirement: Manual SQL migration script for ScheduledPublishAt column

The repository SHALL provide an **optional manual SQL migration script** that adds the **ScheduledPublishAt** column to the **Posts** table (SQLite). The script SHALL be intended for operators who are **upgrading from a version that did not include the scheduled-publish feature** (change add-scheduled-publish-post) and who apply schema changes manually instead of relying on EF Core `MigrateAsync()` at startup. The script SHALL add a column equivalent to `ScheduledPublishAt TEXT` (nullable). The README of the API (`backend/api/README.md`) SHALL describe **when** to use the script (e.g. error "no such column: p.ScheduledPublishAt"), **how** to run it (e.g. `sqlite3 blog.db < Migrations/Scripts/add_scheduled_publish_at_to_posts.sql`), and that if the column already exists the script may fail and the operator should skip or ignore the error.

#### Scenario: Operator resolves "no such column: p.ScheduledPublishAt" using documentation

- **GIVEN** the API fails with `SqliteException: no such column: p.ScheduledPublishAt` (e.g. database was not migrated after add-scheduled-publish-post)
- **WHEN** the operator consults the API README (Troubleshooting or Migrações manuais)
- **THEN** they find instructions for this error (rebuild and restart the API so that MigrateAsync() runs, or run the script `add_scheduled_publish_at_to_posts.sql` once)
- **AND** they find the script in the repository at `backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql`
- **AND** after applying the fix (script or rebuild), the API and ScheduledPublishBackgroundService run without that error
