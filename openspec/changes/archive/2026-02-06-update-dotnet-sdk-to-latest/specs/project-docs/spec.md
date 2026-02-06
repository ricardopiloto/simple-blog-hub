# project-docs (delta)

## MODIFIED Requirements

### Requirement: Backend API build documented and SDK pinned

The backend API project (`backend/api`) SHALL be buildable with the .NET 9 SDK. A `global.json` in the backend tree SHALL specify the SDK version (e.g. 9.0.x) so that `dotnet build` uses a consistent SDK when multiple versions are installed. The API README (`backend/api/README.md`) SHALL include a **Build** section with explicit commands (`dotnet restore`, `dotnet build`) and a **Troubleshooting** section describing what to do when the build fails (check `dotnet --version`, run `dotnet clean` and `dotnet restore`, link to .NET 9 SDK download).

#### Scenario: Build with correct SDK

- **WHEN** a developer runs `dotnet build` in `backend/api` with .NET 9 SDK installed
- **THEN** the build succeeds
- **AND** `global.json` (if present) ensures the 9.x SDK is selected when multiple SDKs exist

#### Scenario: Troubleshooting documented

- **WHEN** a developer opens `backend/api/README.md`
- **THEN** they find a Build section with restore and build commands
- **AND** they find a Troubleshooting section with steps to resolve build failures (version check, clean, restore)
