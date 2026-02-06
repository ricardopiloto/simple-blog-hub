# branding (delta)

## ADDED Requirements

### Requirement: Blog name and tagline

The application SHALL use the blog name "1noDado RPG" and the tagline "Contos e aventuras" as the public-facing brand. The document title, meta tags (description, author, og:, twitter:), the hero heading on the home page, and the header/footer logo text SHALL display "1noDado RPG" as the product name and "Contos e aventuras" as the tagline where a tagline is shown. The README and project documentation (e.g. openspec/project.md) SHALL refer to the project by this name and tagline.

#### Scenario: Home page shows new name and tagline

- **WHEN** a user opens the home page
- **THEN** the hero displays the tagline "Contos e aventuras" (e.g. as main heading or subtitle)
- **AND** the header and footer show the brand "1noDado RPG" (e.g. logo or site name)

#### Scenario: Document and meta use new name and tagline

- **WHEN** a user or crawler reads the page title or meta tags (or the README)
- **THEN** the title/meta/README use "1noDado RPG" as the application name
- **AND** "Contos e aventuras" is used as the tagline where a tagline is indicated (e.g. title "1noDado RPG — Contos e aventuras", or README description)
