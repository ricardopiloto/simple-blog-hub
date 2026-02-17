# branding — delta for remove-personagens-menu-link

## REMOVED Requirements

### Requirement: Header inclui link "Personagens" para site externo (removido)

The requirement added by change **add-personagens-menu-link** — that the header SHALL include a "Personagens" item after "Índice da História" linking to https://1nodado.com.br in a new tab — is **removed**. The header SHALL NOT include a "Personagens" link to 1nodado.com.br in the desktop nav or in the mobile menu.

#### Scenario: Header não exibe item Personagens

- **GIVEN** the user is viewing any page of the blog with the header visible (desktop or mobile menu open)
- **WHEN** they look at the navigation items
- **THEN** there is no "Personagens" item in the header
- **AND** the item that follows "Índice da História" is either "Área do autor" / "Contas" / "Sair" (when authenticated) or "Login" (when not), not "Personagens"

## ADDED Requirements

### Requirement: Logo/título do header redireciona para https://1nodado.com.br (SHALL)

The **logo/title** in the header (dice icon + "noDado RPG" text) SHALL be a link to **https://1nodado.com.br** (external site). The link SHALL open in the **same tab** (no `target="_blank"`), so that clicking the title navigates the user away from the blog to the main site. The visual appearance of the logo (icon, text, spacing) SHALL remain unchanged; only the destination of the link changes from the blog home (`/`) to https://1nodado.com.br.

#### Scenario: Utilizador clica no título e é redirecionado para 1nodado.com.br

- **GIVEN** the user is viewing any page of the blog with the header visible
- **WHEN** they click the logo/title (icon + "noDado RPG" text) in the header
- **THEN** the browser navigates to **https://1nodado.com.br** in the same tab
- **AND** the current blog page is replaced by the 1nodado.com.br page
