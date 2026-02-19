# auth — delta for notify-session-expired-and-redirect-to-home

## ADDED Requirements

### Requirement: Session expired (401) notification and redirect to home (SHALL)

When the frontend receives a **401 Unauthorized** response from the BFF (e.g. because the JWT has expired or is invalid), the system SHALL make it **clear to the user** that the session has expired and that they must authenticate again. The frontend SHALL: (1) **Clear the session** (logout: remove token and authenticated state) so the UI reflects that the user is no longer logged in; (2) **Display a modal/dialog** with an explicit message such as "A sua sessão expirou. Por favor, autentique-se novamente." (or equivalent) and a button to dismiss (e.g. "Entendido"); (3) **When the user dismisses the modal**, if the current route is the **author area** (`/area-autor` or any subpath, e.g. `/area-autor/contas`, `/area-autor/posts/novo`), the frontend SHALL **redirect the user to the home page** (`/`). If the 401 occurred outside the author area, the frontend MAY redirect to `/` on dismiss for consistency or leave the user on the current page; the modal SHALL always be shown so the user understands why they were logged out.

#### Scenario: User in author area receives 401 — sees modal and is redirected to home

- **GIVEN** the user is logged in and is on a page under the author area (e.g. /area-autor or /area-autor/contas)
- **WHEN** a request to a protected BFF endpoint returns 401 (e.g. token expired)
- **THEN** the frontend clears the session (logout)
- **AND** a modal is displayed with a clear message that the session has expired and the user must authenticate again
- **AND** when the user dismisses the modal (e.g. clicks "Entendido"), the frontend redirects to the **home page** (`/`)
- **AND** the user can then use the "Login" link in the header to authenticate again if desired

#### Scenario: User receives 401 — always sees session-expired message

- **GIVEN** the user had a valid token and any request (e.g. list posts, save post, delete post) returns 401
- **WHEN** the frontend handles the 401
- **THEN** the session is cleared and a **modal is always shown** with the session-expired message
- **AND** the user is not redirected to the login page without first seeing this explanation; when in the author area, they are redirected to home after dismissing the modal
