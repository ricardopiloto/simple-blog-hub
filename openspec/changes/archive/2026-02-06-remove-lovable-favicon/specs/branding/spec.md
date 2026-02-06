# branding (delta)

## ADDED Requirements

### Requirement: Favicon uses blog dice icon

The site favicon SHALL be the same d20 icon used in the logo (Dice 20 faces 1, Delapouite, game-icons.net, CC BY 3.0), served from `public/dice-icon.svg`. The Lovable heart favicon (`favicon.ico`) SHALL be removed. The document head SHALL include a link element pointing to the dice icon as the favicon (e.g. `link rel="icon" href="/dice-icon.svg" type="image/svg+xml"`).

#### Scenario: Favicon shows dice icon

- **WHEN** a user opens the site in a browser that supports SVG favicon
- **THEN** the tab or bookmark displays the dice icon (d20), not the Lovable heart

#### Scenario: Lovable favicon removed

- **WHEN** the project is built and served
- **THEN** the file `public/favicon.ico` (Lovable heart) is not present
- **AND** the HTML head references the dice SVG as the icon
