# Deploy com Docker no Ubuntu 24.04 (Caddy no host)

Instruções para publicar o **1noDado RPG** usando **Docker** para a API e o BFF, num servidor **Ubuntu 24.04** com **Caddy** já instalado no host. O Caddy continua a servir o frontend estático e a fazer reverse proxy para o BFF; a API corre apenas na rede interna do Docker.

Fluxo: **Caddy (host)** → estáticos em DOCUMENT_ROOT (ex.: pasta onde copias o `dist`) e `/bff/*` → **BFF (contentor)** → **API (contentor)**. Usa **REPO_DIR** para o diretório do repositório no servidor e **DOCUMENT_ROOT** para a pasta onde o Caddy serve os estáticos.

---

## 1. Pré-requisitos no servidor

- **Ubuntu 24.04** com acesso root ou sudo.
- **Caddy** instalado e a correr (ex.: `systemctl status caddy`).
- **Docker** e **Docker Compose** (v2):
  - [Instalação oficial Docker Engine](https://docs.docker.com/engine/install/ubuntu/)
  - Docker Compose está incluído no plugin `docker-compose-plugin`.

Verificar:

```bash
docker --version
docker compose version
caddy version
```

Para build do frontend (no host): **Node.js** e **npm** (ex.: `sudo apt install nodejs npm` ou nvm).

---

## 2. Diretório e repositório

Escolher um diretório para o projeto no servidor (ex.: `/opt/blog` ou `/var/www/blog`). Exemplo (substituir `/caminho/do/projeto` pelo teu caminho):

```bash
sudo mkdir -p /caminho/do/projeto
sudo chown "$USER:$USER" /caminho/do/projeto
cd /caminho/do/projeto
git clone https://github.com/ricardopiloto/simple-blog-hub repo
cd repo
```

Daqui em diante, **REPO_DIR** = diretório onde está o clone (ex.: `/caminho/do/projeto/repo`). **DOCUMENT_ROOT** = pasta onde o Caddy servirá os estáticos (ex.: `/caminho/do/projeto/dist`).

Os ficheiros Docker estão no repositório: `backend/api/Dockerfile`, `backend/bff/Dockerfile`, `docker-compose.yml`.

---

## 3. Ficheiros de ambiente (API e BFF)

Criar `api.env` e `bff.env` na **raiz do repositório** (onde está o `docker-compose.yml`). Não commitar estes ficheiros (já estão no `.gitignore`). Podes usar como referência o ficheiro `.env.docker.example`.

**api.env** (ajustar valores):

```bash
ConnectionStrings__DefaultConnection=Data Source=/data/blog.db
API__InternalKey=seu-valor-secreto-forte-aqui
Admin__Email=admin@exemplo.com
```

**bff.env** (o `API__BaseUrl` é definido no `docker-compose.yml` como `http://api:5001`; não é preciso repetir):

```bash
API__InternalKey=seu-valor-secreto-forte-aqui
Jwt__Secret=outra-chave-secreta-min-32-caracteres-produção
```

O `API__InternalKey` deve ser **igual** nos dois ficheiros.

---

## 4. Build e arranque dos contentores

Na raiz do repositório:

```bash
docker compose build
docker compose up -d
```

Verificar:

```bash
docker compose ps
```

O BFF fica exposto em **127.0.0.1:5000** no host (apenas localhost). A API não está exposta; só o BFF a contacta na rede interna (`http://api:5001`).

**Migrações de base de dados:** Quando uma nova versão inclui **alterações na base de dados** (novas migrações EF Core), é necessário **reconstruir** a imagem da API (`docker compose build api` ou `docker compose build --no-cache`) antes de `docker compose up -d`, para que as migrações sejam aplicadas automaticamente ao arranque do contentor. Se não reconstruir, a imagem antiga não contém as novas migrações e o esquema não será atualizado.

---

## 5. Build do frontend (no host)

O frontend continua a ser construído no host e servido pelo Caddy (não corre em contentor).

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
```

Substituir `seu-dominio.com` pelo teu domínio público. Copiar os estáticos para o document root do Caddy (DOCUMENT_ROOT):

```bash
cp -r REPO_DIR/frontend/dist DOCUMENT_ROOT
```

---

## 6. Caddy: site e reverse proxy

O Caddy já está no host. Configurar o **teu domínio** no Caddyfile (ex.: `/etc/caddy/Caddyfile`). Substituir `seu-dominio.com` pelo teu domínio e `/caminho/para/estaticos` por DOCUMENT_ROOT (pasta onde copiaste o `dist`):

```caddyfile
seu-dominio.com {
    handle /sitemap.xml {
        reverse_proxy 127.0.0.1:5000
    }
    handle /robots.txt {
        reverse_proxy 127.0.0.1:5000
    }
    handle /bff/* {
        reverse_proxy 127.0.0.1:5000
    }
    handle {
        root * /caminho/para/estaticos
        file_server
        try_files {path} /index.html
    }
}
```

- **Ordem importante**: os `handle` de `/sitemap.xml`, `/robots.txt` e `/bff/*` têm de vir **antes** do `handle` dos estáticos. Assim, `/sitemap.xml` e `/robots.txt` são servidos pelo BFF na raiz do domínio (sitemap dinâmico e robots.txt com a linha Sitemap); pedidos a `/bff/*` (incl. POST de login) são reencaminhados para o BFF em `127.0.0.1:5000`. Caso contrário, pedidos POST para `/bff/auth/login` podem ser tratados pelo `file_server` e devolver **405 Method Not Allowed**.
- **handle** (resto): estáticos e fallback do SPA.

**Imagens de capa (upload local):** Se os autores usarem o upload de imagem de capa no formulário de post, os ficheiros são guardados num diretório configurável no BFF (`Uploads:ImagesPath`). É necessário (1) definir esse caminho em produção (ex.: volume ou pasta no host, como uma pasta irmã de DOCUMENT_ROOT, ex.: `/caminho/para/images/posts`) para que os uploads persistam entre deploys; (2) servir esse diretório em `/images/posts/` no Caddy. Exemplo no Caddyfile, **antes** do `handle` dos estáticos: `handle /images/* { root * /caminho/para/images ; file_server }`. Garantir que o BFF tem permissão de escrita nessa pasta (em Docker, montar um volume no contentor do BFF para o mesmo caminho e configurar `Uploads__ImagesPath` nesse caminho, e no host o Caddy serve a mesma pasta).

Recarregar o Caddy:

```bash
sudo systemctl reload caddy
```
Validar a configuração (opcional): `sudo caddy validate --config /etc/caddy/Caddyfile`.

---

## 7. Primeiro acesso

1. Abrir no browser a URL do teu domínio (ex.: **https://seu-dominio.com**).
2. Ir a **Login** e entrar com o e-mail do Admin (ex.: definido em `Admin__Email` ou **admin@admin.com**) e senha **senha123**.
3. Concluir a **troca obrigatória de senha** no modal.

---

## 8. Comandos úteis

| Ação | Comando |
|------|--------|
| Ver logs (API) | `docker compose logs -f api` |
| Ver logs (BFF) | `docker compose logs -f bff` |
| Parar | `docker compose down` |
| Arrancar de novo | `docker compose up -d` |
| Reconstruir após alterações no código | `docker compose build --no-cache && docker compose up -d` |

---

## 8.1. API a reiniciar sem ficar em pé

Se o contentor da API reinicia constantemente, ver o erro real:

```bash
# Últimas linhas do log (exceção .NET costuma aparecer aqui)
docker compose logs --tail=100 api
```

Causas comuns:

1. **Ficheiro `api.env` em falta ou com erro**  
   O ficheiro tem de estar na **raiz do repo** (junto ao `docker-compose.yml`). Conteúdo mínimo:
   ```bash
   ConnectionStrings__DefaultConnection=Data Source=/data/blog.db
   API__InternalKey=uma-chave-secreta-forte
   Admin__Email=admin@exemplo.com
   ```
   Se `api.env` não existir, criar e voltar a subir: `docker compose up -d api`.

2. **Permissões no volume**  
   Se o log indicar "Permission denied" em `/data`, o contentor pode não conseguir criar `blog.db`. Nesse caso, forçar permissões no volume (uma vez):
   ```bash
   docker compose run --rm --entrypoint "" api chown -R 1000:1000 /data
   docker compose up -d api
   ```
   (Se o processo não correr como UID 1000, ajustar conforme o log.)

3. **Correr a API uma vez sem restart**  
   Para ver a mensagem de erro no terminal:
   ```bash
   docker compose run --rm --no-deps api
   ```
   A aplicação vai sair ao falhar; a exceção aparece no stdout/stderr.

4. **"table Users has no column named MustChangePassword"**  
   A base foi criada com uma **imagem antiga** que não inclui a migração mais recente. É obrigatório **reconstruir a imagem** e usar um volume novo:
   ```bash
   docker compose down -v
   docker compose build --no-cache api
   docker compose up -d
   ```
   O `-v` em `down -v` remove os volumes. O `build --no-cache` garante que a imagem inclui todas as migrações (incl. `AddMustChangePasswordToUser`). Se ainda falhar, no servidor confirma que tens o código atualizado (`git pull`) antes de fazer o build.
   - **Se quiseres manter dados** em vez de apagar o volume: adicionar a coluna manualmente (nome do volume = nome do projeto + `_blog_api_data`, ex.: `repo_blog_api_data`):
   ```bash
   docker run --rm -v repo_blog_api_data:/data alpine sh -c "apk add --no-cache sqlite && sqlite3 /data/blog.db 'ALTER TABLE Users ADD COLUMN MustChangePassword INTEGER NOT NULL DEFAULT 0;'"
   docker compose up -d api
   ```

---

## 9. Persistência e recuperar senha do Admin

- **Base de dados**: o ficheiro SQLite da API fica **no servidor**, na pasta `data/` na raiz do repositório (bind mount para `/data` no contentor). O `blog.db` está em `REPO_DIR/data/blog.db`; podes executar scripts manuais no host com `sqlite3 data/blog.db < backend/api/Migrations/Scripts/nome.sql` (a partir de REPO_DIR). Ver **[EXPOR-DB-NO-HOST.md](EXPOR-DB-NO-HOST.md)** para detalhes e para migrar desde o volume nomeado antigo.

- **Recuperar senha do Admin**: criar o ficheiro de trigger na pasta de dados e reiniciar a API:

```bash
touch data/admin-password-reset.trigger
docker compose restart api
```

(Em alternativa: `docker compose exec api touch /data/admin-password-reset.trigger`.) Depois fazer login com a senha **senha123** e alterar no modal. A API remove o ficheiro após o reset.

---

## 10. Atualizar a aplicação (deploy posterior)

As atualizações subsequentes seguem o guia **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)**. Esse documento descreve os passos de atualização **Docker** (e também **local**, para desenvolvimento) e lista os **scripts de banco de dados** que podem ser aplicados manualmente (ViewCount, IncludeInStoryOrder), com instruções para cada ambiente.

**Backend (API e BFF):**

```bash
cd REPO_DIR
git pull
docker compose build --no-cache
docker compose up -d
```

O passo `docker compose build --no-cache` é **necessário para atualizações do esquema**: quando há novas migrações EF Core, a reconstrução garante que a nova imagem da API as inclui, e as migrações são aplicadas automaticamente quando o contentor arranca. Se omitir o build, o esquema não será atualizado.

**Frontend:**

```bash
cd REPO_DIR/frontend
npm install
VITE_BFF_URL=https://seu-dominio.com npm run build
cp -r dist DOCUMENT_ROOT
```

Não é necessário reiniciar o Caddy para alterações só nos estáticos; para garantir: `sudo systemctl reload caddy`.

---

## Resumo rápido

| Item | Valor |
|------|--------|
| Domínio | Teu domínio (ex.: seu-dominio.com; configurar no Caddyfile) |
| Estáticos | DOCUMENT_ROOT (build no host: `cd REPO_DIR/frontend && npm run build`, depois copiar `dist`) |
| API | Só na rede Docker (`http://api:5001`), não exposta no host |
| BFF | Exposto no host em 127.0.0.1:5000 (proxy Caddy em /bff) |
| Env | api.env e bff.env na raiz do repo (não commitar) |
| Dados API | Pasta `data/` no host (bind mount → /data no contentor; blog.db e trigger) — ver EXPOR-DB-NO-HOST.md |

---

## Alternativa: Caddy em contentor

Se preferires correr o Caddy também em Docker (em vez do Caddy no host), podes adicionar um serviço `caddy` ao `docker-compose.yml`, servir os estáticos por um volume montado e expor a porta 80/443. Nesse caso o Caddyfile passaria a estar no repo e o proxy apontaria para o serviço `bff:5000`. Este documento assume **Caddy no host** para reutilizar a configuração existente.
