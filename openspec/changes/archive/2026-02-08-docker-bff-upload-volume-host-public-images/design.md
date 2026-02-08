# Design: docker-bff-upload-volume-host-public-images

## Context

- O BFF expõe `POST /bff/uploads/cover` e grava o ficheiro em `GetUploadsPath()`.
- **Path por defeito:** `Path.Combine(ContentRootPath, "..", "..", "frontend", "public", "images", "posts")`. No contentor, `ContentRootPath` = `/app` → path absoluto **`/frontend/public/images/posts`**.
- No contentor não existe a árvore do repo; sem volume, esse path ou não é gravável ou fica efémero e não é servido pelo Caddy no host.

## Approach

- **Um único volume no BFF:** `./frontend/public/images/posts:/frontend/public/images/posts`. O Docker Compose resolve `./frontend/public/images/posts` em relação ao diretório do compose (REPO_DIR no servidor). Dentro do contentor, `/frontend/public/images/posts` passa a ser essa pasta do host. O BFF não precisa de `Uploads__ImagesPath`; o path por defeito já aponta para o volume.
- **Caddy:** Servir essa mesma pasta no host em `/images/posts/`. O Caddyfile precisa de um `handle /images/posts/*` (ou `handle /images/*`) com `root * <REPO_DIR>/frontend/public/images` e `file_server`, de forma que um pedido a `https://dominio.com/images/posts/abc.jpg` devolva o ficheiro `REPO_DIR/frontend/public/images/posts/abc.jpg`. Este handle deve vir **antes** do handle dos estáticos (root do SPA), para não ser engolido pelo `try_files {path} /index.html`.
- **Permissões:** O processo do BFF no contentor corre tipicamente como utilizador não-root. Se a pasta no host for criada pelo Docker ao montar, pode ter permissões que impedem escrita. A documentação deve referir: criar a pasta no host se não existir (`mkdir -p frontend/public/images/posts`) e, se necessário, ajustar dono ou permissões (ex.: `chown` para o UID do processo no contentor, ou 775 com grupo adequado). O repositório já tem `frontend/public/images/posts` com `.gitkeep`, pelo que em clones a pasta existe.

## Alternativas consideradas

- **Configurar Uploads__ImagesPath e montar outro path (ex.: /uploads):** Funciona, mas exige que cada operador configure bff.env e Caddy a apontar para o mesmo path. Usar o path por defeito + volume para `frontend/public/images/posts` mantém o repo como única fonte de verdade e dispensa configuração extra.
- **Servir /images/posts a partir do DOCUMENT_ROOT (cópia do dist):** O build do frontend (`npm run build`) não inclui uploads; os estáticos são copiados para outro sítio (DOCUMENT_ROOT). Por isso `/images/posts/` tem de ser servido a partir da pasta real de uploads (REPO_DIR/frontend/public/images/posts), não do DOCUMENT_ROOT.
