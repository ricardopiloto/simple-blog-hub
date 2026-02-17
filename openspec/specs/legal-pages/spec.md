# legal-pages Specification

## Purpose
TBD - created by archiving change add-privacy-and-terms-pages. Update Purpose after archive.
## Requirements
### Requirement: Páginas Privacidade e Termos de Uso existem e são acessíveis (SHALL)

The application SHALL provide two **static legal pages** accessible via the routes **/privacy** (Privacidade) and **/terms** (Termos de Uso). The footer already links to these routes; the application SHALL render a dedicated page for each route instead of the 404 page. Both pages SHALL use the same layout as the rest of the site (e.g. the shared `Layout` component with header and footer). The content SHALL be in **Brazilian Portuguese** and SHALL be tailored to a **blog of RPG tales and adventures** (contos e aventuras de RPG) with **operator in Brazil**: privacy policy aligned with **LGPD** (Lei Geral de Proteção de Dados); terms of use under **Brazilian law** and jurisdiction in Brazil; readers and authors, no sale of personal data, optional theme preference storage.

#### Scenario: Link Privacidade no footer leva à página de política de privacidade

- **GIVEN** the user is on any page of the site
- **WHEN** they click "Privacidade" in the footer (link to /privacy)
- **THEN** they are taken to /privacy
- **AND** a page is displayed with a title such as "Política de Privacidade" (or "Privacidade") and structured content (sections with headings and paragraphs)
- **AND** the page uses the same header and footer as the rest of the site

#### Scenario: Link Termos de Uso no footer leva à página de termos

- **GIVEN** the user is on any page of the site
- **WHEN** they click "Termos de Uso" in the footer (link to /terms)
- **THEN** they are taken to /terms
- **AND** a page is displayed with a title such as "Termos de Uso" and structured content (sections with headings and paragraphs)
- **AND** the page uses the same header and footer as the rest of the site

### Requirement: Conteúdo da página Privacidade cobre secções mínimas (SHALL)

The **Privacidade** page SHALL include at least the following sections (or equivalent), in Brazilian Portuguese: **responsible** (who operates the site and contact for privacy questions); **data collected** (what data is collected for readers and for authors, e.g. account data, navigation); **purpose** (why data is used: operating the blog, authentication, improving experience); **legal basis** (mention of **LGPD** bases, e.g. performance of the service, consent where applicable); **cookies and similar technologies** (brief description, e.g. technical cookies or theme preference only); **sharing** (no sale of data; hosting/infrastructure if applicable); **user rights** (access, correction, deletion, portability, opposition, as per **LGPD**); **retention** (how long data is kept); **changes to the policy** (how updates are communicated); **contact** (for privacy enquiries). The content SHALL be appropriate for a blog with public reading and an author area (login, publications, accounts) and for **users in Brazil** under LGPD.

#### Scenario: Página Privacidade contém seção de contato e direitos (LGPD)

- **GIVEN** the user is on /privacy
- **WHEN** they read the page
- **THEN** they find a section describing user rights under LGPD (e.g. access, correction, deletion, portability)
- **AND** they find a contact section or contact details for privacy-related questions

### Requirement: Conteúdo da página Termos de Uso cobre secções mínimas e referência MIT (SHALL)

The **Termos de Uso** page SHALL include at least the following, in Brazilian Portuguese: **acceptance** (using the site implies acceptance of the terms); **nature of the service** (blog of RPG tales and adventures; public reading and author area); **intellectual property and licensing**: (1) the **source code** of the project repository SHALL be stated to be under the **MIT license** (and may reference the repository link in the footer); (2) **content of posts** (tales, texts) is the responsibility of the respective authors; the operator does not claim ownership of user-created content; **allowed and prohibited conduct** (e.g. no illegal use, no unauthorised access, no abusive scraping); **author area** (authors are responsible for what they publish; account is personal); **external links** (no responsibility for third-party sites); **limitation of liability** (site provided "as is"); **changes to the terms**; **applicable law and jurisdiction**: **Brazilian law** and **jurisdiction in Brazil** (e.g. foro da comarca do responsável); **contact**. The repository license (MIT) SHALL be explicitly mentioned in the Terms.

#### Scenario: Termos de Uso mencionam licença MIT do repositório

- **GIVEN** the user is on /terms
- **WHEN** they read the page
- **THEN** they find a reference to the **MIT license** for the project source code (repository)
- **AND** they find sections on acceptance, nature of the service, and conduct (allowed/prohibited)

#### Scenario: Termos distinguem código (MIT) e conteúdo dos posts (responsabilidade dos autores)

- **GIVEN** the user is on /terms
- **WHEN** they read the intellectual property / licensing section
- **THEN** the code of the repository is described as under MIT
- **AND** the content published by authors (posts, tales) is described as remaining the responsibility of the authors (or under the terms they specify), not automatically under MIT unless stated by the author

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

