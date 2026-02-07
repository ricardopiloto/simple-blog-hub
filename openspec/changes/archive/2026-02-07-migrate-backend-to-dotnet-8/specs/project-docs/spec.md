# project-docs — delta for migrate-backend-to-dotnet-8

## MODIFIED Requirements

### Requirement: Backend API build documented and SDK pinned

The backend API project (`backend/api`) SHALL be buildable with the **.NET 8 SDK**. A `global.json` in the backend tree SHALL specify the SDK version (e.g. 8.0.x) so that `dotnet build` uses a consistent SDK when multiple versions are installed. The API README (`backend/api/README.md`) SHALL include a **Build** section with explicit commands (`dotnet restore`, `dotnet build`) and a **Troubleshooting** section describing what to do when the build fails (check `dotnet --version`, run `dotnet clean` and `dotnet restore`, link to .NET 8 SDK download).

#### Scenario: Build with correct SDK

- **WHEN** a developer runs `dotnet build` in `backend/api` with .NET 8 SDK installed
- **THEN** the build succeeds
- **AND** `global.json` (if present) ensures the 8.0.x SDK is selected when multiple SDKs exist

#### Scenario: Troubleshooting documented

- **WHEN** a developer opens `backend/api/README.md`
- **THEN** they find a Build section with restore and build commands
- **AND** they find a Troubleshooting section with steps to resolve build failures (version check, clean, restore) and reference to .NET 8 SDK

### Requirement: README and project.md are comprehensive and consistent

The repository SHALL maintain both **README.md** and **openspec/project.md** so that they accurately describe the current system. Both SHALL state that the **backend** (API and BFF) uses the **.NET 8** SDK and runtime (not .NET 9). Tech stack, requirements, and install instructions SHALL reference .NET 8 (e.g. download link for .NET 8).

#### Scenario: Reader finds .NET 8 in both documents

- **WHEN** a developer or agent reads the README and then openspec/project.md
- **THEN** both documents state that the backend is .NET 8
- **AND** requirements and links point to .NET 8 SDK installation
