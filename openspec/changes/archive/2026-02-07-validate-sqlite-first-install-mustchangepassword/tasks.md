# Tasks: validate-sqlite-first-install-mustchangepassword

## 1. Spec delta: first-install schema requirement

- [x] 1.1 Add in `openspec/changes/validate-sqlite-first-install-mustchangepassword/specs/force-password-change-on-first-login/spec.md` one **ADDED** requirement: on first installation, when the SQLite database is created, the API SHALL apply all EF Core migrations before running any seed or startup logic that inserts users, so that the **Users** table includes the **MustChangePassword** column. Add one scenario: given a fresh SQLite database (no existing file), when the API starts and runs MigrateAsync then seed (EnsureInitialAdminUserAsync), the initial admin user SHALL be created with MustChangePassword = true and no schema error (e.g. "table Users has no column named MustChangePassword") SHALL occur.

## 2. Spec delta: initial admin from api.env (auth)

- [x] 2.1 Add in `openspec/changes/validate-sqlite-first-install-mustchangepassword/specs/auth/spec.md` one **ADDED** requirement: during first-time SQLite setup, the initial admin user SHALL be created with the email from API configuration (e.g. api.env `Admin__Email`) and SHALL have full admin permissions; when not configured, admin@admin.com SHALL be used. Add two scenarios: (1) first install with `Admin__Email` set in api.env creates admin with that email and admin permissions; (2) first install without admin email configured creates admin@admin.com with admin permissions.

## 3. Implementation validation

- [x] 3.1 Confirm **Program.cs** runs `db.Database.MigrateAsync()` before `SeedData.EnsureInitialAdminUserAsync` (and any other seed that writes to Users). If order is correct, no code change; otherwise reorder. *(Verified: Program.cs lines 25–27 run MigrateAsync then EnsureSeedAsync then EnsureInitialAdminUserAsync.)*
- [x] 3.2 Confirm migration **AddMustChangePasswordToUser** exists under `backend/api/Migrations/` and is part of the API project (included in publish/Docker build). *(Verified: `20260206120000_AddMustChangePasswordToUser.cs` present; DEPLOY-DOCKER-CADDY.md already states to use `docker compose build --no-cache api` for first install / after schema changes.)*
- [x] 3.3 Confirm **SeedData.EnsureInitialAdminUserAsync** reads the admin email from `IConfiguration` (e.g. `configuration["Admin:Email"]`, which in production is populated from api.env as `Admin__Email`). Confirm **AdminService** uses the same source for `IsAdminAsync` (e.g. `configuration["Admin:Email"]` with default admin@admin.com). *(Verified: SeedData.cs line 159; AdminService.cs lines 14–15.)*

## 4. Validation

- [x] 4.1 Run `openspec validate validate-sqlite-first-install-mustchangepassword --strict` and resolve any issues.
