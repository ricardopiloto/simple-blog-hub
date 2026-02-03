# project-docs (delta)

## ADDED Requirements

### Requirement: API launch profile for alternate port

When the default port 5001 is in use, the API SHALL be runnable without setting environment variables by using an alternate launch profile. A launch profile named `http-5002` SHALL exist in `backend/api/Properties/launchSettings.json` with `applicationUrl` set to `http://localhost:5002`. The API README SHALL document that users can run `dotnet run --launch-profile http-5002` when 5001 is in use and must then configure the BFF with the matching API base URL (e.g. `API__BaseUrl=http://localhost:5002`).

#### Scenario: Run API on port 5002 via launch profile

- **WHEN** port 5001 is in use and the user runs `dotnet run --launch-profile http-5002` in `backend/api`
- **THEN** the API starts listening on http://localhost:5002
- **AND** the README explains that the BFF must be configured to use that URL for the API
