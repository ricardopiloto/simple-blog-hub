# project-docs — delta for validate-deploy-caddy-add-block-note

## ADDED Requirements

### Requirement: Deploy doc clarifies adding Caddy block when file has other sites

When the deploy documentation (e.g. DEPLOY-UBUNTU-CADDY.md) describes how to configure Caddy for the blog (e.g. a server block for blog.1nodado.com.br with static files and `/bff` reverse proxy), it SHALL state clearly that **if the Caddyfile already contains other server blocks** (for other domains or services), the deployer SHALL **add** the blog block to the existing file rather than replacing the entire Caddyfile. This prevents accidental removal of existing site configuration.

#### Scenario: Deployer with existing Caddyfile

- **WHEN** a deployer follows the deploy doc and their server already has a Caddyfile with other server blocks (e.g. for a main site or other subdomains)
- **THEN** the doc explicitly tells them to add the blog block to the existing file, not to replace the whole Caddyfile
- **AND** they can add the snippet without losing their current 1nodado.com.br, foundry.1nodado.com.br, or other blocks
