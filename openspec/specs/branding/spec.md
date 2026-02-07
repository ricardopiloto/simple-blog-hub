# branding Specification

## Purpose
TBD - created by archiving change add-dice-icon-to-logo. Update Purpose after archive.
## Requirements
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

### Requirement: Logo dice icon size

The dice icon in the blog logo SHALL be displayed at a size slightly larger than the default, so that it has clear visual presence next to the text "noDado RPG". In the header the icon SHALL use a size equivalent to Tailwind `h-7 w-7` (28px); in the footer brand area `h-6 w-6` (24px); in the footer copyright line `h-5 w-5` (20px). Sizes SHALL remain proportional to the adjacent text in each context.

#### Scenario: Header logo icon size

- **WHEN** a user views the header
- **THEN** the dice icon next to "noDado RPG" is displayed at 28px (h-7 w-7) so it appears slightly larger than before

#### Scenario: Footer logo icon sizes

- **WHEN** a user views the footer
- **THEN** the dice icon in the brand link is displayed at 24px (h-6 w-6)
- **AND** the dice icon in the copyright line is displayed at 20px (h-5 w-5)

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

### Requirement: No creation-tool branding in app or page meta

The application and its HTML entry point SHALL NOT display branding (icons, badges, links) of the tool used to create the project (e.g. Lovable). The document title, meta description, author, and social meta tags (og:, twitter:) SHALL describe the application itself (e.g. Simple Blog Hub), not the creation tool. Build and runtime plugins that inject creation-tool UI (e.g. lovable-tagger) SHALL NOT be used.

#### Scenario: No Lovable icon or branding in the page

- **WHEN** the app is run in development or production
- **THEN** no Lovable badge, icon, or link is visible in the UI
- **AND** the page title and meta tags describe the blog application, not Lovable

#### Scenario: Build without lovable-tagger

- **WHEN** the project is built or dependencies are installed
- **THEN** the lovable-tagger package is not a dependency
- **AND** the Vite config does not use any Lovable plugin

### Requirement: Single creation credit in README

The README SHALL contain at most one reference to the tool used to create the project (e.g. Lovable), stating that it was used for creation. The README SHALL NOT contain instructions for deploying via that tool, configuring domains, or editing the code in that tool’s environment; such content SHALL be removed or replaced so that only the creation credit remains.

#### Scenario: README has only one Lovable reference

- **WHEN** a reader opens the README
- **THEN** they see at most one sentence or line crediting Lovable (or similar) as the creation tool
- **AND** there are no sections dedicated to Lovable deploy, Lovable domains, or editing in Lovable

### Requirement: Favicon uses blog dice icon

The site favicon SHALL be the same d20 icon used in the logo (Dice 20 faces 1, Delapouite, game-icons.net, CC BY 3.0), served from `public/dice-icon.svg`. The Lovable heart favicon (`favicon.ico`) SHALL be removed. The document head SHALL include a link element pointing to the dice icon as the favicon (e.g. `link rel="icon" href="/dice-icon.svg" type="image/svg+xml"`).

#### Scenario: Favicon shows dice icon

- **WHEN** a user opens the site in a browser that supports SVG favicon
- **THEN** the tab or bookmark displays the dice icon (d20), not the Lovable heart

#### Scenario: Lovable favicon removed

- **WHEN** the project is built and served
- **THEN** the file `public/favicon.ico` (Lovable heart) is not present
- **AND** the HTML head references the dice SVG as the icon

### Requirement: Blog name and tagline

The application SHALL use the blog name "1noDado RPG" and the tagline "Contos e aventuras" as the public-facing brand. The document title, meta tags (description, author, og:, twitter:), the hero heading on the home page, and the header/footer logo text SHALL display "1noDado RPG" as the product name and "Contos e aventuras" as the tagline where a tagline is shown. The README and project documentation (e.g. openspec/project.md) SHALL refer to the project by this name and tagline.

#### Scenario: Home page shows new name and tagline

- **WHEN** a user opens the home page
- **THEN** the hero displays the tagline "Contos e aventuras" (e.g. as main heading or subtitle)
- **AND** the header and footer show the brand "1noDado RPG" (e.g. logo or site name)

#### Scenario: Document and meta use new name and tagline

- **WHEN** a user or crawler reads the page title or meta tags (or the README)
- **THEN** the title/meta/README use "1noDado RPG" as the application name
- **AND** "Contos e aventuras" is used as the tagline where a tagline is indicated (e.g. title "1noDado RPG — Contos e aventuras", or README description)

### Requirement: Rodapé exibe link para o repositório GitHub do projeto

O **rodapé** da aplicação **deve** (SHALL) exibir um link clicável para o **repositório do projeto no GitHub** (URL canónica: https://github.com/ricardopiloto/simple-blog-hub). O link **deve** abrir numa nova aba (`target="_blank"`) e **deve** usar `rel="noopener noreferrer"`. O texto ou etiqueta do link **deve** ser acessível (ex.: "Código no GitHub", "GitHub" ou ícone com texto alternativo). O objetivo é permitir que visitantes e desenvolvedores acedam ao código fonte do projeto a partir do próprio site.

#### Scenario: Utilizador vê e clica no link do repositório no rodapé

- **Dado** que o utilizador está em qualquer página do site com rodapé visível
- **Quando** visualiza o rodapé
- **Então** existe um link visível para o repositório do projeto (ex.: "Código no GitHub" ou ícone + texto)
- **E** ao clicar no link, o repositório GitHub abre numa nova aba
- **E** o link aponta para o URL canónico do projeto (https://github.com/ricardopiloto/simple-blog-hub)

