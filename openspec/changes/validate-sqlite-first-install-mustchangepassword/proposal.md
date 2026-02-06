# Proposal: Validate SQLite first install includes MustChangePassword column

## Summary

Ensure that on **first installation**, when the SQLite database is created, the schema includes the **MustChangePassword** column on the Users table. This is validated by a spec requirement and a scenario so that deployments (e.g. Docker, systemd, or local dotnet run) that create a fresh database apply all EF Core migrations—including `AddMustChangePasswordToUser`—before any seed or startup logic runs, allowing the initial admin to be created with `MustChangePassword = true` without errors.

## Goals

- **Spec clarity**: The force-password-change-on-first-login (or auth) capability explicitly requires that first-time SQLite creation results in a Users table that has the MustChangePassword column.
- **Validation**: A scenario documents the expected behavior: fresh DB → API startup runs MigrateAsync then seed → initial admin is created with MustChangePassword set, and no schema mismatch occurs.
- **Admin from config**: During first SQLite setup, the initial admin user SHALL be created with **admin permissions** and with the **email** (and identity) defined in the API configuration (e.g. `api.env`: `Admin__Email`); when not set, the default **admin@admin.com** SHALL be used. This guarantees that deploy-time configuration (api.env) drives who is the Admin from the first run.
- **Deploy safety**: Documentation and implementation already apply migrations before seed (Program.cs order); this change makes the requirement explicit in OpenSpec so that future changes (e.g. new migrations or build artifacts) do not regress first-install behavior.

## Scope

- **In scope**: Add one requirement and one scenario to the force-password-change-on-first-login spec (via a change delta) stating that first-time SQLite creation SHALL apply all EF Core migrations so the Users table includes MustChangePassword before seed runs; add an **auth** spec delta requiring that during first-time SQLite setup the initial admin user is created with the email from API configuration (e.g. api.env `Admin__Email`) and has full admin permissions, defaulting to admin@admin.com when not configured; add tasks to confirm implementation (Program.cs order, migration present, SeedData and AdminService reading Admin:Email / Admin__Email).
- **Out of scope**: Changing application code (unless validation finds a defect); adding new migrations; Docker or deploy doc changes beyond any note that “first install must use up-to-date migrations.”

## Affected code and docs

- **openspec/specs/force-password-change-on-first-login**: One ADDED requirement (first-install schema includes MustChangePassword) and one scenario (fresh DB, API start, seed creates admin with MustChangePassword).
- **openspec/specs/auth**: One ADDED requirement (first-time SQLite setup creates initial admin user from API configuration—api.env `Admin__Email` or default admin@admin.com—with full admin permissions) and scenarios.
- **backend/api/Program.cs**: Already runs `MigrateAsync()` before `EnsureInitialAdminUserAsync`; no change required if order is correct.
- **backend/api/Migrations/**: Migration `20260206120000_AddMustChangePasswordToUser.cs` must remain and be applied on first run; validation task confirms it is present and in the build.

## Dependencies and risks

- **No risk**: Spec-only delta plus validation task. Implementation already applies migrations before seed.
- **Dependency**: Relies on existing migrate-backend-to-dotnet-8 and force-password-change behavior.

## Success criteria

- The change adds an ADDED requirement to force-password-change-on-first-login stating that first-time SQLite creation SHALL result in a Users table that includes the MustChangePassword column (all migrations applied before seed).
- At least one scenario verifies: given a fresh SQLite database, when the API starts and runs migrations then seed, the initial admin user SHALL be created with MustChangePassword = true and no schema error shall occur.
- The change adds an ADDED requirement to **auth** stating that during first-time SQLite setup the initial admin user SHALL be created with the email from API configuration (e.g. api.env `Admin__Email`) and SHALL have full admin permissions; when not configured, admin@admin.com SHALL be used. At least one scenario verifies that the created user is the Admin (e.g. recognised by IsAdminAsync and can access admin-only operations).
- Tasks include verifying Program.cs order (MigrateAsync before seed), the AddMustChangePasswordToUser migration presence, and that SeedData.EnsureInitialAdminUserAsync and AdminService use configuration (Admin:Email / Admin__Email) for the admin email.
- `openspec validate validate-sqlite-first-install-mustchangepassword --strict` passes.
