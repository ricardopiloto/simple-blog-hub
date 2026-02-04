# auth (delta)

## ADDED Requirements

### Requirement: Author registration with default password (Admin only)

The system SHALL provide an area (e.g. "Contas" or "Cadastro de autores") where the Admin can register new authors. When creating a new author, the Admin SHALL provide only **e-mail** and **name** (author name). The initial password SHALL be a fixed default (e.g. `senha123`); the new user SHALL change it on first access (e.g. via "Alterar minha senha" in the author area). Only the Admin SHALL be allowed to create new authors and to delete existing authors; the API SHALL enforce this on create and delete user endpoints.

#### Scenario: Admin registers new author with email and name only

- **WHEN** the Admin opens the author registration form and submits only e-mail and name (no password field)
- **THEN** the system creates an Author and User with that email and name and the default password (e.g. `senha123`)
- **AND** the new user can log in with that email and default password and must change the password on first access

#### Scenario: Only Admin can create or delete authors

- **WHEN** a non-admin user attempts to create a new author or delete an existing author
- **THEN** the API returns 403 Forbidden (or the frontend does not show the registration/delete actions)
- **AND** only the user whose email matches the configured Admin email can create and delete authors
