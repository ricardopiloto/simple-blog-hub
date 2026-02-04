# auth (delta)

## ADDED Requirements

### Requirement: Initial admin account created from configuration

When the API starts, the system SHALL ensure that a user account exists for the email configured in `Admin:Email` (appsettings or environment). If `Admin:Email` is set and no `User` with that email exists, the system SHALL create an `Author` and a `User` for that email with a default password (e.g. a fixed value such as `senha123`), so that the operator can perform the first login. The user SHALL change this password after first access (e.g. via the "Alterar minha senha" section in the author area). The default password SHALL be stored only as a constant or in a single configuration point and SHALL be hashed (e.g. BCrypt) when persisting the user.

#### Scenario: First run with Admin:Email configured

- **WHEN** the API starts and `Admin:Email` is configured (e.g. in appsettings) and no user exists with that email
- **THEN** the system creates an Author and a User for that email with the default password (e.g. `senha123`) hashed
- **AND** the operator can log in with that email and default password and then change the password in the author area

#### Scenario: Admin user already exists

- **WHEN** the API starts and a user already exists with the email configured in `Admin:Email`
- **THEN** the system does not create a duplicate user
- **AND** the existing account and password remain unchanged
