# Proposal: Expor a base de dados no host (bind mount) para Docker

## Summary

Mover o ficheiro **SQLite (.db)** para **fora do volume nomeado** do Docker, usando um **bind mount** para uma pasta no servidor (host). Assim, o `blog.db` fica acessível no sistema de ficheiros do servidor, facilitando a execução de **scripts manuais** (ex.: migrações SQL) com `sqlite3` sem precisar de contentores temporários ou cópia do volume. A documentação do projeto passa a indicar que a base de dados pode ficar no servidor e é exposta ao contentor da API via volume; é criado um **passo a passo genérico** (no repositório) e um **guia local** (não commitado) para o operador configurar no seu servidor.

## Goals

- **Bind mount por defeito**: O `docker-compose.yml` deve usar um **bind mount** para a pasta de dados da API (ex.: `./data:/data` na raiz do projeto), em vez do volume nomeado `blog_api_data`, de modo que o `blog.db` e o ficheiro de trigger do Admin fiquem numa pasta no host (ex.: `repo/data/blog.db`). Quem faz deploy pode assim correr `sqlite3 data/blog.db < backend/api/Migrations/Scripts/...` a partir da raiz do repo.
- **Documentação genérica**: Criar um documento (commitado) com **passo a passo** de como expor a base no host (escolha da pasta, alteração do compose, migração de dados existentes se aplicável) e atualizar README, DEPLOY-DOCKER-CADDY e ATUALIZAR-SERVIDOR-DOCKER-CADDY para referir que a base de dados fica no servidor e é exposta ao Docker via volume.
- **Documentação local (não para o GitHub)**: Criar um guia em **`docs/local/`** (ou ficheiro `*-local.md` já coberto pelo `.gitignore`) com um passo a passo que o operador pode preencher com **os seus caminhos e domínio** para executar no seu servidor; este ficheiro **não é commitado** (a pasta `docs/local/` e o padrão `*-local.md` estão no `.gitignore`).

## Scope

- **In scope**: (1) **docker-compose.yml**: Substituir o volume nomeado `blog_api_data` por um bind mount para uma pasta no host (ex.: `./data:/data`), criando a pasta `data/` no repo (ex.: com `.gitkeep`) e removendo a declaração `volumes: blog_api_data`. (2) **Documentação no repo**: Novo documento (ex.: `EXPOR-DB-NO-HOST.md`) com passo a passo genérico (escolher pasta no host, montar em `/data`, comandos para migrar dados do volume antigo se já existir, como executar scripts manuais no host). (3) **Atualizar docs**: README, DEPLOY-DOCKER-CADDY e ATUALIZAR-SERVIDOR-DOCKER-CADDY passam a indicar que a base de dados fica no servidor (pasta exposta ao contentor via volume) e que scripts manuais podem ser executados no host (ex.: `sqlite3 data/blog.db < ...`). (4) **Documentação local**: Criar ficheiro em `docs/local/` (ex.: `expor-db-servidor.md`) com passo a passo para o operador usar no **seu** servidor (placeholders: REPO_DIR, DATA_DIR, caminhos concretos); este ficheiro fica em pasta/ficheiro ignorada pelo Git e **não vai para o GitHub**. (5) **Spec delta**: Requisito em project-docs sobre a opção de base no host e documentação (genérica + local).
- **Out of scope**: Alterar a API ou a connection string dentro do contentor (continua `Data Source=/data/blog.db`); suporte a múltiplas pastas de dados; alterar o comportamento de migrações EF Core.

## Affected code and docs

- **docker-compose.yml**: `volumes` do serviço `api` de `blog_api_data:/data` para `./data:/data`; remover bloco `volumes: blog_api_data`. Adicionar `data/.gitkeep` (ou equivalente) para a pasta existir no clone.
- **EXPOR-DB-NO-HOST.md** (novo): Passo a passo genérico (bind mount, migração desde volume nomeado se aplicável, execução de scripts no host).
- **README.md**, **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Referir que a base fica no servidor e é exposta ao contentor via volume; scripts manuais a partir do host.
- **docs/local/expor-db-servidor.md** (novo, não commitado): Guia com placeholders (REPO_DIR, DATA_DIR, etc.) para o operador preencher e usar no seu servidor.
- **openspec/changes/expose-db-on-host-for-docker/specs/project-docs/spec.md**: Delta com requisito ADDED.

## Dependencies and risks

- **Quem já usa volume nomeado**: O passo a passo deve incluir como migrar (copiar dados do volume para a pasta do host antes de trocar o compose) para não perder dados.
- **Permissões**: A pasta `./data` (ou a escolhida no host) deve ter permissões que permitam ao processo do contentor da API escrever em `blog.db`; documentar (ex.: ownership ou 777 conforme o contexto).

## Success criteria

- O `docker-compose.yml` usa bind mount para a pasta de dados da API; o `blog.db` fica acessível no host (ex.: `./data/blog.db`).
- Existe um documento genérico com passo a passo para expor a base no host (e opcionalmente migrar do volume nomeado).
- A documentação do projeto (README e guias de deploy) indica que a base de dados fica no servidor e é exposta ao Docker via volume e que scripts manuais podem ser executados no host.
- Existe um guia em `docs/local/` (ou `*-local.md`) para o operador usar no seu servidor, com placeholders; o ficheiro está coberto pelo `.gitignore` e não é commitado.
- `openspec validate expose-db-on-host-for-docker --strict` passa.
