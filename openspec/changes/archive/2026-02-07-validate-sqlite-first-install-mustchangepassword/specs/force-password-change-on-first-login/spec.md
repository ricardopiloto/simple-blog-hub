# force-password-change-on-first-login — delta for validate-sqlite-first-install-mustchangepassword

## ADDED Requirements

### Requirement: First-time SQLite schema includes MustChangePassword column

On **first installation**, when the SQLite database is created, the API SHALL apply **all** EF Core migrations before running any seed or startup logic that inserts into the Users table, so that the Users table includes the **MustChangePassword** column. This ensures that the initial admin user (and any user created by seed) can be persisted with `MustChangePassword = true` without schema errors. The API SHALL run `MigrateAsync()` (or equivalent) before calling seed methods that create or update User records.

#### Scenario: First install creates database with MustChangePassword column

- **GIVEN** a fresh SQLite database (no existing database file, or an empty database with no __EFMigrationsHistory applied)
- **WHEN** the API starts and runs database migration (e.g. `MigrateAsync`) and then runs seed (e.g. `EnsureInitialAdminUserAsync`)
- **THEN** all EF Core migrations SHALL be applied in order, including the migration that adds the **MustChangePassword** column to the Users table
- **AND** the initial admin user SHALL be created with `MustChangePassword = true` without any schema error (e.g. "table Users has no column named MustChangePassword")
- **AND** the application SHALL start successfully and the admin SHALL be able to log in and be prompted to change the default password
