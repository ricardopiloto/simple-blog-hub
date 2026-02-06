# auth (delta)

## ADDED Requirements

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
