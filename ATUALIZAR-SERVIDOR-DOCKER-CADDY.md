# Atualizar o código no servidor (deploy Docker/Caddy)

Este guia é para quem **já instalou** o blog no servidor seguindo **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)** (Docker para API e BFF, Caddy no host a servir o frontend e o proxy `/bff`). Aqui descreve-se apenas como **atualizar** o código após um `git pull` — não cobre a instalação inicial.

---

## Pré-requisitos

- O servidor está configurado como em DEPLOY-DOCKER-CADDY.md: diretório do projeto (ex.: `/var/www/blog/repo`), ficheiros `api.env` e `bff.env` na raiz do repositório, Caddy a servir estáticos em `/var/www/blog/dist` e a fazer proxy de `/bff` para o BFF.
- Tens acesso SSH (ou equivalente) ao servidor e permissão para executar `docker compose`, `npm`, e (opcionalmente) `sudo systemctl reload caddy`.

---

## Passos para atualizar

### 1. Backend (API e BFF)

Na raiz do repositório no servidor:

```bash
cd /var/www/blog/repo
git pull
docker compose build --no-cache
docker compose up -d
```

Isto atualiza o código, reconstrói as imagens Docker da API e do BFF e sobe os contentores. Os dados (SQLite) permanecem no volume Docker; as migrações EF Core são aplicadas ao arranque da API quando necessário.

### 2. Frontend

O frontend é construído no host e servido pelo Caddy. Ajusta o domínio em `VITE_BFF_URL` se for diferente no teu caso:

```bash
cd /var/www/blog/repo/frontend
npm install
VITE_BFF_URL=https://blog.1nodado.com.br npm run build
cp -r dist /var/www/blog/
```

Isto instala dependências, faz o build do frontend e copia os estáticos para o document root do Caddy (`/var/www/blog/dist`).

### 3. Caddy (opcional)

Para alterações só nos estáticos, normalmente não é necessário reiniciar o Caddy. Se quiseres garantir que o Caddy recarrega a configuração:

```bash
sudo systemctl reload caddy
```

---

## Atualizar a partir de uma versão antiga

Se estiveres a atualizar a partir de uma versão que **não** tinha determinadas colunas ou tabelas (por exemplo, a coluna `ViewCount` nos posts), a API aplica as migrações EF Core ao arranque. Se usares um script de migração manual em vez das migrações automáticas, consulta o **README da API** (`backend/api/README.md`) ou a documentação do script (ex.: secção de migrações ou upgrade no DEPLOY-DOCKER-CADDY.md) para saber quando e como executá-lo.

---

## Resumo

| Etapa      | Comando (resumido) |
|-----------|---------------------|
| Código    | `cd /var/www/blog/repo && git pull` |
| Backend   | `docker compose build --no-cache && docker compose up -d` |
| Frontend  | `cd frontend && npm install && VITE_BFF_URL=... npm run build && cp -r dist /var/www/blog/` |
| Caddy     | (opcional) `sudo systemctl reload caddy` |

Para instalação inicial, problemas de arranque da API ou recuperação de senha do Admin, ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)**.
