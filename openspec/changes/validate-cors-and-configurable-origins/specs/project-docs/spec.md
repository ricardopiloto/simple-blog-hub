# project-docs — delta for validate-cors-and-configurable-origins

## ADDED Requirements

### Requirement: CORS validation and optional config documented; no domain in git

The documentation (README and/or openspec/project.md) SHALL state that **with same-origin deployment** (frontend and BFF served under the same domain, e.g. reverse proxy serving the SPA and proxying `/bff` to the BFF), **no CORS domain configuration is required** for the application to work; the browser treats requests to the same origin as same-origin. The documentation MAY describe an optional BFF configuration (e.g. `Cors__AllowedOrigins`) to restrict CORS to specific origins; when described, it SHALL state that the **domain or origin value is set only on the server** (environment or appsettings not committed to the repository) and **must not be committed to git**. No deployment-specific domain (e.g. blog.1nodado.com.br) SHALL be hardcoded in repository code or in committed configuration files.

#### Scenario: Reader learns that same-origin deploy needs no CORS config

- **WHEN** a deployer or developer reads the README or project.md
- **THEN** they find a clear statement that when the frontend and the BFF are on the same domain (e.g. Caddy proxy), no CORS domain configuration is required for the app to work
- **AND** they understand that CORS applies to cross-origin requests and that same-origin requests do not trigger CORS

#### Scenario: Optional CORS config is server-only

- **WHEN** the documentation describes optional CORS allowed origins configuration (e.g. `Cors__AllowedOrigins`)
- **THEN** it states that the value (e.g. the public URL of the site) is set only on the server (environment variable or non-versioned appsettings)
- **AND** no example or default in the committed repository contains a real deployment domain (e.g. blog.1nodado.com.br); placeholders like "URL do seu domínio" or "https://seu-dominio.com" may be used
