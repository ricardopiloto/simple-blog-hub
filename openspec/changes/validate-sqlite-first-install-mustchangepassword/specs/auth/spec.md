# auth — delta for validate-sqlite-first-install-mustchangepassword

## ADDED Requirements

### Requirement: First-time SQLite setup creates admin user from API configuration

During **first-time SQLite setup** (first installation, when the database is created and seed runs), the API SHALL create the **initial admin user** with **full admin permissions** and with the **email** taken from the API configuration. The configuration SHALL be read from the process environment (e.g. when running under systemd or Docker, from `api.env` via `Admin__Email`) or from appsettings (`Admin:Email`). When `Admin:Email` / `Admin__Email` is **not** set or is empty, the system SHALL use the default email **admin@admin.com**. The created user SHALL be the Admin (recognised by the service that determines admin identity, e.g. `IsAdminAsync`, so that the operator can manage accounts, reset passwords, and perform all admin-only operations after first login).

#### Scenario: First install with Admin__Email in api.env creates admin with that email

- **GIVEN** a fresh SQLite database (first installation)
- **AND** the API is configured with an admin email (e.g. in `api.env`: `Admin__Email=admin@example.com`)
- **WHEN** the API starts and runs migrations then seed (e.g. `EnsureInitialAdminUserAsync`)
- **THEN** the system SHALL create exactly one user with email **admin@example.com** (the configured value)
- **AND** that user SHALL have full admin permissions (e.g. `IsAdminAsync` returns true for that user's email)
- **AND** the operator SHALL be able to log in with that email and the default password and then use admin-only features (e.g. Contas, reset passwords, create authors)

#### Scenario: First install without Admin__Email creates default admin@admin.com

- **GIVEN** a fresh SQLite database (first installation)
- **AND** the API has no admin email configured (no `Admin__Email` in api.env and no `Admin:Email` in appsettings, or both empty)
- **WHEN** the API starts and runs migrations then seed
- **THEN** the system SHALL create exactly one user with email **admin@admin.com** (the default)
- **AND** that user SHALL have full admin permissions
- **AND** the operator SHALL be able to log in with admin@admin.com and the default password and use admin-only features
