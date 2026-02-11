# Variáveis obrigatórias para produção e checklist de hardening

Antes de publicar uma nova versão em **produção**, verificar o seguinte.

## Variáveis obrigatórias (produção)

Quando `ASPNETCORE_ENVIRONMENT=Production` (ou equivalente), a aplicação **falha ao arranque** se estas configurações estiverem em falta ou inválidas:

### BFF

| Variável / Config | Obrigatório | Descrição |
|-------------------|-------------|-----------|
| `Cors:AllowedOrigins` | Sim | Origens permitidas (ex.: `https://seu-dominio.com`), separadas por `;`. Não deixar vazio em produção. |
| `Jwt:Secret` | Sim, ≥ 32 caracteres | Chave para assinar o JWT. Use um valor forte e único. |

### API

| Variável / Config | Obrigatório | Descrição |
|-------------------|-------------|-----------|
| `API:InternalKey` | Sim | Chave partilhada com o BFF (header `X-Api-Key`). Deve ser igual no BFF e na API. |

### Recomendadas (não bloqueiam arranque)

- `Admin__Email`: e-mail do administrador; em produção configurar e alterar a senha no primeiro acesso.
- Connection string: em Docker, ex.: `Data Source=/data/blog.db` com volume montado.

## Checklist antes de publicar

- [ ] **Ambiente:** `ASPNETCORE_ENVIRONMENT=Production` (ou equivalente) no BFF e na API.
- [ ] **CORS:** `Cors:AllowedOrigins` no BFF com o domínio real do frontend (ex.: `https://seu-dominio.com`); sem origens genéricas em produção.
- [ ] **JWT:** `Jwt:Secret` com pelo menos 32 caracteres; não usar o valor de desenvolvimento.
- [ ] **API key:** `API:InternalKey` definido e igual no BFF e na API; não expor ao frontend.
- [ ] **Admin:** `Admin__Email` configurado; senha padrão alterada no primeiro acesso.
- [ ] **HTTPS:** Caddy (ou proxy) a terminar HTTPS e a enviar o header correto para o backend (ex.: `X-Forwarded-Proto`).
- [ ] **Dados:** Pasta de dados (ex.: `data/` no host) com permissões restritivas (apenas o utilizador do processo); ver SECURITY-HARDENING.md.
- [ ] **Logs:** Confirmar que nenhum log regista senhas, tokens ou dados sensíveis em texto claro.

## Referências

- [SECURITY-HARDENING.md](SECURITY-HARDENING.md) — plano de melhorias e requisitos de logging/permissões.
- [DEPLOY-DOCKER-CADDY.md](../deploy/DEPLOY-DOCKER-CADDY.md) — instalação com Docker e Caddy.
- [Caddyfile.example](../deploy/Caddyfile.example) — exemplo de Caddy com HTTPS e headers de segurança.
