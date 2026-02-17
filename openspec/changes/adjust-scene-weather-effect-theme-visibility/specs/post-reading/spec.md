# post-reading — delta for adjust-scene-weather-effect-theme-visibility

## MODIFIED Requirements

### Requirement: Efeito visual de clima (chuva ou neve) com diferenciação por tema (SHALL)

The visual effect for **rain** or **snow** on the article page SHALL remain **discrete** (low opacity, does not obstruct reading) and SHALL **not** block user interaction (e.g. pointer-events: none on the overlay). In addition, the effect SHALL **differentiate by theme** (light vs. dark) so that visibility is adequate in both modes: (1) **Dark theme** — the current appearance and styling (e.g. foreground color, default opacity) SHALL be preserved; (2) **Light theme** — the particles (rain and snow) SHALL use a **color and/or opacity** that make them **clearly visible** against the light background (e.g. a darker gray or neutral tone, and optionally slightly higher opacity), so that the effect is easy to see without ceasing to be discrete. This ensures that readers using the light theme can perceive the atmosphere effect as well as those using the dark theme.

#### Scenario: Tema claro — efeito de chuva/neve bem visível

- **GIVEN** the user has the **light theme** active and is reading an article whose content triggers the rain or snow effect
- **WHEN** the effect is displayed
- **THEN** the rain or snow particles are **clearly visible** (e.g. darker color and/or sufficient opacity against the light background)
- **AND** the effect remains discrete and does not obstruct reading

#### Scenario: Tema escuro — efeito mantém aparência atual

- **GIVEN** the user has the **dark theme** active and is reading an article whose content triggers the rain or snow effect
- **WHEN** the effect is displayed
- **THEN** the appearance and behaviour of the effect are **unchanged** from the current implementation (e.g. foreground color, default opacity)
- **AND** the effect remains visible and discrete as before
