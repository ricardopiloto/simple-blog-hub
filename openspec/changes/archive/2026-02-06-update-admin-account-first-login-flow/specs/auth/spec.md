# auth (delta)

## ADDED Requirements

### Requirement: Admin can reset user password to default

The system SHALL allow the Admin (the user whose email matches the configured Admin email, e.g. `Admin:Email` / `Admin__Email`) to reset any user's password to a fixed default value (e.g. `senha123`) from the account-management area. The API SHALL expose a reset-password endpoint accessible only to the Admin; when invoked, it SHALL set the target user's password to the default (hashed, e.g. with BCrypt) and mark that user as requiring a password change on next login (e.g. by setting a `MustChangePassword` flag).

#### Scenario: Admin resets another user's password

- **WHEN** the logged-in Admin uses the account-management screen to reset a specific user's password
- **THEN** the frontend calls a protected reset endpoint (via BFF) for that user
- **AND** the API sets the user's password to the default value (e.g. `senha123`) and marks them as requiring a password change on next login

#### Scenario: Non-admin cannot reset another user's password

- **WHEN** a non-admin user attempts to call the reset-password endpoint (directly or via BFF)
- **THEN** the API/BFF return 403 Forbidden
- **AND** no password change occurs for the target user

### Requirement: Forced password change for default-password accounts

Any user account created or reset with the default password (e.g. `senha123`) SHALL be required to change its password on first login after creation or reset. The backend (API and BFF) SHALL track this state (e.g. via a `MustChangePassword` flag) and SHALL include a `must_change_password` boolean in the login response. The frontend SHALL present a blocking "change password" modal whenever `must_change_password === true` and SHALL prevent normal use of the logged-in area until the user successfully sets a new password, after which the backend clears the flag and subsequent logins proceed without the modal.

#### Scenario: Initial Admin must change default password on first login

- **WHEN** the initial Admin account created from configuration logs in using the default password (e.g. `senha123`)
- **THEN** the login response includes `must_change_password: true`
- **AND** the frontend displays a blocking modal requiring the Admin to set a new password
- **AND** after the password is changed successfully, subsequent logins no longer include `must_change_password: true` and the modal is not shown

#### Scenario: New author created by Admin must change default password

- **WHEN** the Admin creates a new author account via the account-management area with the default password (implicit or explicit)
- **AND** the new author logs in for the first time using that default password
- **THEN** the login response includes `must_change_password: true`
- **AND** the frontend displays the blocking password-change modal before allowing access to the author area

#### Scenario: User whose password was reset must change it on next login

- **WHEN** the Admin resets an existing user's password to the default value
- **AND** that user next logs in with the default password
- **THEN** the login response includes `must_change_password: true`
- **AND** the frontend displays the blocking password-change modal until the user sets a new password

