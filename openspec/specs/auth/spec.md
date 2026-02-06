# auth Specification

## Purpose
TBD - created by archiving change add-auth-and-authors-area. Update Purpose after archive.
## Requirements
### Requirement: User and author identity

The system SHALL maintain a User entity linked one-to-one to an Author. Each author that can log in MUST have exactly one User with Email, PasswordHash, and AuthorId. The API SHALL store passwords as a secure hash (e.g. BCrypt or ASP.NET Identity) and SHALL NOT return the hash to clients.

#### Scenario: User exists for author

- **WHEN** an author is allowed to access the area logada
- **THEN** there exists a User record with Email, PasswordHash, and AuthorId referencing that Author

#### Scenario: Password stored as hash

- **WHEN** a User is created or password is set
- **THEN** only a hash of the password is stored; the plain password is never persisted

### Requirement: Login and token issuance

The BFF SHALL expose a login endpoint that accepts email and password, validates credentials against the API, and returns a JWT and author data on success. The JWT payload SHALL include UserId and AuthorId (and optionally email) and SHALL have a finite expiration. The BFF SHALL validate the JWT on protected routes and SHALL pass the caller identity to the API for write operations.

#### Scenario: Login with valid credentials

- **WHEN** the client sends POST /bff/auth/login with valid email and password
- **THEN** the BFF validates with the API, issues a JWT, and returns the token plus author data (e.g. id, name) to the client

#### Scenario: Login with invalid credentials

- **WHEN** the client sends POST /bff/auth/login with invalid email or password
- **THEN** the BFF returns an error (e.g. 401) and does not issue a token

#### Scenario: Protected route without token

- **WHEN** the client calls a protected BFF endpoint without a valid Authorization Bearer token
- **THEN** the BFF returns 401 Unauthorized

#### Scenario: Protected route with valid token

- **WHEN** the client calls a protected BFF endpoint with a valid JWT in Authorization header
- **THEN** the BFF accepts the request and forwards the caller identity (UserId/AuthorId) to the API where required

### Requirement: Area logada and login page

The frontend SHALL provide a login page (e.g. /login) where the user enters email and password. On successful login, the frontend SHALL store the token (e.g. in memory or localStorage) and SHALL redirect to the area autoral. Routes for the area autoral (e.g. /area-autor, /area-autor/posts/novo, /area-autor/posts/:id/editar) SHALL be accessible only when a valid token is present; otherwise the user SHALL be redirected to the login page.

#### Scenario: Access area autoral after login

- **WHEN** the user submits valid credentials on the login page
- **THEN** the token is stored, and the user is redirected to the area autoral (e.g. dashboard)

#### Scenario: Access area autoral without token

- **WHEN** the user navigates to a protected route (e.g. /area-autor) without a valid token
- **THEN** the user is redirected to the login page

#### Scenario: API client sends token

- **WHEN** the frontend calls a BFF endpoint that requires authentication
- **THEN** the request includes the header Authorization: Bearer &lt;token&gt;

### Requirement: Session ends when tab or browser is closed

The frontend SHALL store the authentication token and author data in session storage (e.g. `sessionStorage`) so that the session does not persist after the user closes the browser tab or the browser. When the user reopens the application in a new tab or after closing the browser, they SHALL not be considered logged in and SHALL be redirected to the login page when accessing protected routes.

#### Scenario: Session lost on tab close

- **WHEN** the user has logged in and then closes the browser tab
- **THEN** the stored token and author data are no longer available
- **AND** when the user opens the application again (new tab or new session), they are not authenticated and must log in again to access the area autoral

#### Scenario: Session lost on browser close

- **WHEN** the user has logged in and then closes the browser (all windows)
- **THEN** the stored token and author data are no longer available
- **AND** when the user opens the application again, they are not authenticated and must log in again to access the area autoral

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

