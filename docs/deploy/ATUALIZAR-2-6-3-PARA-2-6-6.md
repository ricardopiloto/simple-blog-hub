# Atualizar da versão 2.6.3 para a 2.6.6

Este guia destina-se a **operadores** que já têm o blog em produção na **v2.6.3** (última versão enviada para PROD à data deste documento) e pretendem atualizar para a **v2.6.6**.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

Na secção **Docker**, usa **REPO_DIR** para o diretório do repositório no servidor e **DOCUMENT_ROOT** para a pasta onde o Caddy serve os estáticos do frontend.

Quem já está numa versão intermédia: ver secções [2.6.3 → 2.6.4](#só-da-263-para-a-264), [2.6.4 → 2.6.5](#só-da-264-para-a-265) e [2.6.5 → 2.6.6](#só-da-265-para-a-266).

---

## O que mudou

### Release 2.6.4 — API de integração n8n

- Novos endpoints **`/bff/integrations/*`** autenticados com **`X-Integration-Key`** (sem JWT).
- Criar/agendar posts como **Admin** (`INTEGRATIONS__ADMINAUTHORID`), upload de capa multipart, `PUT` por slug, geração de capa via **OpenRouter**.
- Endpoints de suporte na API interna (`/api/integration/admin-author-id`, `authors/{id}/exists`).
- Guia completo: [N8N-POST-INGEST.md](../integrations/N8N-POST-INGEST.md).
- **Sem** migrações de base de dados.

### Release 2.6.5 — Capa no formulário de post (OpenRouter)

- Formulário **Novo/Editar post** com painel **Prompt para arte** (coluna lateral ao Markdown).
- Botão **«Gerar capa»** via **`POST /bff/image-generation/generate-openrouter`** (JWT + `INTEGRATIONS__OPENROUTER__APIKEY`).
- Upload automático para `cover_image` e preview 16:9 também em **Novo post**.
- **Sem** migrações de base de dados.

### Release 2.6.6 — Prompt de arte via DeepSeek

- Botão **«Gerar prompt para arte»** via **`POST /bff/image-generation/generate-cover-art-prompt`** — **DeepSeek API directa** (`api.deepseek.com`), **não** OpenRouter.
- Variáveis **`DEEPSEEK__APIKEY`** e opcionalmente **`DEEPSEEK__MODEL`** (default `deepseek-chat`) no BFF.
- **«Gerar capa»** continua a usar **OpenRouter Images** (`generate-openrouter`).
- O prompt (`#post-art-prompt`) **não** é persistido na base de dados.
- Layout do formulário em duas colunas alinhadas (labels, tabs/botões, editores).
- **Sem** migrações de base de dados.

---

## Resumo rápido (produção Docker — 2.6.3 → 2.6.6)

| Ordem | Ação |
|-------|------|
| 1 | Actualizar **`bff.env`** com variáveis novas (secção 1) — conforme funcionalidades que vais usar |
| 2 | `git pull` + `git checkout v2.6.6` + `docker compose build --no-cache` + `docker compose up -d` |
| 3 | Rebuild do frontend e copiar `dist` para **DOCUMENT_ROOT** |
| 4 | Smoke check (site, login, formulário de post, integração n8n se aplicável) |

**Não é necessário:** scripts SQL, alterações no Caddyfile (além do que já tens na 2.6.3), nem variáveis novas na **API** (`api.env`).

---

## 1. Configuração em produção (`bff.env`)

Todas as variáveis abaixo são no **BFF** (`bff.env` na raiz do repositório). A **API** (`api.env`) mantém-se como na 2.6.3 (incl. `Cloudflare__EncryptionKey` se usares Geração de Imagem).

### 1.1 Integração n8n (opcional — 2.6.4+)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `INTEGRATIONS__APIKEY` | Se n8n | Chave para header `X-Integration-Key` |
| `INTEGRATIONS__ADMINAUTHORID` | Recomendado | GUID do autor Admin; posts da integração usam este `AuthorId` |
| `INTEGRATIONS__OPENROUTER__APIKEY` | Se gerar capa (n8n ou formulário) | Chave OpenRouter para `/api/v1/images` |
| `INTEGRATIONS__OPENROUTER__IMAGEMODEL` | Não | Default `black-forest-labs/flux.2-klein-4b` |

Ver [N8N-POST-INGEST.md](../integrations/N8N-POST-INGEST.md) e [.env.docker.example](../../.env.docker.example).

### 1.2 Prompt de arte no formulário (opcional — 2.6.6)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `DEEPSEEK__APIKEY` | Se «Gerar prompt para arte» | Chave [DeepSeek API](https://platform.deepseek.com/) |
| `DEEPSEEK__MODEL` | Não | Default `deepseek-chat` |

Alternativa equivalente em JSON (`appsettings`): `Integrations:DeepSeek:ApiKey` — o BFF aceita os dois caminhos; em Docker usa-se normalmente `DEEPSEEK__APIKEY`.

**Nota:** `INTEGRATIONS__OPENROUTER__APIKEY` e `DEEPSEEK__APIKEY` são **independentes** — capa (OpenRouter) e prompt (DeepSeek) podem configurar-se separadamente.

Exemplo de bloco em **`bff.env`**:

```bash
# Integração n8n (opcional)
INTEGRATIONS__APIKEY=chave-forte-para-n8n
INTEGRATIONS__ADMINAUTHORID=guid-do-autor-admin
INTEGRATIONS__OPENROUTER__APIKEY=sk-or-v1-...
INTEGRATIONS__OPENROUTER__IMAGEMODEL=black-forest-labs/flux.2-klein-4b

# Prompt de arte no formulário de post (opcional)
DEEPSEEK__APIKEY=sk-...
DEEPSEEK__MODEL=deepseek-chat
```

### 1.3 Rede de saída (BFF)

O BFF precisa de HTTPS de saída para:

| Destino | Quando |
|---------|--------|
| `api.cloudflare.com` | Geração de Imagem (já existia) |
| `openrouter.ai` | «Gerar capa» no formulário e/ou integração n8n |
| `api.deepseek.com` | «Gerar prompt para arte» no formulário |

### 1.4 Caddy

Sem alterações obrigatórias face à **2.6.3**. Os novos endpoints são `/bff/image-generation/*` e `/bff/integrations/*` (já cobertos pelo `handle /bff/*` existente).

---

## 2. Scripts de base de dados

**Nenhum script novo** entre a 2.6.3 e a 2.6.6. Não executar migrações manuais adicionais.

Se ainda não aplicaste scripts de versões anteriores (Cloudflare), ver [ATUALIZAR-2-5-3-PARA-2-6-1.md](ATUALIZAR-2-5-3-PARA-2-6-1.md).

---

## 3. Passos de atualização (produção Docker)

### 3.1 Preparar `bff.env`

1. Adicionar variáveis da secção 1 conforme funcionalidades desejadas.
2. Confirmar `API__InternalKey`, `Jwt__Secret` e `Cors__AllowedOrigins` (inalterados face à 2.6.3).
3. **Não commitar** `bff.env` nem `api.env`.

### 3.2 Atualizar backend

```bash
cd REPO_DIR
git pull
git checkout v2.6.6    # ou branch/tag que contém a 2.6.6
docker compose build --no-cache
docker compose up -d
```

```bash
docker compose logs bff | tail -30
```

### 3.3 Atualizar frontend

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

O rodapé deve mostrar **2.6.6** (`frontend/package.json` → `version`).

---

## 4. Passos de atualização (desenvolvimento local)

1. `git pull` (ou checkout `v2.6.6`).
2. **BFF** — em `backend/bff/appsettings.Development.json`, secção `Integrations.DeepSeek` (ou env `DEEPSEEK__APIKEY`):

   ```json
   "DeepSeek": {
     "ApiKey": "sk-...",
     "Model": "deepseek-chat"
   }
   ```

3. API: `cd backend/api && dotnet run`
4. BFF: `cd backend/bff && dotnet run`
5. Frontend: `cd frontend && npm install && npm run dev`

---

## 5. Verificação após o deploy

### Operador

- [ ] Site público e login funcionam.
- [ ] Rodapé mostra **2.6.6**.
- [ ] **Novo post** / **Editar post** — duas colunas (Conteúdo + Prompt para arte) em viewport largo.
- [ ] Com `DEEPSEEK__APIKEY` configurada: **«Gerar prompt para arte»** preenche `#post-art-prompt` (com conteúdo Markdown).
- [ ] Com `INTEGRATIONS__OPENROUTER__APIKEY` configurada: **«Gerar capa»** gera imagem e actualiza preview da capa.
- [ ] Sem chave DeepSeek: «Gerar prompt» devolve **503** com mensagem legível (não expõe a chave).
- [ ] Integração n8n (se configurada): `X-Integration-Key` aceite em `POST /bff/integrations/posts` — ver [N8N-POST-INGEST.md](../integrations/N8N-POST-INGEST.md).

### Autores (formulário de post)

1. Escrever Markdown em **Conteúdo**.
2. **Gerar prompt para arte** → editar prompt se necessário.
3. **Gerar capa** → preview 16:9 → guardar post (só `cover_image` persiste; o prompt não).

---

## Só da 2.6.3 para a 2.6.4

Se já tens a **2.6.3** em produção e queres apenas a integração n8n:

1. `git pull` + `git checkout v2.6.4`
2. Configurar `INTEGRATIONS__APIKEY`, `INTEGRATIONS__ADMINAUTHORID` e opcionalmente `INTEGRATIONS__OPENROUTER__*` em `bff.env`
3. `docker compose build --no-cache && docker compose up -d`
4. Rebuild e deploy do frontend (**2.6.4**)
5. Configurar workflow n8n conforme [N8N-POST-INGEST.md](../integrations/N8N-POST-INGEST.md)

**Sem** scripts SQL, Caddyfile ou `api.env` novos.

---

## Só da 2.6.4 para a 2.6.5

1. `git pull` + `git checkout v2.6.5`
2. Se ainda não tens: `INTEGRATIONS__OPENROUTER__APIKEY` em `bff.env` (para «Gerar capa»)
3. `docker compose build --no-cache && docker compose up -d`
4. Rebuild e deploy do frontend (**2.6.5**)
5. Verificar formulário **Novo/Editar post** — painel lateral e botão **Gerar capa**

**Sem** `DEEPSEEK__*` (prompt ainda não usa DeepSeek nesta versão).

---

## Só da 2.6.5 para a 2.6.6

1. `git pull` + `git checkout v2.6.6`
2. Adicionar `DEEPSEEK__APIKEY` (e opcionalmente `DEEPSEEK__MODEL`) em `bff.env`
3. `docker compose build bff --no-cache && docker compose up -d bff`
4. Rebuild e deploy do frontend (**2.6.6**)
5. Verificar **«Gerar prompt para arte»** e alinhamento visual do formulário

OpenRouter mantém-se para **«Gerar capa»**; DeepSeek é só para o prompt.

---

## Só da 2.6.6 para a 2.6.7 (bugfix DeepSeek)

Se **«Gerar prompt para arte»** devolve **503** mesmo com `DEEPSEEK__APIKEY` em `bff.env` (versão **2.6.6**):

1. `git pull` + `git checkout v2.6.7`
2. `docker compose build bff --no-cache && docker compose up -d bff`
3. Confirmar: `docker compose exec bff printenv | grep DEEPSEEK`
4. Testar de novo no formulário de post

**Causa (2.6.6):** placeholder vazio `Integrations:DeepSeek:ApiKey` em `appsettings.json` impedia o fallback para `DEEPSEEK__APIKEY`. Corrigido na **2.6.7**.

**Sem** alterações em `bff.env`, frontend nem migrações SQL.

---

## 6. Avisos importantes

- **Chaves no BFF apenas:** `DEEPSEEK__APIKEY` e `INTEGRATIONS__OPENROUTER__APIKEY` **nunca** vão para o frontend nem para `api.env`.
- **Não commitar** ficheiros `.env`, `api.env`, `bff.env` nem chaves reais em `appsettings.Development.json`.
- **503 esperado** se uma funcionalidade estiver activa na UI mas a chave correspondente não estiver configurada no BFF.
- **Rollback:** `git checkout v2.6.3` + rebuild; remover variáveis novas de `bff.env` se necessário. Sem impacto na base de dados.

---

## 7. Referências

- [CHANGELOG.md](../changelog/CHANGELOG.md) — secções **[2.6.4]** a **[2.6.6]**
- [FUNCIONALIDADES.md](../FUNCIONALIDADES.md) — contratos `generate-cover-art-prompt` e `generate-openrouter`
- [DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md) — instalação inicial
- [ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) — `git pull` rotineiro
- [ATUALIZAR-2-5-3-PARA-2-6-1.md](ATUALIZAR-2-5-3-PARA-2-6-1.md) — versões anteriores (2.6.0–2.6.3)
- [PRODUCTION-CHECKLIST.md](../security/PRODUCTION-CHECKLIST.md)
