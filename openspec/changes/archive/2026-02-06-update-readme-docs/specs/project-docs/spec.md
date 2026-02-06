# project-docs (delta)

## ADDED Requirements

### Requirement: README describes project and how to run it

The repository SHALL provide a README that describes what the project is and how to run it. The README SHALL include a short project description (e.g. Simple Blog Hub: a frontend-only blog with mock data), the required environment (Node.js and npm), step-by-step instructions to install dependencies and start the development server, and the main npm scripts (e.g. dev, build, test). Optional sections MAY cover deployment or third-party tooling (e.g. Lovable).

#### Scenario: New developer clones and runs the project

- **WHEN** a developer clones the repo and opens the README
- **THEN** they see what the project does (blog, mock data, no backend)
- **AND** they see clear steps: clone, `cd` into directory, `npm install`, `npm run dev`
- **AND** they can run the app locally without needing extra configuration or environment variables for backend

#### Scenario: README commands match package.json

- **WHEN** the README lists npm scripts (e.g. dev, build, test)
- **THEN** each listed script exists in `package.json` and can be executed successfully in a fresh install
