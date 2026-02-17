# branding — delta for add-personagens-menu-link

## ADDED Requirements

### Requirement: Header inclui link "Personagens" para site externo (SHALL)

The **header** navigation SHALL include an item **"Personagens"** immediately **after** "Índice da História", in both the **desktop** nav bar and the **mobile** (hamburger) menu. The item SHALL be an **external link** to **https://1nodado.com.br** that opens in a **new tab** (`target="_blank"`) with `rel="noopener noreferrer"` for security. The link SHALL use the same visual style as the other header nav items (e.g. text size, muted foreground, hover to foreground).

#### Scenario: Utilizador clica em Personagens e abre o site externo numa nova aba

- **GIVEN** the user is viewing any page of the blog with the header visible
- **WHEN** they click the "Personagens" item in the header (desktop or mobile menu)
- **THEN** https://1nodado.com.br opens in a **new browser tab**
- **AND** the current blog tab remains open
- **AND** the external link is opened with rel="noopener noreferrer" (no referrer leakage, no window.opener access)
