# auth (delta)

## ADDED Requirements

### Requirement: Admin account and account management

The system SHALL identify exactly one Admin account by configuration: the user whose email matches the configured Admin email (e.g. environment variable `Admin__Email` in the API). Only the Admin SHALL be allowed to list, create, update, and delete other user accounts. Any authenticated author SHALL be allowed to update only their own password (not email nor other users). The API SHALL read the Admin email from configuration and SHALL enforce these rules on user-management endpoints. The login response (API and BFF) SHALL include an `is_admin` flag so the frontend can show or hide the account-management area.

#### Scenario: Admin manages users

- **WHEN** the logged-in user's email matches the configured Admin email
- **THEN** they can access the account-management area and list all users
- **AND** they can create new users (email, password, author name), update any user's email or password, and delete users (except possibly themselves, per policy)

#### Scenario: Non-admin cannot manage other users

- **WHEN** the logged-in user's email does not match the configured Admin email
- **THEN** they cannot access the account-management area or call user list/create/update/delete for other users
- **AND** the API returns 403 Forbidden for such attempts

#### Scenario: Author changes own password

- **WHEN** an authenticated author (Admin or not) calls the endpoint to update their own user record with a new password
- **THEN** the API allows the update (only the password field)
- **AND** the author can log in thereafter with the new password

#### Scenario: Login returns is_admin

- **WHEN** the client calls POST /bff/auth/login (or the API login) with valid credentials
- **THEN** the response includes an `is_admin` boolean indicating whether the user's email matches the configured Admin email
- **AND** the frontend uses this to show or hide the account-management area
