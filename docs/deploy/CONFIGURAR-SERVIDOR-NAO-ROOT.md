# Configurar o servidor para contentores não-root

Os contentores da **API** e do **BFF** correm como utilizador **não-root** (UID 10000) por razões de segurança. Para que a API consiga escrever na base de dados SQLite e no ficheiro de trigger de reset de senha do Admin, e o BFF consiga gravar as imagens de capa dos posts, as pastas montadas no host **têm de pertencer** ao UID:GID **10000:10000**.

Substitui **REPO_DIR** pelo caminho do repositório no servidor (ex.: `/var/www/blog/repo` ou onde fizeste `git clone`).

---

## 1. Deploy novo (instalação pela primeira vez)

Antes do primeiro `docker compose up -d`, cria as pastas e atribui o dono correto:

```bash
cd REPO_DIR
sudo mkdir -p data frontend/public/images/posts
sudo chown -R 10000:10000 data frontend/public/images/posts
```

Depois, build e arranque dos contentores:

```bash
docker compose build
docker compose up -d
```

Ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)** para o resto do deploy (api.env, bff.env, Caddy, frontend).

---

## 2. Migração desde root (já tens dados em produção)

Se já tens o blog a correr com contentores como root e vais atualizar para não-root:

1. **Parar os contentores** (para evitar escrita durante o chown):
   ```bash
   cd REPO_DIR
   docker compose down
   ```

2. **Atribuir dono das pastas** ao UID do contentor (os ficheiros existentes em `data/` e `frontend/public/images/posts` passam a pertencer a 10000:10000):
   ```bash
   sudo chown -R 10000:10000 data frontend/public/images/posts
   ```

3. **Atualizar código e imagens** e subir de novo:
   ```bash
   git pull
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Frontend** (se aplicável): build e cópia para o document root do Caddy conforme **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)**.

---

## 3. Verificação

- **Confirmar que os contentores correm como UID 10000:**
  ```bash
  docker compose exec api id
  docker compose exec bff id
  ```
  Deves ver `uid=10000(app) gid=10000(app)` (ou equivalente).

- **API a gravar na base:** criar ou editar um post na área do autor; publicar; confirmar que não há erros. Se aparecer "readonly database" nos logs da API, as permissões de `data/` no host estão incorretas (ver Troubleshooting).

- **BFF a gravar uploads:** enviar uma imagem de capa num post e confirmar que a imagem aparece no artigo. Se o upload devolver sucesso mas a imagem não aparecer, ou se os logs do BFF mostrarem "Permission denied" em `/frontend/public/images/posts`, verifica o dono dessa pasta no host (ver Troubleshooting).

---

## 4. Troubleshooting

### Erro "readonly database" (API)

- **Causa:** A pasta `data/` no host não é gravável pelo utilizador do contentor (UID 10000).
- **Resolução:** No host, a partir de REPO_DIR:
  ```bash
  sudo chown -R 10000:10000 data
  docker compose restart api
  ```

### "Permission denied" ao gravar imagens (BFF)

- **Causa:** A pasta `frontend/public/images/posts` no host não pertence a 10000:10000.
- **Resolução:** No host, a partir de REPO_DIR:
  ```bash
  sudo chown -R 10000:10000 frontend/public/images/posts
  docker compose restart bff
  ```

### Após clone ou nova cópia do repositório

Se fizeres um clone novo noutro caminho (ou recriares as pastas), volta a executar o `chown` antes de `docker compose up -d`:

```bash
cd REPO_DIR
sudo mkdir -p data frontend/public/images/posts
sudo chown -R 10000:10000 data frontend/public/images/posts
```

---

Para instalação inicial completa, ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)**. Para apenas atualizar o código, ver **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)**.
