## ADDED Requirements

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
