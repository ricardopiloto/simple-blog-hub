# branding (delta)

## ADDED Requirements

### Requirement: Logo dice icon size

The dice icon in the blog logo SHALL be displayed at a size slightly larger than the default, so that it has clear visual presence next to the text "noDado RPG". In the header the icon SHALL use a size equivalent to Tailwind `h-7 w-7` (28px); in the footer brand area `h-6 w-6` (24px); in the footer copyright line `h-5 w-5` (20px). Sizes SHALL remain proportional to the adjacent text in each context.

#### Scenario: Header logo icon size

- **WHEN** a user views the header
- **THEN** the dice icon next to "noDado RPG" is displayed at 28px (h-7 w-7) so it appears slightly larger than before

#### Scenario: Footer logo icon sizes

- **WHEN** a user views the footer
- **THEN** the dice icon in the brand link is displayed at 24px (h-6 w-6)
- **AND** the dice icon in the copyright line is displayed at 20px (h-5 w-5)
