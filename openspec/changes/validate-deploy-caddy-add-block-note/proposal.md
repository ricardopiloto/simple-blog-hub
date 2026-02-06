# Proposal: Validate deploy Caddy section and clarify add-block vs replace

## Summary

Validate the Caddy configuration described in **DEPLOY-UBUNTU-CADDY.md** and clarify for deployers that when the server **already has a Caddyfile with other server blocks** (e.g. for other domains or services), they should **add** the blog.1nodado.com.br block to the existing file instead of replacing the entire Caddyfile. This avoids accidentally removing existing site configuration (e.g. 1nodado.com.br, foundry.1nodado.com.br, or other blocks).

## Validation

The Caddy snippet in the deploy doc (section 7) is **valid Caddy v2** syntax and consistent with the rest of the deploy:

- **blog.1nodado.com.br** as site address.
- **root * /var/www/blog/dist** — matches the deploy path where static files are copied (step 5).
- **file_server** + **try_files {path} /index.html** — serves the SPA and fallback for client-side routing.
- **handle /bff/* { reverse_proxy 127.0.0.1:5000 }** — proxies BFF requests to the backend; path is preserved so the BFF receives e.g. `/bff/posts`.

No change to the snippet itself is required. The improvement is **documentation**: make explicit that this block is to be **added** when the Caddyfile already contains other blocks.

## Goals

- **Document** in DEPLOY-UBUNTU-CADDY.md (section 7) that if the Caddyfile already has other server blocks (for other domains or services), the deployer should **add** the blog.1nodado.com.br block to that file, not replace the whole file.
- **Keep** the existing Caddy snippet and the rest of the deploy doc unchanged; no commitment of the deployer's actual Caddyfile content to the repository (the deploy doc remains generic and is gitignored).

## Scope

- **In scope**: One short note or sentence in DEPLOY-UBUNTU-CADDY.md, section 7 (Caddy), clarifying the add-vs-replace behavior. Optionally a one-line reminder in "Resumo rápido" or at the start of section 7.
- **Out of scope**: Changing the Caddy snippet; adding the deployer's real Caddyfile to the repo; modifying other sections of the deploy doc.

## Success criteria

- A reader following the deploy doc understands that they should add the blog block to an existing Caddyfile when other sites are already configured.
- `openspec validate validate-deploy-caddy-add-block-note --strict` passes.
