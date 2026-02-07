# project-docs — delta for add-post-cover-image-upload-local

## ADDED Requirements

### Requirement: Deploy documentation describes upload directory for cover images

When the application supports **local upload of post cover images** (stored under `images/posts` and served at `/images/posts/`), the deploy and update documentation (e.g. DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) SHALL describe how to configure the upload path (e.g. `Uploads:ImagesPath` in the BFF) and how the web server must serve that directory at `/images/posts` so that uploaded covers are accessible. The documentation SHALL note that the upload directory should be persistent across deploys (e.g. not inside the frontend build output).

#### Scenario: Operator configures production for cover uploads

- **GIVEN** the operator is deploying with Docker and Caddy
- **WHEN** they consult the deploy documentation for cover image uploads
- **THEN** they find instructions to (1) set the BFF upload path (e.g. volume or host path) and (2) add a Caddyfile rule to serve that path at `/images/posts/`
- **AND** uploaded cover images persist across redeploys and are served correctly
