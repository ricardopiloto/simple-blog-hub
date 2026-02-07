# Proposal: Validate CORS and optional configurable origins

## Summary

**Validate** whether the application needs domain-specific CORS configuration to work when the frontend is served at a given domain (e.g. blog.1nodado.com.br). Conclude and document the result; optionally allow CORS allowed origins to be **configurable via configuration** (no domain in code that goes to git), so deployers can lock down origins in production if desired.

## Validation result (same-origin deploy)

With the current deployment (Caddy serving the frontend at the domain root and proxying `/bff` to the BFF on the same domain):

- The browser loads the SPA from `https://blog.1nodado.com.br` and calls `https://blog.1nodado.com.br/bff/...`.
- These are **same-origin** requests (same scheme, host, and port). The browser does **not** send CORS preflight for same-origin requests.
- **Conclusion: No CORS domain configuration is required** for the application to work at blog.1nodado.com.br. The current BFF policy (`AllowAnyOrigin()`) is sufficient; in this setup CORS is not involved for production traffic.

For **local development**, the frontend (e.g. localhost:5173) and the BFF (localhost:5000) are different origins, so CORS applies; the current `AllowAnyOrigin()` allows those requests.

## Goals

- **Document** that with same-origin deployment (frontend and BFF behind the same domain), no CORS domain config is needed for the app to function.
- **Optional hardening**: Allow the BFF to restrict CORS to specific origins when configured (e.g. `Cors:AllowedOrigins` or `Cors__AllowedOrigins`). The **domain value must not be committed to git**; it is set only in server environment or in appsettings that are not versioned (e.g. appsettings.Production.json on the server). When not configured, keep `AllowAnyOrigin()` for backward compatibility and dev.
- **Constraint**: No hardcoded domain (e.g. blog.1nodado.com.br) in any file that is committed to the repository.

## Scope

- **In scope**: Document in README or project.md (and optionally in deploy doc) the CORS validation result; optionally implement configurable CORS origins in the BFF (read from IConfiguration); document the optional config key (e.g. `Cors__AllowedOrigins`) and that the value is set only on the server.
- **Out of scope**: Changing frontend code; changing API (API is not called by the browser); committing any deployment-specific domain to the repo.

## Affected code and docs

- **backend/bff/Program.cs**: If implementing optional configurable origins: read `Cors:AllowedOrigins` (semicolon-separated list or single origin); when present and non-empty, use `WithOrigins(...)` with that list and `AllowAnyMethod().AllowAnyHeader()`; when absent or empty, keep current `AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()`.
- **README.md** (or **openspec/project.md**): Short subsection or constraint stating that (1) with same-origin deploy (frontend and /bff on same domain), no CORS config is required; (2) optionally, BFF can restrict CORS to specific origins via config (e.g. `Cors__AllowedOrigins`), set only on the server—never commit the domain to git.
- **DEPLOY-UBUNTU-CADDY.md** (optional): One line that for same-domain setup CORS does not require configuration; if the deployer wants to restrict origins, set the config on the server (no example domain in the doc that goes to git, or use a placeholder like `https://seu-dominio.com`).

## Success criteria

- Documentation clearly states that no CORS domain config is required for same-origin deployment.
- If implemented, CORS origins are configurable only via configuration; no domain is hardcoded in committed code.
- `openspec validate validate-cors-and-configurable-origins --strict` passes.
