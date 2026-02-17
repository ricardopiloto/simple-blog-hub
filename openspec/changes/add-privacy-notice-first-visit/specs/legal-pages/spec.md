# legal-pages — delta for add-privacy-notice-first-visit

## ADDED Requirements

### Requirement: Aviso de privacidade na primeira visita com cookie de preferência (SHALL)

The application SHALL display a **privacy notice** (banner or bar) that informs the user about the **data collected** when they access the site (aligned with the Privacy policy page). The notice SHALL be shown on the **first visit** (or when the user has not yet indicated that they have seen it). To determine whether it is the user's first visit, the application SHALL use a **cookie** stored in the browser: when the user accepts or dismisses the notice, the application SHALL set a cookie (e.g. `privacy_notice_seen`) so that the notice is **not** shown again on subsequent visits until the cookie expires or is removed. The notice SHALL include: (1) brief text about the data collected (e.g. navigation data, technical cookies, preferences); (2) a link to the **Privacy** page (`/privacy`); (3) an action (e.g. button "Entendi" or "Aceitar") for the user to accept or dismiss. After the user accepts or dismisses, the application SHALL write the cookie (e.g. with a long `max-age` such as one year) and SHALL NOT show the notice again while the cookie is present.

#### Scenario: Primeira visita — aviso exibido; após aceitar, cookie definido; visita seguinte — aviso não exibido

- **GIVEN** the user has never visited the site (or has cleared cookies)
- **WHEN** they open any page of the site
- **THEN** a privacy notice (banner or bar) is displayed with text about data collection and a link to /privacy
- **AND** the notice includes a button or action to accept/dismiss (e.g. "Entendi" or "Aceitar")
- **WHEN** the user clicks that action
- **THEN** the notice disappears
- **AND** a cookie is set in the browser (e.g. `privacy_notice_seen`) so that the application can remember the user's choice
- **AND** on the next visit (or on navigating to another page in the same session), the notice is **not** displayed because the cookie is present

#### Scenario: Utilizador que já aceitou o aviso não vê o aviso novamente

- **GIVEN** the user has previously accepted or dismissed the privacy notice (the cookie is set)
- **WHEN** they return to the site or open a new page
- **THEN** the privacy notice is **not** displayed
- **AND** they can access the Privacy policy at any time via the footer link to /privacy
