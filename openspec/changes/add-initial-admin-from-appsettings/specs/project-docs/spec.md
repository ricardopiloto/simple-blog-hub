# project-docs (delta)

## ADDED Requirements

### Requirement: Documentation for initial admin account creation

The documentation (README and/or backend API README) SHALL state that, for initial configuration, the email set in `Admin:Email` (appsettings or `Admin__Email` environment variable) is used to automatically create the admin account with a default password (e.g. `senha123`). The user SHALL change this password on first access (e.g. via "Alterar minha senha" in the author area).

#### Scenario: Operator sets up initial system

- **WHEN** an operator reads the documentation to configure the system for the first time
- **THEN** they see that setting `Admin:Email` (or `Admin__Email`) causes the API to create the account with the default password
- **AND** they see that the user must change the password on first login
