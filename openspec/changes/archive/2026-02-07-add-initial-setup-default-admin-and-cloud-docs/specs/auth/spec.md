# auth (delta)

## ADDED Requirements

### Requirement: Default admin email when not configured

When **Admin:Email** (appsettings or environment `Admin__Email`) is **not** set or is empty, the system **SHALL** use the default email **admin@admin.com** for the initial admin account. The API **SHALL** create the initial admin user with this email (and default password, e.g. `senha123`) on first run when no user with that email exists; the user **SHALL** have `MustChangePassword = true` so that the operator must change the password on first login. The service that determines whether a user is the Admin (e.g. IsAdminAsync) **SHALL** use this same default email when Admin:Email is not configured, so that the account created at first run is recognised as Admin without any configuration.

#### Scenario: First run without Admin:Email configured creates admin@admin.com

- **Given** the API is started for the first time (empty database or no user with the default admin email) and **Admin:Email** is not set in configuration
- **When** the application runs the initial admin creation logic
- **Then** the system creates an Author and a User with email **admin@admin.com** and the default password (e.g. `senha123`), with MustChangePassword = true
- **And** the operator can log in with admin@admin.com and the default password and is required to change the password in the modal on first access
- **And** that user is recognised as Admin (e.g. IsAdminAsync returns true for that author)

#### Scenario: Admin password reset trigger works with default admin email

- **Given** Admin:Email is not configured (so the admin email is admin@admin.com)
- **When** the operator creates the admin password reset trigger file and restarts the API
- **Then** the API resets the password of the user with email **admin@admin.com** to the default and sets MustChangePassword = true
- **And** the trigger file is removed after processing
