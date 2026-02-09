# Documentar: imagem de capa 404 após upload (GET /images/posts/xxx.jpg)

## Summary

No deploy com **Docker + Caddy**, o autor pode enviar uma imagem de capa no formulário de post e o pedido de upload devolver **200 OK** (sem erro na interface), mas a **imagem não aparece** no post. No **console do browser** (DevTools → Network) surge um pedido **GET** a `https://dominio/images/posts/<id>.jpg` que devolve **404**. Isto ocorre quando (1) o Caddy **não** está a servir o diretório de uploads em `/images/posts/`, ou (2) o volume do BFF que mapeia `frontend/public/images/posts` não está montado/configurado, pelo que o ficheiro não existe no path que o Caddy serviria.

A solução já está descrita na secção 6 do DEPLOY-DOCKER-CADDY (volume no compose + handle no Caddyfile), mas operadores que já tenham o deploy em produção e vejam este 404 podem não associar o sintoma à configuração. Objetivo: adicionar uma entrada de **troubleshooting** explícita que descreva o **sintoma** (upload OK, imagem não aparece, 404 em GET /images/posts/xxx.jpg) e a **solução** (volume BFF + Caddy handle /images/posts/*), para que quem pesquisa por "404" ou "imagem não aparece" encontre o remédio.

## Goals

1. **DEPLOY-DOCKER-CADDY.md**: Adicionar uma subsecção de troubleshooting (ex.: após a secção 8.1 ou dentro de uma secção "Problemas comuns") com o título **"Imagem de capa: upload sem erro mas imagem não aparece (404 em /images/posts/)"**. Conteúdo: descrição do sintoma (pedido de upload devolve 200; no console do browser, GET a `https://teu-dominio/images/posts/xxx.jpg` devolve 404); causa (Caddy não serve esse path, ou volume do BFF em falta); passos para resolver (confirmar volume no docker-compose no serviço BFF; adicionar no Caddyfile o bloco `handle /images/posts/*` com `root * REPO_DIR/frontend/public/images` e `file_server`; recarregar Caddy). Referência à secção 6 para o exemplo completo do Caddyfile.
2. **Spec (opcional)**: Delta em project-docs exigindo que a documentação de deploy Docker inclua troubleshooting para o cenário 404 em GET /images/posts/ após upload de capa.

## Out of scope

- Alterar código da aplicação; apenas documentação.
- Duplicar o exemplo completo do Caddyfile (apenas referenciar a secção 6).

## Success criteria

- Um operador que veja "GET https://blog.1nodado.com.br/images/posts/xxx.jpg 404" no console encontra no DEPLOY-DOCKER-CADDY uma entrada que explica a causa e os passos para corrigir (volume + Caddy).
- `openspec validate document-404-uploaded-cover-image-troubleshooting --strict` passa.
