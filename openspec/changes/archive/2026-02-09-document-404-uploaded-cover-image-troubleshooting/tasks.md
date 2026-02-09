# Tasks: document-404-uploaded-cover-image-troubleshooting

## 1. Troubleshooting em DEPLOY-DOCKER-CADDY

- [x] 1.1 Em **DEPLOY-DOCKER-CADDY.md**, adicionar uma subsecção (ex.: **8.2** ou dentro de "Problemas comuns") com o título **"Imagem de capa: upload sem erro mas imagem não aparece (404 em /images/posts/)"**. Incluir: (a) sintoma — o upload devolve 200 OK, mas a imagem não é exibida no post; no console do browser (DevTools → Network) o pedido GET a `https://teu-dominio/images/posts/xxx.jpg` devolve **404**; (b) causa — o Caddy não está a servir o diretório de uploads em `/images/posts/`, ou o volume do BFF para `frontend/public/images/posts` não está montado; (c) solução — confirmar que o `docker-compose.yml` inclui o volume `./frontend/public/images/posts:/frontend/public/images/posts` no serviço BFF; adicionar no Caddyfile o bloco `handle /images/posts/*` com `root * REPO_DIR/frontend/public/images` e `file_server` (ver secção 6 para exemplo completo); executar `sudo systemctl reload caddy`.

## 2. Spec delta (opcional)

- [x] 2.1 Em `openspec/changes/document-404-uploaded-cover-image-troubleshooting/specs/project-docs/spec.md`, ADDED requirement: a documentação de deploy Docker deve incluir uma entrada de troubleshooting para o cenário em que o upload da imagem de capa devolve sucesso mas o GET a `/images/posts/xxx.jpg` devolve 404, com causa e passos de resolução (volume BFF e Caddy handle). Incluir cenário: operador vê 404 no console; consulta o guia e aplica a correção.

## 3. Validação

- [x] 3.1 Executar `openspec validate document-404-uploaded-cover-image-troubleshooting --strict` e corrigir falhas.
