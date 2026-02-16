# Atualizar o código (local e Docker)

Este guia descreve como **atualizar** o projeto após um `git pull`. Há duas secções: **Atualização local** (desenvolvimento) e **Atualização Docker** (produção). Para instalação inicial em servidor com Docker e Caddy, ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)** (nesta pasta).

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

Na secção **Atualização Docker**, usa **REPO_DIR** para o diretório do repositório no servidor (ex.: onde fizeste `git clone`) e **DOCUMENT_ROOT** para a pasta onde o Caddy serve os estáticos (para onde copias o `dist` do frontend).

---

## Atualização local (desenvolvimento)

Para desenvolver em máquina local com API e BFF a correr por `dotnet run` e frontend por Vite:

1. **Pull** do código:
   ```bash
   git pull
   ```

2. **API**: A partir de `backend/api` para que o `blog.db` e as migrações usem o mesmo diretório:
   ```bash
   cd backend/api
   dotnet build
   dotnet run
   ```
   A API executa `MigrateAsync()` ao arranque; as migrações pendentes são aplicadas ao `blog.db` nesta pasta. Se aparecer erro "no such column" (ex.: ViewCount, IncludeInStoryOrder), ver a subsecção **Scripts de banco de dados (aplicação manual)** abaixo ou o **Troubleshooting** em `backend/api/README.md`.

3. **BFF**: Noutro terminal, a partir da raiz do repo:
   ```bash
   cd backend/bff
   dotnet build
   dotnet run
   ```

4. **Frontend**: Noutro terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Se a base de dados estiver desatualizada e preferires aplicar scripts SQL manualmente em vez de depender do `MigrateAsync()`, usa os comandos da secção **Scripts de banco de dados (aplicação manual)** (ambiente **Local**).

---

## Atualização Docker (produção)

Para quem **já instalou** o blog no servidor com Docker (API e BFF em contentores, Caddy no host). Pré-requisitos: diretório do repositório no servidor (ex.: REPO_DIR), `api.env` e `bff.env` na raiz do repositório, Caddy a servir estáticos e proxy `/bff`.

Os contentores da API e do BFF correm como **não-root** (UID 10000). Na **primeira vez** que atualizas para uma versão que usa contentores não-root (ou se mudaste de servidor), deves seguir **[CONFIGURAR-SERVIDOR-NAO-ROOT.md](CONFIGURAR-SERVIDOR-NAO-ROOT.md)** (secção "Migração desde root") para aplicar as permissões às pastas `data/` e `frontend/public/images/posts` antes de `docker compose up -d`. Depois disso, as atualizações seguem os passos abaixo.

### 1. Backend (API e BFF)

Na raiz do repositório no servidor (REPO_DIR):

```bash
cd REPO_DIR
git pull
docker compose build --no-cache
docker compose up -d
```

Isto atualiza o código, reconstrói as imagens e sobe os contentores. Os dados (SQLite) permanecem na pasta `data/` no host (bind mount); as migrações EF Core são aplicadas ao arranque da API. O passo de **reconstrução** (`docker compose build --no-cache`) é **essencial** quando há novas migrações: a nova imagem contém o código das migrações e, ao arrancar, a API aplica-as; se não reconstruir, o esquema não será atualizado.

### 2. Frontend

O frontend é construído no host e servido pelo Caddy:

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

Substitui `seu-dominio.com` pelo teu domínio público e `DOCUMENT_ROOT` pela pasta onde o Caddy serve os estáticos (ex.: onde copias o `dist`).

### 3. Caddy (opcional)

Se adicionaste ou alteraste regras no Caddyfile (ex.: para servir `/sitemap.xml` e `/robots.txt` pelo BFF), ver a secção do Caddyfile em **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)** e recarregar:

```bash
sudo systemctl reload caddy
```

Se precisares de aplicar scripts de banco manualmente em Docker (ex.: coluna em falta), ver a secção **Scripts de banco de dados (aplicação manual)** (ambiente **Docker**) ou o **README da API** (`backend/api/README.md`, Troubleshooting).

---

## Scripts de banco de dados (aplicação manual)

Quando a API falha com "no such column" (ex.: ViewCount, IncludeInStoryOrder), podes aplicar o esquema manualmente com os scripts em `backend/api/Migrations/Scripts/`. Com a pasta de dados no host (bind mount `data/`, predefinido), podes executar os scripts **no host** a partir de REPO_DIR — ver **[EXPOR-DB-NO-HOST.md](../database/EXPOR-DB-NO-HOST.md)**. Detalhes completos (incl. Docker com volume nomeado) estão no **README da API** (`backend/api/README.md`, Troubleshooting).

| Script | Coluna | Quando usar |
|--------|--------|-------------|
| `add_view_count_to_posts.sql` | ViewCount (contagem de visualizações) | Erro "no such column: p.ViewCount" |
| `add_include_in_story_order_to_posts.sql` | IncludeInStoryOrder ("faz parte da ordem da história") | Erro "no such column: p.IncludeInStoryOrder" |
| `add_scheduled_publish_at_to_posts.sql` | ScheduledPublishAt (agendamento de publicação) | Erro "no such column: p.ScheduledPublishAt" |

### Local

A partir da pasta onde está o `blog.db` (ex.: `backend/api`):

```bash
cd backend/api
sqlite3 blog.db < Migrations/Scripts/add_view_count_to_posts.sql
# ou, para IncludeInStoryOrder:
sqlite3 blog.db < Migrations/Scripts/add_include_in_story_order_to_posts.sql
# ou, para ScheduledPublishAt:
sqlite3 blog.db < Migrations/Scripts/add_scheduled_publish_at_to_posts.sql
```

Substitui `blog.db` pelo caminho do teu ficheiro SQLite se for outro. Executa **uma vez** por script; se a coluna já existir, o SQLite pode devolver erro (pode ignorar). Depois reinicia a API.

### Docker

**Se usas a pasta `data/` no host (bind mount, predefinido):** a partir de REPO_DIR, executa no host: `sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql` (ou o script adequado, ex.: `add_scheduled_publish_at_to_posts.sql`). Depois: `docker compose restart api`. Ver **[EXPOR-DB-NO-HOST.md](../database/EXPOR-DB-NO-HOST.md)**.

**Se ainda usas volume nomeado** (configuração antiga):

1. Obter o nome do volume da API: `docker volume ls | grep blog_api_data`.
2. **Opção A** — Executar o script dentro de um contentor temporário com sqlite3 (substituir `NOME_DO_VOLUME`):
   ```bash
   docker run --rm -v NOME_DO_VOLUME:/data -v $(pwd)/backend/api/Migrations/Scripts:/scripts ubuntu:22.04 sh -c "apt-get update -qq && apt-get install -y -qq sqlite3 && sqlite3 /data/blog.db < /scripts/add_view_count_to_posts.sql"
   ```
   Para IncludeInStoryOrder, usar `/scripts/add_include_in_story_order_to_posts.sql`. Para ScheduledPublishAt, usar `/scripts/add_scheduled_publish_at_to_posts.sql`.
3. **Opção B** — Copiar a base para o host, executar o script no host e devolver ao volume (ver `backend/api/README.md`, Troubleshooting, para os comandos completos).

Depois: `docker compose up -d api`.

---

## Resumo

| Ambiente | Etapa | Comando (resumido) |
|----------|--------|---------------------|
| **Local** | Código | `git pull` |
| **Local** | API | `cd backend/api && dotnet build && dotnet run` |
| **Local** | BFF | `cd backend/bff && dotnet run` |
| **Local** | Frontend | `cd frontend && npm install && npm run dev` |
| **Docker** | Código | `cd REPO_DIR && git pull` |
| **Docker** | Backend | `docker compose build --no-cache && docker compose up -d` |
| **Docker** | Frontend | `cd frontend && npm install && VITE_BFF_URL=https://seu-dominio.com npm run build && cp -r dist DOCUMENT_ROOT` |

Para instalação inicial em servidor, recuperação de senha do Admin ou problemas de arranque, ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)**.
