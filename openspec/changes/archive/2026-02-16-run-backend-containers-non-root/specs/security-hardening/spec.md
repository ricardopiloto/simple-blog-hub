# security-hardening — delta for run-backend-containers-non-root

## MODIFIED Requirements

### Requirement: Hardening de infra e documentação de segurança SHALL be aplicados

**Change:** The API and BFF containers SHALL run as **non-root** (fixed UID, e.g. 10000) by default. The repository SHALL provide documentation that includes a **step-by-step guide for the server** (commands and changes) so that volume permissions are set correctly (e.g. `chown` to the container UID on the host for `data/` and `frontend/public/images/posts`), allowing the API to write to the database and trigger file and the BFF to write uploads without "readonly database" or "Permission denied" errors. The previous wording that allowed (MAY) running as root for volume compatibility is replaced by this requirement: operators SHALL configure the host once according to the guide so that non-root execution is possible. The rest of the requirement (documentation of env vars, Caddyfile example, data directory permissions, trade-off documentation) remains; the "trade-off" is now documented as "non-root with one-time host setup" vs. "root without host setup".

#### Scenario: Contentores correm como não-root após configuração no servidor

- **GIVEN** the operator has followed the step-by-step server guide (e.g. CONFIGURAR-SERVIDOR-NAO-ROOT.md) and has set ownership of the `data/` and `frontend/public/images/posts` directories on the host to the container UID (e.g. 10000:10000)
- **WHEN** the operator runs `docker compose up -d` with the images that use a non-root USER
- **THEN** the API and BFF containers run as non-root (e.g. `docker compose exec api id` shows uid=10000)
- **AND** the API can write to the SQLite database and the Admin password-reset trigger file in `/data`
- **AND** the BFF can write uploaded cover images to `/frontend/public/images/posts`
- **AND** no "readonly database" or "Permission denied" errors occur when using the application normally
