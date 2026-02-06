# branding (delta)

## ADDED Requirements

### Requirement: Logo uses dice icon plus "noDado RPG" text

The blog logo SHALL be displayed as the "Dice 20 faces 1" icon (from [game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html), by Delapouite, CC BY 3.0) followed by the text "noDado RPG". The icon SHALL appear in the header (site name/link to home) and in the footer (brand area and copyright). The icon SHALL be sized proportionally to the adjacent text and SHALL work in both light and dark themes (e.g. using currentColor or theme-aware asset). The project SHALL include the icon asset (e.g. SVG in public/ or src/assets/) and SHALL provide attribution for the icon (author and CC BY 3.0), e.g. in the footer or README.

#### Scenario: Header shows icon and "noDado RPG"

- **WHEN** a user views the header
- **THEN** the site logo shows the dice icon immediately followed by the text "noDado RPG"
- **AND** the logo links to the home page
- **AND** the icon is visible and correctly colored in the current theme (light or dark)

#### Scenario: Footer shows icon and attribution

- **WHEN** a user views the footer
- **THEN** the brand area and copyright show the dice icon and "noDado RPG"
- **AND** attribution for the icon (Delapouite, game-icons.net, CC BY 3.0) is present, e.g. in the footer or in project documentation
