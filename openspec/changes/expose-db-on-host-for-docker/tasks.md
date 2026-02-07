# Tasks: expose-db-on-host-for-docker

## 1. docker-compose: bind mount para pasta de dados

- [x] 1.1 No `docker-compose.yml`, alterar o serviço `api`: em `volumes`, substituir `blog_api_data:/data` por `./data:/data` (bind mount para a pasta `data/` na raiz do projeto).
- [x] 1.2 Remover o bloco `volumes:` e a linha `blog_api_data:` do final do ficheiro.
- [x] 1.3 Criar a pasta `data/` na raiz do projeto e adicionar `data/.gitkeep` para que a pasta exista no clone.
- [x] 1.4 No `.gitignore`, adicionar entradas para não versionar ficheiros sensíveis dentro de `data/`: `data/*.db`, `data/*.db-*` e, opcionalmente, `data/admin-password-reset.trigger` (ou `data/*.trigger`), de modo que o `blog.db` e o trigger não sejam commitados.

## 2. Documentação genérica: passo a passo (no repo)

- [x] 2.1 Criar o documento **EXPOR-DB-NO-HOST.md** na raiz do projeto com: (a) objectivo (expor o .db no host para facilitar scripts manuais); (b) passo a passo genérico para usar bind mount (o compose já usa `./data:/data`; criar a pasta se não existir; primeiro arranque cria `blog.db`); (c) para quem **já usa** o volume nomeado: como migrar dados (copiar do volume para `./data`, depois alterar o compose e reiniciar); (d) como executar scripts manuais no host (ex.: `sqlite3 data/blog.db < backend/api/Migrations/Scripts/nome.sql` a partir da raiz do repo). Usar placeholders genéricos (ex.: REPO_DIR, pasta de dados) onde fizer sentido.

## 3. Atualizar documentação do projeto

- [x] 3.1 Em **README.md**, referir que em deploy Docker a base de dados fica no servidor (pasta `data/` exposta ao contentor via volume) e que scripts manuais podem ser executados no host (ex.: `sqlite3 data/blog.db < ...`). Incluir ou referir o documento EXPOR-DB-NO-HOST.md.
- [x] 3.2 Em **DEPLOY-DOCKER-CADDY.md**, atualizar a descrição do volume (tabela e secções relevantes): a base de dados fica na pasta `data/` no host (bind mount para `/data` no contentor); referir que scripts manuais se executam no host com `sqlite3 data/blog.db`. Referir EXPOR-DB-NO-HOST.md para detalhes e migração desde volume nomeado.
- [x] 3.3 Em **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**, na secção de scripts de banco de dados (Docker), indicar que se a pasta de dados estiver no host (bind mount), o operador pode executar os scripts a partir do host (ex.: `sqlite3 data/blog.db < ...` em REPO_DIR) e referir EXPOR-DB-NO-HOST.md.

## 4. Documentação local (não para o GitHub)

- [x] 4.1 Criar o ficheiro **docs/local/expor-db-servidor.md** com um passo a passo pensado para o operador usar **no seu servidor**: (a) placeholders claros (ex.: REPO_DIR, DATA_DIR, ou caminhos exemplo como `/var/www/blog`, `/var/lib/blog-data`); (b) passos numerados (criar pasta, permissões, alterar compose se necessário, migrar dados do volume antigo se aplicável, executar scripts); (c) nota de que este ficheiro está em `docs/local/` e não é commitado (está no .gitignore). O operador pode copiar este ficheiro e preencher os seus caminhos concretos; o ficheiro criado no repo serve de modelo e fica apenas no ambiente local.

## 5. Spec delta

- [x] 5.1 Adicionar em **openspec/changes/expose-db-on-host-for-docker/specs/project-docs/spec.md** um requisito ADDED: a documentação do projeto deve indicar que em deploy Docker a base de dados pode ficar no servidor (pasta no host exposta ao contentor via bind mount), facilitando a execução de scripts manuais no host; e que existe documentação genérica (EXPOR-DB-NO-HOST.md) e a possibilidade de um guia local (em docs/local/) não commitado para o operador usar no seu servidor. Incluir pelo menos um cenário (ex.: operador executa script manual no host quando a base está em pasta exposta).

## 6. Validação

- [x] 6.1 Executar `openspec validate expose-db-on-host-for-docker --strict` e corrigir qualquer falha.
