# project-docs (delta)

## ADDED Requirements

### Requirement: Document dotnet run port conflict resolution

When the API is run with `dotnet run`, it may fail with "Address already in use" if port 5001 is taken. The API README (`backend/api/README.md`) SHALL document in the Troubleshooting section how to resolve this: (1) run on another port using `ASPNETCORE_URLS=http://localhost:<port> dotnet run` and, if so, configure the BFF with the same API base URL; (2) optionally how to identify and stop the process using port 5001 (e.g. `lsof -i :5001` on macOS/Linux) so the default port can be used.

#### Scenario: User hits port in use

- **WHEN** a user runs `dotnet run` in `backend/api` and port 5001 is already in use
- **THEN** the README Troubleshooting section explains the error and offers at least one solution (use another port with ASPNETCORE_URLS or free the port)
- **AND** if using another port, the user is reminded to set the BFF's API base URL accordingly
