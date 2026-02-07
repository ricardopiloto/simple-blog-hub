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

### Requirement: Non-admin users see only own profile in Contas and can edit own bio

Any **authenticated author** (Admin or not) SHALL be able to access the **Contas** screen (e.g. `/area-autor/contas`). **Non-admin** users SHALL see **only their own user** (a single profile) on that screen, not the list of all accounts. The API SHALL provide a "current user" endpoint (e.g. GET /api/users/me or equivalent via BFF) that returns the authenticated user's profile (id, email, author name, author bio) so the frontend can display a single-profile view for non-admin. On the Contas screen, non-admin users SHALL be able to **edit their own author name**, **author bio** (descrição do autor, breve frase exibida na página do artigo), and **password**. The API SHALL allow PUT (or equivalent) on the user resource for the **own** user id (when the authenticated author's user id matches the target id) to update author name, author bio, and password; only the Admin SHALL be allowed to update other users or to update email. The Admin SHALL continue to see the list of all users and to create, edit, reset-password, and delete other accounts.

#### Scenario: Non-admin opens Contas and sees only own profile

- **GIVEN** the user is logged in and is **not** the Admin (their email does not match the configured Admin email)
- **WHEN** they navigate to the Contas screen (e.g. `/area-autor/contas`)
- **THEN** the screen SHALL display only **one** profile (their own: their email, author name, author bio if set)
- **AND** the screen SHALL NOT display the list of other users or the "Nova conta" (create user) action
- **AND** they SHALL see an "Editar" (or equivalent) action to edit that single profile

#### Scenario: Non-admin edits own author bio and change persists

- **GIVEN** the user is logged in as a non-admin author
- **WHEN** they open Contas, click Editar on their profile, change the **author bio** (descrição do autor) field, and save
- **THEN** the API SHALL accept the update (PUT or equivalent for their own user id with the bio field)
- **AND** the new bio SHALL be persisted and SHALL appear in the author's profile and in the post page (author description) when that author has published posts
- **AND** the user SHALL be able to edit their own author name and password in the same way (own profile only)

#### Scenario: Admin sees list of all users in Contas

- **GIVEN** the user is logged in as the Admin (email matches configured Admin email)
- **WHEN** they navigate to the Contas screen
- **THEN** the screen SHALL display the **list of all users** (all accounts)
- **AND** the Admin SHALL see actions to create new users, edit any user (including email, author name, author bio, password), reset password, and delete users (subject to existing policy, e.g. not delete self if applicable)

### Requirement: Área do Autor dashboard does not duplicate Contas or password change

The **Área do Autor** (author dashboard) page SHALL NOT display a **"Contas"** button; access to the Contas screen SHALL be only via the **main navigation** (header), for all authenticated authors. The Área do Autor SHALL NOT display an **"Alterar minha senha"** section; changing the user's password SHALL be done in the **Contas** screen (edit user form). The dashboard SHALL remain focused on listing and managing posts (Novo post, Editar, Excluir), while profile and password are managed in Contas.

#### Scenario: Author uses header for Contas; dashboard shows only posts

- **GIVEN** the user is logged in as an author (Admin or non-admin)
- **WHEN** they open the Área do Autor page
- **THEN** they see only the list of posts and the "Novo post" action (and per-post Editar/Excluir as applicable)
- **AND** they do NOT see a "Contas" button or an "Alterar minha senha" section on that page
- **AND** they can open Contas via the header (menu superior) to edit their profile (author name, author bio) or change their password

### Requirement: Contas menu visible to all authenticated authors

The frontend SHALL display the **"Contas"** menu entry (link or button) to **all authenticated authors** (Admin and non-admin), not only to the Admin. The entry SHALL appear in (1) the **main navigation** (header), in both desktop and mobile layouts, and (2) the **Área do autor** dashboard page, so that any logged-in author can discover and open the Contas screen. On the Contas screen, non-admin users see only their own profile and can edit their author name, author bio, and password; Admin see the list of all accounts. Hiding the Contas entry from non-admin is not permitted, so that the behavior matches the auth requirement that any authenticated author SHALL be able to access the Contas screen.

#### Scenario: Non-admin author sees Contas in header and dashboard

- **GIVEN** the user is logged in as a non-admin author (their email does not match the configured Admin email)
- **WHEN** they view the site header (desktop or mobile) or the Área do autor dashboard page
- **THEN** they SHALL see a "Contas" link or button
- **AND** when they click it, they SHALL navigate to the Contas screen (e.g. `/area-autor/contas`) and see only their own profile (single-user view, "Meu perfil")
- **AND** they SHALL be able to edit their author name, author bio, and password from that screen

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

### Requirement: Author bio in Contas limited to 70 characters

The **author bio** (descrição do autor) field in the **Contas** screen SHALL be limited to **70 characters**. The frontend SHALL enforce this limit in the edit form (e.g. by setting `maxLength={70}` on the input and optionally showing a character counter or hint such as "Máx. 70 caracteres"). The API SHALL reject any attempt to set the bio to a value longer than 70 characters (after trimming): when the request includes a Bio field and its trimmed length is greater than 70, the API SHALL return 400 Bad Request (or equivalent) and SHALL NOT persist the value. This limit applies to both Admin editing any user and to a user editing their own profile. The purpose is to keep the bio as a short tagline displayed on the post page and in the profile.

#### Scenario: User cannot exceed 70 characters in Bio

- **GIVEN** the user is on the Contas screen editing their profile (or the Admin is editing a user)
- **WHEN** they enter or paste text in the "Descrição do autor" (Bio) field
- **THEN** the frontend SHALL prevent input beyond 70 characters (e.g. input maxLength or truncation)
- **AND** if a longer value is somehow submitted (e.g. from another client), the API SHALL reject it with 400 and the bio SHALL NOT be updated
- **AND** a saved bio of at most 70 characters SHALL be displayed correctly in the profile and on the post page

