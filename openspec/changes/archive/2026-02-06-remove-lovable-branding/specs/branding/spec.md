# branding (delta)

## ADDED Requirements

### Requirement: No creation-tool branding in app or page meta

The application and its HTML entry point SHALL NOT display branding (icons, badges, links) of the tool used to create the project (e.g. Lovable). The document title, meta description, author, and social meta tags (og:, twitter:) SHALL describe the application itself (e.g. Simple Blog Hub), not the creation tool. Build and runtime plugins that inject creation-tool UI (e.g. lovable-tagger) SHALL NOT be used.

#### Scenario: No Lovable icon or branding in the page

- **WHEN** the app is run in development or production
- **THEN** no Lovable badge, icon, or link is visible in the UI
- **AND** the page title and meta tags describe the blog application, not Lovable

#### Scenario: Build without lovable-tagger

- **WHEN** the project is built or dependencies are installed
- **THEN** the lovable-tagger package is not a dependency
- **AND** the Vite config does not use any Lovable plugin

### Requirement: Single creation credit in README

The README SHALL contain at most one reference to the tool used to create the project (e.g. Lovable), stating that it was used for creation. The README SHALL NOT contain instructions for deploying via that tool, configuring domains, or editing the code in that tool’s environment; such content SHALL be removed or replaced so that only the creation credit remains.

#### Scenario: README has only one Lovable reference

- **WHEN** a reader opens the README
- **THEN** they see at most one sentence or line crediting Lovable (or similar) as the creation tool
- **AND** there are no sections dedicated to Lovable deploy, Lovable domains, or editing in Lovable
