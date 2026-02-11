# Expor a base de dados no host (Docker)

Este documento descreve como a base de dados SQLite (`blog.db`) fica **no servidor** (host) quando se usa Docker, facilitando a execução de **scripts manuais** (ex.: migrações SQL) com `sqlite3` sem contentores temporários.

## Objectivo

O `docker-compose.yml` do projeto usa por defeito um **bind mount** `./data:/data`: a pasta `data/` na raiz do repositório (ou no diretório onde corres `docker compose`) é montada em `/data` dentro do contentor da API. O ficheiro `blog.db` e o trigger de recuperação de senha do Admin ficam em `data/blog.db` e `data/admin-password-reset.trigger` no host, acessíveis para backup e para executar scripts SQL manualmente.

## Passo a passo (configuração por defeito)

1. **Pasta `data/`**: A pasta `data/` existe no repositório (com `.gitkeep`). Se não existir no teu clone, cria-a na raiz do projeto: `mkdir -p data`. O conteúdo sensível (`*.db`, `*.trigger`) está no `.gitignore` e não é commitado.

2. **Arrancar os contentores**: Na raiz do repositório (REPO_DIR no servidor):
   ```bash
   cd REPO_DIR
   docker compose up -d
   ```
   No primeiro arranque, a API cria `data/blog.db` e aplica as migrações EF Core automaticamente.

3. **Executar scripts manuais no host**: Quando precisares de aplicar um script SQL (ex.: coluna em falta após atualização sem reconstruir a imagem), a partir da **raiz do repositório**:
   ```bash
   sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql
   # ou, por exemplo:
   sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_include_in_story_order_to_posts.sql
   sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql
   ```
   Reinicia a API após aplicar o script: `docker compose restart api`. Instala `sqlite3` no host se necessário (ex.: `sudo apt install sqlite3` em Ubuntu/Debian).

4. **Recuperar senha do Admin**: O ficheiro de trigger também fica no host:
   ```bash
   touch data/admin-password-reset.trigger
   docker compose restart api
   ```
   Depois faz login com a **senha padrão inicial** e altera no modal.

## Migração desde o volume nomeado (quem já usava `blog_api_data`)

Se já tens dados no **volume nomeado** antigo (`blog_api_data`) e queres passar para a pasta `data/` no host sem perder dados:

1. **Parar os contentores** (sem remover volumes): `docker compose down` (não uses `-v`).

2. **Copiar o conteúdo do volume para a pasta `data/`** (substituir `NOME_DO_VOLUME` pelo resultado de `docker volume ls | grep blog_api_data`, ex.: `simple-blog-hub_blog_api_data`):
   ```bash
   docker run --rm -v NOME_DO_VOLUME:/from -v $(pwd)/data:/to alpine cp -a /from/. /to/
   ```

3. **Alterar o `docker-compose.yml`** (se ainda não estiver alterado): em `api` → `volumes`, usar `./data:/data` e remover o bloco `volumes: blog_api_data:` no final do ficheiro.

4. **Arrancar de novo**: `docker compose up -d`. A API passa a usar `data/blog.db` no host.

5. (Opcional) **Remover o volume antigo** depois de confirmar que tudo funciona: `docker volume rm NOME_DO_VOLUME`.

## Usar outra pasta no host

Se quiseres que o `blog.db` fique noutra pasta do servidor (ex.: `/var/lib/blog-data`), em vez de `./data`:

1. Cria a pasta e ajusta permissões (ex.: `sudo mkdir -p /var/lib/blog-data`, `sudo chown 1000:1000 /var/lib/blog-data`).
2. No `docker-compose.yml`, altera o volume do serviço `api` para `./data:/data` → `/var/lib/blog-data:/data` (usando o caminho absoluto no host).
3. Para scripts manuais, usa: `sqlite3 /var/lib/blog-data/blog.db < backend/api/Migrations/Scripts/nome.sql` (a partir de REPO_DIR, ou com o caminho completo ao script).

Para um guia com **os teus caminhos específicos** (não commitado), podes criar `docs/local/expor-db-servidor.md` e preenchê-lo; a pasta `docs/local/` está no `.gitignore`.
