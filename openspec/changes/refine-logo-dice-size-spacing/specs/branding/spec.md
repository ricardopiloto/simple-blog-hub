# branding (delta)

## ADDED Requirements

### Requirement: Logo dice icon size and spacing (refined)

The dice icon in the blog logo SHALL be displayed at a refined larger size for stronger visual presence: in the header Tailwind `h-8 w-8` (32px); in the footer brand area `h-7 w-7` (28px); in the footer copyright line `h-6 w-6` (24px). The space between the dice icon and the text "noDado RPG" SHALL be slightly reduced so the logo reads as a single unit: `gap-1.5` (6px) in the header and footer brand link, and `gap-1` (4px) in the copyright line between icon and text.

#### Scenario: Header logo size and spacing

- **WHEN** a user views the header
- **THEN** the dice icon is displayed at 32px (h-8 w-8)
- **AND** the gap between the icon and "noDado RPG" is 6px (gap-1.5)

#### Scenario: Footer logo size and spacing

- **WHEN** a user views the footer
- **THEN** the dice icon in the brand link is 28px (h-7 w-7) with gap-1.5 to the text
- **AND** the dice icon in the copyright line is 24px (h-6 w-6) with gap-1 between icon and text
