# Atualizar da versão 1.9 para a 1.10

Este guia destina-se a **operadores** que já têm o blog em produção na **v1.9** (Docker + Caddy ou execução local) e pretendem atualizar para a **v1.10**.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

---

## O que mudou na 1.10

A release 1.10 inclui avaliações de segurança e de melhorias de código, documentação reorganizada, redução da exposição de credenciais, validação de slug, melhorias no BFF/API/frontend e **hardening aplicado**: sanitização HTML, CORS e security headers, validação de secrets em produção, política de senha mais forte, rate limiting, contentores Docker não-root, e novos documentos (PRODUCTION-CHECKLIST, TOKEN-STORAGE, Caddyfile.example). **Não há novas colunas ou tabelas** na base de dados — não é necessário executar scripts SQL manuais para esta atualização.

---

## Passos de atualização

### 1. Atualizar variáveis de ambiente (produção)

Em **produção** (`ASPNETCORE_ENVIRONMENT=Production`), o BFF e a API **falham ao arranque** se estas configurações estiverem em falta ou inválidas. Configura-as **antes** de fazer pull/rebuild:

| Serviço | Variável / Config | Obrigatório | Descrição |
|---------|-------------------|-------------|-----------|
| **BFF** | `Cors:AllowedOrigins` | Sim | Origens permitidas (ex.: `https://teu-dominio.com`), separadas por `;`. Não deixar vazio em produção. |
| **BFF** | `Jwt:Secret` | Sim, ≥ 32 caracteres | Chave para assinar o JWT. Usar valor forte e único. |
| **API** | `API:InternalKey` | Sim | Chave partilhada com o BFF (header `X-Api-Key`). Deve ser igual no BFF e na API. |

Adiciona ou edita em `bff.env` (BFF) e `api.env` (API) na raiz do repositório, conforme [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md). Lista completa e checklist: [**PRODUCTION-CHECKLIST.md**](../security/PRODUCTION-CHECKLIST.md).

### 2. Pull e reconstruir (Docker)

Na raiz do repositório no servidor (REPO_DIR):

```bash
cd REPO_DIR
git pull
docker compose build --no-cache
docker compose up -d
```

Garante que `api.env` e `bff.env` têm as variáveis acima antes de `docker compose up -d`.

### 3. Frontend

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://teu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

Substitui `teu-dominio.com` e `DOCUMENT_ROOT` pelos teus valores (DOCUMENT_ROOT = pasta onde o Caddy serve os estáticos).

### 4. Caddy (se alteraste o Caddyfile)

Se usas um Caddyfile próprio, podes basear-te no [Caddyfile.example](Caddyfile.example) para HTTPS e headers de segurança. Depois:

```bash
sudo systemctl reload caddy
```

---

## Avisos importantes

- **Política de senha:** O critério mínimo passou a **8 caracteres**, com **uma maiúscula, uma minúscula e um número**. Contas existentes continuam válidas; novas senhas (incluindo troca obrigatória no primeiro acesso) devem cumprir este critério.

- **Produção sem config:** Se em produção não configurares `Cors:AllowedOrigins`, `Jwt:Secret` (≥ 32 chars) no BFF e `API:InternalKey` no BFF e na API, o BFF e a API **não arrancam** (falham na validação ao startup).

- **Docker não-root:** Os contentores da API e do BFF correm como utilizador não-root (uid 1000). Se a pasta de dados (ex.: `data/` no host) tiver dono/permissões que impeçam escrita por esse utilizador, ajusta as permissões (ex.: `chown` no host). Ver [SECURITY-HARDENING.md](../security/SECURITY-HARDENING.md) e [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md).

---

## Referências

- [**PRODUCTION-CHECKLIST.md**](../security/PRODUCTION-CHECKLIST.md) — variáveis obrigatórias e checklist antes de publicar.
- [**DEPLOY-DOCKER-CADDY.md**](DEPLOY-DOCKER-CADDY.md) — instalação inicial com Docker e Caddy.
- [**ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) — atualização genérica (local e Docker), scripts de banco quando aplicável.
- **backend/api/README.md** — regra para alterações de esquema (script manual obrigatório quando há novas colunas/tabelas); troubleshooting "no such column".

Para instalação inicial em servidor ou recuperação de senha do Admin, ver [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md).
