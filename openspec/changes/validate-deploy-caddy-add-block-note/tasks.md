# Tasks: validate-deploy-caddy-add-block-note

## 1. Add note in DEPLOY section 7 (Caddy)

- [x] 1.1 In DEPLOY-UBUNTU-CADDY.md, in section 7 "Caddy: site e reverse proxy", add a short note **before** or **after** the sentence "Se usar um ficheiro de configuração global do Caddy (ex.: `/etc/caddy/Caddyfile`), adicionar um bloco como:" clarifying that **if the Caddyfile already contains other server blocks** (e.g. for other domains or services), the deployer should **add** the following block to the existing file rather than replacing the entire Caddyfile. Wording example: "Se o seu Caddyfile já tiver outros blocos (por exemplo para outros domínios), adicione o bloco abaixo ao ficheiro existente em vez de substituir o conteúdo todo."

## 2. Validation

- [x] 2.1 Run `openspec validate validate-deploy-caddy-add-block-note --strict` and resolve any issues.
