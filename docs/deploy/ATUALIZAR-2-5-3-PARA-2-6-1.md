# Atualizar da versão 2.5.3 para a 2.6.3

Este guia destina-se a **operadores** que já têm o blog em produção na **v2.5.3** (ou numa tag anterior até **v2.6.2**) e pretendem atualizar para a **v2.6.3**.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

Na secção **Docker**, usa **REPO_DIR** para o diretório do repositório no servidor e **DOCUMENT_ROOT** para a pasta onde o Caddy serve os estáticos do frontend.

Se estiveres na **v2.5.2** ou anterior (sem a 2.5.3), podes seguir este guia na mesma — a 2.5.3 só alterou o Índice da História (sem base de dados nem variáveis novas). Quem já está numa versão intermédia: ver secções [2.6.0 → 2.6.1](#só-da-260-para-a-261), [2.6.1 → 2.6.2](#só-da-261-para-a-262) e [2.6.2 → 2.6.3](#só-da-262-para-a-263).

---

## O que mudou

### Release 2.6.0 — Geração de Imagem (Cloudflare Workers AI)

- Nova rota **`/area-autor/geracao-imagem`** (link no header para autores autenticados).
- Cada autor configura **Account ID** e **API Token** Cloudflare em **Contas** (secção *Cloudflare Workers AI*).
- O BFF chama a [REST API da Cloudflare](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) (modelo por defeito Flux Schnell); o token **não** trafega para o browser.
- A imagem gerada é devolvida em base64 ao frontend e **não é guardada no servidor**.
- A API guarda credenciais na tabela **`Authors`** e encripta o API Token com **`Cloudflare__EncryptionKey`** (AES-256-GCM).

### Release 2.6.1 — Modelo configurável e robustez Cloudflare

- Campo **Modelo de imagem** em **Contas** (default `@cf/black-forest-labs/flux-1-schnell`); o BFF usa o modelo guardado no perfil.
- Validação de API Token ao guardar (formatos legado ~40 caracteres e novo `cfut_` / `cfat_` ~53 caracteres; até **120** caracteres).
- Mensagens de erro mais claras (token inválido, Account ID incorreto, quota, rate limit, token expirado, etc.).
- Botão **Testar credenciais guardadas** em Contas.
- BFF repassa mensagens de erro da API ao frontend (ex.: validação 400 legível).
- Nova coluna **`CloudflareImageModel`** em `Authors`.

### Release 2.6.2 — Criação de contas (bugfix)

- Corrigido **400** ao criar conta em **Contas** (Admin envia só e-mail e nome; senha padrão no servidor).
- BFF repassa mensagens de erro da API; logs de validação na API.

### Release 2.6.3 — Sitemap/robots com HTTPS

- BFF com **`UseForwardedHeaders`** para URLs absolutas corretas em **sitemap.xml** e **robots.txt** atrás de Caddy.
- Caddyfile de exemplo com `header_up X-Forwarded-Proto`.

---

## Resumo rápido (produção Docker — 2.5.3 → 2.6.3)

| Ordem | Ação |
|-------|------|
| 1 | Gerar e configurar **`Cloudflare__EncryptionKey`** em `api.env` (se ainda não existir) |
| 2 | `git pull` + `docker compose build --no-cache` + `docker compose up -d` |
| 3 | Confirmar migrações da base (automática ao arrancar a API, ou scripts manuais) |
| 4 | Rebuild do frontend e copiar `dist` para **DOCUMENT_ROOT** |
| 5 | Smoke check (site, login, Contas, Geração de Imagem, modelo de imagem) |

---

## 1. Configuração em produção

### 1.1 `Cloudflare__EncryptionKey` (API)

**Obrigatória** quando autores guardarem API Tokens Cloudflare em Contas.

Edite **`api.env`** em **REPO_DIR**:

```bash
# Chave AES-256 (32 bytes). Gerar UMA vez; não alterar depois de autores guardarem tokens.
Cloudflare__EncryptionKey=COLE_AQUI_32_BYTES_BASE64_OU_64_HEX
```

```bash
openssl rand -base64 32
```

Ver [.env.docker.example](../../.env.docker.example) e [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md).

| Variável | Serviço | Obrigatório | Notas |
|----------|---------|-------------|--------|
| `Cloudflare__EncryptionKey` | **API** | Se Geração de Imagem | Não commitar; backup seguro |
| `API__InternalKey` | API + BFF | Sim (produção) | Sem alteração face à 2.5.3 |
| `Jwt__Secret` | BFF | Sim (produção) | Sem alteração face à 2.5.3 |
| `Cors__AllowedOrigins` | BFF | Sim (produção) | Sem alteração face à 2.5.3 |

### 1.2 Rede de saída

O **BFF** precisa de HTTPS de saída para **`api.cloudflare.com`** quando autores usarem Geração de Imagem.

### 1.3 Caddy

Sem alterações obrigatórias no Caddyfile: `/area-autor/geracao-imagem` é rota do SPA; API continua em `/bff/*`.

---

## 2. Scripts de base de dados

Execute **cada script uma vez** se a migração EF não tiver sido aplicada automaticamente ao arrancar a API.

### 2.6.0 — credenciais Cloudflare

| Tabela | Colunas |
|--------|---------|
| `Authors` | `CloudflareAccountId`, `CloudflareApiTokenEncrypted` |

Ficheiro: **`backend/api/Migrations/Scripts/add_cloudflare_credentials_to_author.sql`**

Migração EF: `AddCloudflareCredentialsToAuthor`

### 2.6.1 — modelo de imagem

| Tabela | Colunas |
|--------|---------|
| `Authors` | `CloudflareImageModel` |

Ficheiro: **`backend/api/Migrations/Scripts/add_cloudflare_image_model_to_author.sql`**

Migração EF: `AddCloudflareImageModelToAuthor`

### Erros típicos

| Erro | Script |
|------|--------|
| `no such column: a.CloudflareAccountId` | `add_cloudflare_credentials_to_author.sql` |
| `no such column: a.CloudflareImageModel` | `add_cloudflare_image_model_to_author.sql` |

### Docker — pasta `data/` no host

```bash
cd REPO_DIR
sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_cloudflare_credentials_to_author.sql
sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_cloudflare_image_model_to_author.sql
docker compose restart api
```

(Se uma coluna já existir, o SQLite devolve erro — pode ignorar.)

### Desenvolvimento local

```bash
cd backend/api
sqlite3 blog.db < Migrations/Scripts/add_cloudflare_credentials_to_author.sql
sqlite3 blog.db < Migrations/Scripts/add_cloudflare_image_model_to_author.sql
dotnet build && dotnet run
```

**Desenvolvimento:** use a chave fixa em `appsettings.Development.json` e `dotnet run` **sem** `Cloudflare__EncryptionKey="$(openssl rand ...)"` a cada arranque — cada chave nova invalida tokens já guardados.

---

## 3. Passos de atualização (produção Docker)

### 3.1 Preparar `api.env`

1. Adicionar `Cloudflare__EncryptionKey` se ainda não existir (secção 1.1).
2. Confirmar `API__InternalKey`, `Admin__Email` e connection string.

### 3.2 Atualizar backend

```bash
cd REPO_DIR
git pull
git checkout v2.6.3    # ou branch/tag que contém a 2.6.3
docker compose build --no-cache
docker compose up -d
```

```bash
docker compose logs api | tail -30
```

### 3.3 Atualizar frontend

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

O rodapé deve mostrar **2.6.3**.

---

## 4. Passos de atualização (desenvolvimento local)

1. `git pull` (ou checkout `v2.6.3`).
2. Aplicar scripts SQL se necessário (secção 2).
3. API: `cd backend/api && dotnet run` (**sem** sobrescrever `Cloudflare:EncryptionKey` do `appsettings.Development.json`).
4. BFF: `cd backend/bff && dotnet run`
5. Frontend: `cd frontend && npm install && npm run dev`

---

## 5. Verificação após o deploy

### Operador

- [ ] Site público e login funcionam.
- [ ] Header mostra **Geração de Imagem** (autenticado).
- [ ] Colunas Cloudflare em `Authors` (opcional):
  ```bash
  sqlite3 data/blog.db "PRAGMA table_info(Authors);" | grep -i cloudflare
  ```
- [ ] `GET /bff/users/me` **não** expõe o API Token (apenas `has_cloudflare_api_token`).
- [ ] Admin consegue criar conta em **Contas** (e-mail + nome) sem 400.
- [ ] Novo utilizador faz login com senha padrão e vê modal de troca obrigatória.
- [ ] `curl https://dominio/sitemap.xml` — `<loc>` usam **https://** (não http://).

### Autores (Geração de Imagem)

1. [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) → **Use REST API** → Account ID + **API Token** (não Global API Key).
2. **Contas** → secção Cloudflare: Account ID, API Token, **Modelo de imagem** (default ou personalizado).
3. **Testar credenciais guardadas** → mensagem de sucesso.
4. **Geração de Imagem** → prompt → imagem exibida (não persistida no servidor).

---

## Só da 2.6.0 para a 2.6.1

Se já tens a **2.6.0** em produção:

1. `git pull` + `git checkout v2.6.1`
2. `docker compose build --no-cache && docker compose up -d`
3. Se aparecer `no such column: a.CloudflareImageModel`, executar `add_cloudflare_image_model_to_author.sql` (secção 2).
4. Rebuild e deploy do frontend (`package.json` → **2.6.1**).
5. Verificar campo **Modelo de imagem** em Contas.

Não é necessário alterar `Cloudflare__EncryptionKey` se já estiver configurada e estável.

---

## Só da 2.6.1 para a 2.6.2

Se já tens a **2.6.1** em produção:

1. `git pull` + `git checkout v2.6.2`
2. `docker compose build --no-cache && docker compose up -d`
3. Rebuild e deploy do frontend (`package.json` → **2.6.2**).
4. Verificar **Nova conta** em Contas (e-mail + nome → sucesso; novo utilizador troca senha no primeiro login).

**Sem** scripts SQL, variáveis novas nem alterações no Caddyfile.

---

## Só da 2.6.2 para a 2.6.3

Se já tens a **2.6.2** em produção:

1. `git pull` + `git checkout v2.6.3`
2. Actualizar **Caddyfile** — adicionar `header_up X-Forwarded-Proto {http.request.scheme}` nos `reverse_proxy` de `/sitemap.xml`, `/robots.txt` e `/bff/*` (ver [Caddyfile.example](Caddyfile.example) ou [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)); `sudo systemctl reload caddy`
3. `docker compose build bff --no-cache && docker compose up -d bff`
4. Rebuild e deploy do frontend (`package.json` → **2.6.3**) — opcional se só alteraste backend/Caddy; o rodapé actualiza com o build.
5. Verificar: `curl -s https://seu-dominio/sitemap.xml | head -5` → `<loc>https://...`

**Sem** scripts SQL nem variáveis novas na API.

---

## 6. Avisos importantes

- **`Cloudflare__EncryptionKey` estável:** não alterar depois de autores guardarem tokens sem que todos voltem a registar o token em Contas.
- **Não commitar** `api.env`, `bff.env` nem chaves.
- **Token Cloudflare:** cole o token completo do dashboard (`cfut_` / `cfat_` ou formato legado); máximo 120 caracteres; sem `Bearer ` nem Account ID no campo do token.
- **`token_decrypt_failed`:** re-cole o API Token em Contas com a chave de encriptação actual do servidor.

---

## 7. Referências

- [CHANGELOG.md](../changelog/CHANGELOG.md) — secções **[2.6.0]** a **[2.6.3]**
- [ATUALIZAR-2-6-3-PARA-2-6-6.md](ATUALIZAR-2-6-3-PARA-2-6-6.md) — actualização **2.6.3 → 2.6.6** (versão seguinte em PROD)
- [ATUALIZAR-2-5-2-PARA-2-6-0.md](ATUALIZAR-2-5-2-PARA-2-6-0.md) — detalhe adicional da 2.6.0
- [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)
- [ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)
- [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md)
- [backend/api/README.md](../../backend/api/README.md) — troubleshooting Cloudflare e migrações
