# Tasks: docker-bff-upload-volume-host-public-images

## 1. Volume no docker-compose

- [x] 1.1 Em `docker-compose.yml`, no serviço `bff`, adicionar um volume que monte `./frontend/public/images/posts` no host em `/frontend/public/images/posts` no contentor, para que o BFF grave os uploads nessa pasta no servidor (path por defeito de GetUploadsPath() no contentor).

## 2. Documentação DEPLOY-DOCKER-CADDY

- [x] 2.1 Em **DEPLOY-DOCKER-CADDY.md**, na secção do Caddy (secção 6), atualizar o parágrafo "Imagens de capa (upload local)": indicar que o `docker-compose.yml` inclui o volume `./frontend/public/images/posts:/frontend/public/images/posts`, pelo que os uploads ficam em **REPO_DIR/frontend/public/images/posts** no servidor (ex.: `/var/www/blog/repo/frontend/public/images/posts`); não é necessário definir `Uploads__ImagesPath` no bff.env.
- [x] 2.2 Incluir no exemplo de Caddyfile um bloco **antes** do handle dos estáticos, por exemplo: `handle /images/posts/* { root * /caminho/para/repo/frontend/public/images ; file_server }`, com nota a substituir `/caminho/para/repo` por REPO_DIR (ex.: `/var/www/blog/repo`), para que as imagens enviadas sejam servidas em `/images/posts/`.
- [x] 2.3 Adicionar uma nota sobre permissões: garantir que a pasta `frontend/public/images/posts` existe no host e é gravável pelo processo do BFF no contentor (ex.: criar com `mkdir -p` e, se necessário, `chown` ou permissões adequadas); referir que a pasta já existe no repo (`.gitkeep`) após o clone.

## 3. Spec delta

- [x] 3.1 Em `openspec/changes/docker-bff-upload-volume-host-public-images/specs/project-docs/spec.md`, ADDED (ou MODIFIED) requirement: na documentação de deploy Docker (DEPLOY-DOCKER-CADDY.md), o compose deve montar o diretório de uploads de capa (ex.: REPO_DIR/frontend/public/images/posts) no contentor do BFF no path que o BFF usa por defeito (/frontend/public/images/posts), e o Caddy deve servir esse diretório em `/images/posts/` para que as imagens enviadas apareçam no post. Incluir cenário: operador segue o guia; após upload de capa, a imagem é gravada no host e visível na página do post.

## 4. Validação

- [x] 4.1 Executar `openspec validate docker-bff-upload-volume-host-public-images --strict` e corrigir falhas.
