# project-docs — delta for docker-bff-upload-volume-host-public-images

## ADDED Requirements

### Requirement: Deploy Docker monta volume de uploads de capa e Caddy serve /images/posts/

Para que a **funcionalidade de envio de imagem de capa** funcione no deploy com **Docker + Caddy**, a documentação de deploy (DEPLOY-DOCKER-CADDY.md) **deve** (SHALL) descrever que: (1) o **docker-compose** inclui um **volume** no serviço BFF que monta o diretório do repositório **frontend/public/images/posts** no host (ex.: REPO_DIR/frontend/public/images/posts) no path **/frontend/public/images/posts** dentro do contentor, de forma que o BFF grave os ficheiros enviados nessa pasta no servidor sem necessidade de configurar `Uploads__ImagesPath`; (2) o **Caddy** está configurado com um bloco **handle** para **/images/posts/** (ou /images/*) que serve esse mesmo diretório no host (ex.: `root * REPO_DIR/frontend/public/images` e `file_server`), **antes** do handle dos estáticos do SPA, para que as URLs devolvidas pelo BFF (ex.: /images/posts/xxx.jpg) sejam servidas e a imagem **apareça no post** após o autor fazer upload.

#### Scenario: Operador segue o guia e upload de capa funciona

- **Dado** que o operador fez o deploy conforme DEPLOY-DOCKER-CADDY.md (contentores API e BFF a correr, Caddy a fazer proxy para o BFF e a servir estáticos)
- **E** o docker-compose inclui o volume para frontend/public/images/posts no BFF e o Caddyfile inclui o handle para /images/posts/ a apontar para essa pasta no host
- **Quando** um autor faz login, abre Novo post ou Editar post, e envia uma imagem de capa (ficheiro)
- **Então** o BFF grava o ficheiro em REPO_DIR/frontend/public/images/posts no servidor
- **E** a URL da capa (ex.: /images/posts/abc123.jpg) é servida pelo Caddy a partir dessa pasta
- **E** a imagem aparece no formulário e na página pública do post após guardar
