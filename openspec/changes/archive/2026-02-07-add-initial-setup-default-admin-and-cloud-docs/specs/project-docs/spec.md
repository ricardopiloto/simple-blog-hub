# project-docs (delta)

## ADDED Requirements

### Requirement: README documents installation in cloud (Linux) environments

The **README** **SHALL** include a section (e.g. "Instalação em ambientes de nuvem (Linux)" or "Deploy em Linux") with instructions for installing and running the application on a **Linux** server or cloud environment. The instructions **SHALL** cover at least: installing prerequisites (Node.js, npm, .NET 9 SDK), cloning the repository, building the frontend and backend (API and BFF), configuring environment variables or appsettings (e.g. connection string, BFF API URL, optional Admin email, JWT secret for production), running the API and BFF (e.g. with dotnet run or published binaries), serving the frontend static build (e.g. via nginx or a reverse proxy), and performing the first login with the default admin (admin@admin.com when not configured) and completing the mandatory password change.

#### Scenario: Operator finds cloud/Linux deployment instructions in README

- **Given** a reader wants to deploy the application on a Linux server or cloud VM
- **When** they open the README
- **Then** they find a dedicated section for installation or deployment in cloud (Linux) environments
- **And** the section includes steps for installing dependencies, building the project, configuring the backend and frontend, running API and BFF, serving the frontend, and first login with the default admin account (admin@admin.com) and password change

#### Scenario: Default first-run experience is documented

- **When** the README describes the first-time setup or cloud deployment
- **Then** it states that by default (without Admin:Email configured) the initial admin account is **admin@admin.com** with the default password, and that the operator must change the password on first access
- **And** it mentions that the database starts without demo content (no demo authors or posts) unless demo seed is explicitly enabled
