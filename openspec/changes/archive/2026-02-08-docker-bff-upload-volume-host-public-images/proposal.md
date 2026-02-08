# Docker: volume para upload de imagens de capa em frontend/public/images/posts

## Summary

No deploy com **Docker + Caddy** (Ubuntu), a funcionalidade de **envio de imagem de capa** no formulário de post não funciona corretamente: o ficheiro é enviado ao BFF e o BFF pode devolver 200 OK, mas a imagem **não aparece** no post porque (1) o BFF grava dentro do contentor num path que não está mapeado para o host e (2) o Caddy no host não serve esse path. O utilizador não vê a imagem após o upload.

**Solução:** Mapear o diretório **`frontend/public/images/posts`** do repositório (no host) para o path que o BFF usa **dentro do contentor** (`/frontend/public/images/posts`), através de um **volume** no `docker-compose.yml`. Assim, os ficheiros gravados pelo BFF ficam em **REPO_DIR/frontend/public/images/posts** no servidor (ex.: `/var/www/blog/repo/frontend/public/images/posts`), é mais fácil mapear imagens, fazer backup e limpar registos. Em seguida, configurar o Caddy para servir esse mesmo diretório em **`/images/posts/`**, para que as URLs devolvidas pelo BFF (`/images/posts/xxx.jpg`) sejam servidas pelo Caddy.

O BFF já usa, por defeito (quando `Uploads:ImagesPath` não está definido), o path `ContentRootPath + "../../frontend/public/images/posts"`. Dentro do contentor, o Content Root é `/app`, pelo que o path resolvido é **`/frontend/public/images/posts`**. Ao montar o host `./frontend/public/images/posts` nesse path no contentor, **não é necessária** configuração extra no BFF (nenhum `Uploads__ImagesPath` em bff.env); o comportamento por defeito passa a gravar no host.

## Goals

1. **Volume no docker-compose**: No serviço `bff`, adicionar um volume que monte `./frontend/public/images/posts` (path no host, relativo ao diretório do compose, normalmente REPO_DIR) em **`/frontend/public/images/posts`** dentro do contentor. Assim, o `GetUploadsPath()` do BFF (path por defeito) escreve diretamente nessa pasta no host.
2. **Documentação**: Atualizar **DEPLOY-DOCKER-CADDY.md** para (1) indicar que, com o volume incluído no compose, os uploads vão para **REPO_DIR/frontend/public/images/posts** no servidor; (2) incluir um exemplo claro de bloco Caddy **`handle /images/posts/*`** (ou `/images/*`) que sirva esse diretório (ex.: `root * REPO_DIR/frontend/public/images` para que `/images/posts/xxx.jpg` seja servido); (3) colocar esse handle **antes** do `handle` dos estáticos do SPA; (4) mencionar permissões (a pasta deve ser gravável pelo utilizador com que o processo do BFF corre no contentor; criar a pasta no host se necessário e ajustar permissões).
3. **Spec**: Delta em project-docs (e, se fizer sentido, referência em post-cover-display) a exigir que o deploy Docker descreva o volume de uploads e o serve do Caddy para `/images/posts/`, de forma que a imagem enviada apareça no post.

## Out of scope

- Alterar a API ou a lógica do BFF (apenas uso do path por defeito com volume).
- Suporte a outros backends (ex.: S3); manter armazenamento local em disco.

## Success criteria

- Com `docker compose up` a partir de REPO_DIR, o BFF grava as imagens de capa em **REPO_DIR/frontend/public/images/posts** no host.
- Após configurar o Caddy conforme a documentação, as URLs `/images/posts/xxx.jpg` são servidas e a imagem aparece no post após o autor fazer upload.
- O guia DEPLOY-DOCKER-CADDY.md descreve de forma explícita o volume e o bloco Caddy para `/images/posts/`.
- `openspec validate docker-bff-upload-volume-host-public-images --strict` passa.
