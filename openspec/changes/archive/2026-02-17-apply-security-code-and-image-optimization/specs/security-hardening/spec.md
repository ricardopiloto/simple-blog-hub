# security-hardening — delta for apply-security-code-and-image-optimization

## ADDED Requirements

### Requirement: Content-Security-Policy MAY be sent by BFF when configured

The BFF MAY send a **Content-Security-Policy** (or **Content-Security-Policy-Report-Only**) header when the application is configured to do so (e.g. via `Security:CspHeader`). When the configured value is empty or absent, the BFF SHALL NOT add a CSP header to responses. When `Security:CspHeader` is set to a non-empty value, the BFF SHALL add the corresponding header to responses; when `Security:CspReportOnly` is true, the header name SHALL be `Content-Security-Policy-Report-Only`. This allows operators to enforce or test CSP without changing the reverse proxy (e.g. Caddy).

#### Scenario: CSP header present when configured

- **GIVEN** the BFF is configured with a non-empty `Security:CspHeader` (e.g. `default-src 'self'`)
- **WHEN** a client requests any BFF endpoint
- **THEN** the response includes the header `Content-Security-Policy` (or `Content-Security-Policy-Report-Only` if so configured) with that value
- **AND** the application continues to serve the frontend and API proxy as before

#### Scenario: No CSP header when not configured

- **GIVEN** the BFF is not configured with `Security:CspHeader` (or the value is empty)
- **WHEN** a client requests any BFF endpoint
- **THEN** the response does not include a Content-Security-Policy or Content-Security-Policy-Report-Only header
- **AND** no change in behaviour is required for existing deployments
