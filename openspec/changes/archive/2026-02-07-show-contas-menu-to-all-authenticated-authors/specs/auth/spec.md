# auth — delta for show-contas-menu-to-all-authenticated-authors

## ADDED Requirements

### Requirement: Contas menu visible to all authenticated authors

The frontend SHALL display the **"Contas"** menu entry (link or button) to **all authenticated authors** (Admin and non-admin), not only to the Admin. The entry SHALL appear in (1) the **main navigation** (header), in both desktop and mobile layouts, and (2) the **Área do autor** dashboard page, so that any logged-in author can discover and open the Contas screen. On the Contas screen, non-admin users see only their own profile and can edit their author name, author bio, and password; Admin see the list of all accounts. Hiding the Contas entry from non-admin is not permitted, so that the behavior matches the auth requirement that any authenticated author SHALL be able to access the Contas screen.

#### Scenario: Non-admin author sees Contas in header and dashboard

- **GIVEN** the user is logged in as a non-admin author (their email does not match the configured Admin email)
- **WHEN** they view the site header (desktop or mobile) or the Área do autor dashboard page
- **THEN** they SHALL see a "Contas" link or button
- **AND** when they click it, they SHALL navigate to the Contas screen (e.g. `/area-autor/contas`) and see only their own profile (single-user view, "Meu perfil")
- **AND** they SHALL be able to edit their author name, author bio, and password from that screen
