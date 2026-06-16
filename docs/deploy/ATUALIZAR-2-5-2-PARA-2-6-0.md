# Atualizar da versão 2.5.2 para a 2.6.0

Este guia destina-se a **operadores** que já têm o blog em produção na **v2.5.2** (ou numa tag posterior até **v2.5.3**) e pretendem atualizar para a **v2.6.0**.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

Na secção **Docker**, usa **REPO_DIR** para o diretório do repositório no servidor e **DOCUMENT_ROOT** para a pasta onde o Caddy serve os estáticos do frontend.

---

## O que mudou na 2.6.0

A release **2.6.0** adiciona **Geração de Imagem** na Área do Autor:

- Nova rota **`/area-autor/geracao-imagem`** (link no header para autores autenticados).
- Cada autor configura o próprio **Account ID** e **API Token** Cloudflare em **Contas** (secção *Cloudflare Workers AI*).
- O BFF chama a **Cloudflare Workers AI** (modelo Flux Schnell); o token **não** trafega para o browser.
- A API passa a guardar credenciais na tabela **`Authors`** (duas colunas novas) e encripta o API Token com **`Cloudflare__EncryptionKey`**.

**Versões intermédias:** Se estiveres na **v2.5.3**, os passos são os mesmos — a 2.5.3 só alterou o Índice da História (sem base de dados nem variáveis novas).

**Fora de scope desta release:** persistir imagens no servidor, upload automático como capa de post, escolha de modelo.

---

## Resumo rápido (produção Docker)

| Ordem | Ação |
|-------|------|
| 1 | Gerar e configurar **`Cloudflare__EncryptionKey`** em `api.env` |
| 2 | `git pull` + `docker compose build --no-cache` + `docker compose up -d` |
| 3 | Confirmar migração da base (automática ao arrancar a API, ou script manual) |
| 4 | Rebuild do frontend e copiar `dist` para **DOCUMENT_ROOT** |
| 5 | Smoke check (site, login, Contas, Geração de Imagem) |

---

## 1. Configuração em produção (antes ou durante o deploy)

### 1.1 Nova variável na API — `Cloudflare__EncryptionKey`

**Obrigatória** quando autores forem guardar API Tokens Cloudflare em Contas. Sem ela, o save do token falha (a funcionalidade de geração de imagem fica indisponível até configurar).

Edite **`api.env`** na raiz do repositório (ver [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)):

```bash
# Chave AES-256 para encriptar API Tokens Cloudflare dos autores (32 bytes)
# Gerar uma vez e NÃO alterar depois de autores guardarem tokens — senão tokens antigos deixam de funcionar
Cloudflare__EncryptionKey=COLE_AQUI_32_BYTES_BASE64_OU_64_HEX
```

**Gerar valor seguro (exemplo no servidor ou máquina local):**

```bash
openssl rand -base64 32
```

Também é aceite **64 caracteres hexadecimais** (32 bytes). Ver [.env.docker.example](../../.env.docker.example) e [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md).

| Variável | Serviço | Obrigatório | Notas |
|----------|---------|-------------|--------|
| `Cloudflare__EncryptionKey` | **API** | Se Geração de Imagem | Não expor ao frontend; não commitar |
| `API__InternalKey` | API + BFF | Sim (produção) | Sem alteração face à 2.5.2 |
| `Jwt__Secret` | BFF | Sim (produção) | Sem alteração face à 2.5.2 |
| `Cors__AllowedOrigins` | BFF | Sim (produção) | Sem alteração face à 2.5.2 |
| `Admin__Email` | API | Recomendado | Sem alteração face à 2.5.2 |

**Não** é necessário configurar credenciais Cloudflare no `api.env` / `bff.env` do operador: cada **autor** regista as suas em **Contas** após o deploy.

### 1.2 Rede de saída (BFF → Cloudflare)

O contentor/serviço **BFF** deve conseguir HTTPS de saída para **`api.cloudflare.com`** quando autores usarem Geração de Imagem. Em setups típicos com Docker + Caddy não há alteração de firewall; confirme se o servidor não bloqueia tráfego de saída.

### 1.3 Caddy

**Não** há novos caminhos no Caddyfile: a rota `/area-autor/geracao-imagem` é servida pelo SPA (estáticos); pedidos de API continuam em `/bff/*`. Não é necessário `reload` do Caddy só por causa desta versão (salvo se atualizares o Caddyfile por outro motivo).

---

## 2. Script de base de dados

### Colunas novas

| Tabela | Colunas |
|--------|---------|
| `Authors` | `CloudflareAccountId` (TEXT, nullable) |
| `Authors` | `CloudflareApiTokenEncrypted` (TEXT, nullable) |

### Script SQL (execução manual)

Ficheiro: **`backend/api/Migrations/Scripts/add_cloudflare_credentials_to_author.sql`**

```sql
ALTER TABLE Authors ADD COLUMN CloudflareAccountId TEXT NULL;
ALTER TABLE Authors ADD COLUMN CloudflareApiTokenEncrypted TEXT NULL;
```

Execute **uma vez**. Se as colunas já existirem, o SQLite devolve erro — pode ignorar.

### Quando usar o script manual

| Situação | O que fazer |
|----------|-------------|
| **Fluxo normal (recomendado)** | Após `docker compose up -d`, a API aplica a migração EF **`AddCloudflareCredentialsToAuthor`** ao arranque (`MigrateAsync()`). |
| **Erro** `no such column: a.CloudflareAccountId` | Aplicar o script manual abaixo e reiniciar a API. |
| **Preferência do operador** | Aplicar o script **antes** de subir a nova API (equivalente à migração EF). |

### Docker — pasta `data/` no host (bind mount, predefinido)

A partir de **REPO_DIR**:

```bash
cd REPO_DIR
sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_cloudflare_credentials_to_author.sql
docker compose restart api
```

Ver também [EXPOR-DB-NO-HOST.md](../database/EXPOR-DB-NO-HOST.md).

### Docker — volume nomeado (configuração antiga)

```bash
cd REPO_DIR
docker volume ls | grep blog_api_data   # anotar NOME_DO_VOLUME
docker run --rm \
  -v NOME_DO_VOLUME:/data \
  -v $(pwd)/backend/api/Migrations/Scripts:/scripts \
  ubuntu:22.04 sh -c \
  "apt-get update -qq && apt-get install -y -qq sqlite3 && sqlite3 /data/blog.db < /scripts/add_cloudflare_credentials_to_author.sql"
docker compose restart api
```

### Desenvolvimento local

```bash
cd backend/api
sqlite3 blog.db < Migrations/Scripts/add_cloudflare_credentials_to_author.sql
dotnet build && dotnet run
```

---

## 3. Passos de atualização (produção Docker)

### 3.1 Preparar `api.env`

1. Abrir `api.env` em **REPO_DIR**.
2. Adicionar `Cloudflare__EncryptionKey` (ver secção 1.1).
3. Confirmar que `API__InternalKey`, `Admin__Email` e connection string continuam corretos.

### 3.2 Atualizar backend

```bash
cd REPO_DIR
git pull
git checkout v2.6.0    # ou branch/tag que contém a 2.6.0
docker compose build --no-cache
docker compose up -d
```

O **`build --no-cache`** é importante: a imagem da API deve incluir a migration e o código novo.

Verificar logs da API (migração aplicada ou base já atualizada):

```bash
docker compose logs api | tail -30
```

Se aparecer erro de coluna em falta, aplicar o script da secção 2.

### 3.3 Atualizar frontend

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

Substituir `seu-dominio.com` e **DOCUMENT_ROOT** pelos valores do teu servidor.

O rodapé deve passar a mostrar **2.6.0** (campo `version` em `frontend/package.json`).

### 3.4 Caddy (opcional)

Só se alteraste o Caddyfile:

```bash
sudo systemctl reload caddy
```

---

## 4. Passos de atualização (desenvolvimento local)

1. `git pull` (ou checkout `v2.6.0`).
2. Aplicar script SQL se necessário (secção 2) em `backend/api/blog.db`.
3. API: `cd backend/api && dotnet run` — **não** use `Cloudflare__EncryptionKey="$(openssl rand -base64 32)"` a cada arranque; em desenvolvimento a chave fixa está em `appsettings.Development.json`.
4. BFF: `cd backend/bff && dotnet run`
5. Frontend: `cd frontend && npm install && npm run dev`

---

## 5. Verificação após o deploy

### Operador

- [ ] Site público carrega (início, artigos, índice).
- [ ] Login na Área do autor funciona.
- [ ] Header mostra **Geração de Imagem** (autenticado).
- [ ] API arrancou sem erro; colunas Cloudflare existem (opcional):
  ```bash
  sqlite3 data/blog.db "PRAGMA table_info(Authors);" | grep -i cloudflare
  ```
- [ ] Respostas de `GET /bff/users/me` **não** incluem o API Token Cloudflare (apenas `has_cloudflare_api_token` quando aplicável).

### Autores (configuração pós-deploy)

Cada autor que quiser gerar imagens:

1. Conta Cloudflare com **Workers AI** ativo.
2. Em **Contas** → secção **Cloudflare Workers AI**: **Account ID** + **API Token**.
3. **Geração de Imagem** → prompt → imagem exibida.

O operador **não** precisa de conta Cloudflare para o blog funcionar; só os autores que usarem a funcionalidade.

---

## 6. Avisos importantes

- **`Cloudflare__EncryptionKey` estável:** Depois de autores guardarem tokens, **não mude** esta chave sem avisar — tokens encriptados com a chave antiga deixam de ser legíveis. Faça backup seguro da chave.
- **Não commitar** `api.env`, `bff.env` nem a chave Cloudflare no repositório.
- **Sem `Cloudflare__EncryptionKey`:** o resto do blog continua a funcionar; apenas guardar token Cloudflare e gerar imagens falham até configurar.
- **Migração EF vs script manual:** Não é necessário correr o script **e** confiar no `MigrateAsync()` se ambos aplicarem as mesmas colunas — use um fluxo (normalmente só rebuild + `up -d`).

---

## 7. Referências

- [CHANGELOG.md](../changelog/CHANGELOG.md) — secção **[2.6.0]**
- [ATUALIZAR-2-5-3-PARA-2-6-1.md](ATUALIZAR-2-5-3-PARA-2-6-1.md) — atualização seguinte (modelo de imagem e melhorias Cloudflare)
- [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md) — instalação inicial e `api.env` / `bff.env`
- [ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) — atualização genérica e tabela de scripts SQL
- [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md) — checklist completo de produção
- [backend/api/README.md](../../backend/api/README.md) — troubleshooting `no such column: a.CloudflareAccountId`
