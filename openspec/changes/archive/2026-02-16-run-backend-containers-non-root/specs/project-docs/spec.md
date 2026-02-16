# project-docs — delta for run-backend-containers-non-root

## ADDED Requirements

### Requirement: Documentação de deploy inclui configuração do servidor para contentores não-root (SHALL)

When the application is deployed with Docker (API and BFF in containers), the repository SHALL provide or reference a **document** that describes how to **configure the server** so that the backend containers run as **non-root** (e.g. fixed UID) and can write to their volumes (database directory, upload directory). The document SHALL include **step-by-step commands** (e.g. creating directories, `chown` to the container UID on the host) for at least: (1) **new deploy** — set permissions before or after first `docker compose up -d`; (2) **migration from root** — apply the same permissions to existing data and upload directories, then update and restart containers. The deploy documentation (e.g. DEPLOY-DOCKER-CADDY.md) SHALL state that containers run as non-root and SHALL reference this document (e.g. CONFIGURAR-SERVIDOR-NAO-ROOT.md) for server setup. The update document (e.g. ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) MAY reference it when operators upgrade to a version that uses non-root containers.

#### Scenario: Operador encontra guia de configuração do servidor para não-root

- **GIVEN** the operator is deploying or updating the blog with Docker (API and BFF)
- **WHEN** they read DEPLOY-DOCKER-CADDY.md or the update guide
- **THEN** they see that containers run as non-root (e.g. UID 10000)
- **AND** they find a reference to a dedicated document (e.g. CONFIGURAR-SERVIDOR-NAO-ROOT.md) with step-by-step server commands (e.g. `chown -R 10000:10000` on data and upload directories)
- **AND** by following that document they can configure the host so that the API and BFF run without "readonly database" or "Permission denied" errors
