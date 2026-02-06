# force-password-change-on-first-login Specification

## Purpose
TBD - created by archiving change spec-force-password-change-on-first-login. Update Purpose after archive.
## Requirements
### Requirement: Mark users who have not changed default password

The system SHALL mark users who have not yet changed the default password so that the first access to the authenticated area can enforce a mandatory password change. The backend SHALL persist this state (e.g. a `MustChangePassword` flag on the user entity). This flag SHALL be set to true when (a) a user is created with the default password (e.g. initial Admin from config, or new authors created by the Admin with password `senha123`), and (b) when an Admin resets a user's password to the default value. The flag SHALL be set to false only after the user successfully changes their password via the mandatory change flow.

#### Scenario: New user created with default password is marked

- **GIVEN** the Admin creates a new user account with the default password (e.g. `senha123`)
- **THEN** the user record SHALL have `MustChangePassword` (or equivalent) set to true
- **AND** the user SHALL not be able to use the authenticated area until they change the password

#### Scenario: User whose password was reset is marked

- **GIVEN** the Admin resets an existing user's password to the default value
- **THEN** that user's record SHALL have `MustChangePassword` set to true
- **AND** on that user's next login, they SHALL be required to change the password before using the authenticated area

### Requirement: Blocking modal on first access when default password not changed

When a user logs in and the backend indicates that they must change their password (e.g. `must_change_password: true` in the login response), the frontend SHALL display a modal that obliges the user to set a new password before using any authenticated area. The modal SHALL be the only content presented to the user until the password change is completed successfully; the user SHALL NOT be able to navigate to or use other authenticated routes or controls until then.

#### Scenario: First access to authenticated area shows modal

- **GIVEN** the user has just logged in with the default password (or after a reset) and the login response includes `must_change_password: true`
- **WHEN** the user would otherwise enter the authenticated area (e.g. after login redirect)
- **THEN** the system SHALL display a "change password" modal as the only visible interface
- **AND** the rest of the authenticated UI (dashboard, posts, etc.) SHALL NOT be accessible until the user successfully changes the password

#### Scenario: Modal cannot be closed until password is changed

- **GIVEN** the blocking "change password" modal is visible (user is authenticated and `must_change_password === true`)
- **THEN** the modal SHALL NOT be dismissible by the user through any of the following: pressing Escape, clicking outside the modal, or any close/dismiss control that would allow the user to skip changing the password
- **AND** the only way to leave the modal SHALL be to submit a valid new password and have the backend accept the change; after a successful change, the backend SHALL clear the "must change password" state and the frontend SHALL close the modal and allow normal use of the authenticated area

#### Scenario: After successful password change modal is cleared

- **GIVEN** the user has completed the mandatory password change successfully
- **THEN** the backend SHALL set `MustChangePassword` to false for that user
- **AND** the frontend SHALL clear the local "must change password" state and SHALL no longer show the blocking modal for that session
- **AND** on subsequent logins with the new password, the login response SHALL NOT include `must_change_password: true` and the modal SHALL NOT be shown

