# Tasks: add-version-1-3-and-update-deploy-docs

## 1. Guia de atualização com secções local e Docker

- [x] 1.1 Em **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** (ou criar **ATUALIZAR.md** na raiz), criar secção **Atualização local (desenvolvimento)** com passos: pull; build e execução da API a partir de `backend/api`; build e execução do BFF; build/servir do frontend; nota sobre migrações (MigrateAsync ao arranque da API quando se corre de `backend/api`) e quando aplicar scripts manuais (erro "no such column").

- [x] 1.2 Na mesma documento, criar secção **Atualização Docker (produção)** com passos já existentes (pull, docker compose build --no-cache, up -d, build do frontend e cópia para Caddy); manter ênfase na reconstrução da imagem da API quando há novas migrações.

- [x] 1.3 Adicionar subsecção **Scripts de banco de dados (aplicação manual)** listando cada script: `add_view_count_to_posts.sql` (coluna ViewCount) e `add_include_in_story_order_to_posts.sql` (coluna IncludeInStoryOrder). Para cada um: (a) **Local**: comando a partir de `backend/api` (ex.: `sqlite3 blog.db < Migrations/Scripts/nome.sql`); (b) **Docker**: instruções resumidas (ex.: obter nome do volume, executar script no volume com `docker run` e imagem com sqlite3, ou copiar base para o host, executar script, devolver ao volume). Referir o README da API para detalhes completos do Troubleshooting.

## 2. Revisão da documentação geral

- [x] 2.1 Revisar **README.md** (raiz) e garantir que está atualizado (repositório, stack, passos de desenvolvimento e deploy, ligação para ATUALIZAR e DEPLOY). Adicionar menção à versão (ex.: "Versão 1.3" ou referência a tags) se fizer sentido.

- [x] 2.2 Revisar **backend/api/README.md** e **backend/bff/README.md** para consistência com o guia de atualização (migrações, scripts, configuração). Garantir referência cruzada para ATUALIZAR-SERVIDOR-DOCKER-CADDY ou ATUALIZAR quando existir secção de scripts.

- [x] 2.3 Revisar **DEPLOY-DOCKER-CADDY.md** para garantir que a secção de migrações e a menção a scripts manuais estão alinhadas com ATUALIZAR; opcionalmente adicionar uma linha a referir que atualizações subsequentes seguem ATUALIZAR-SERVIDOR-DOCKER-CADDY.md.

## 3. Versionamento e resumo v1.3

- [x] 3.1 O **resumo para commit v1.3** está na proposta (`openspec/changes/add-version-1-3-and-update-deploy-docs/proposal.md`, secção "Resumo para commit v1.3 (changelog)"). Opcional: criar **CHANGELOG.md** na raiz com uma entrada para v1.3 contendo esse resumo (ou um link para a proposta). Se não criar CHANGELOG.md, a proposta serve como referência para a mensagem do commit e para a tag `v1.3`.

- [x] 3.2 Documentar no README ou num ficheiro de convenções que, a partir de agora, os releases são versionados (ex.: tag `v1.3`) e que o changelog das changes OpenSpec aplicadas pode ser usado na mensagem do commit de release.

## 4. Spec delta (project-docs)

- [x] 4.1 Em `openspec/changes/add-version-1-3-and-update-deploy-docs/specs/project-docs/spec.md`, ADDED requirement: a documentação de **atualização** do projeto (como atualizar após pull) SHALL ter secções claras que separem **atualização local** (desenvolvimento) e **atualização Docker** (produção). A documentação SHALL listar os **scripts de banco de dados** que podem ser aplicados manualmente (ex.: ViewCount, IncludeInStoryOrder), com instruções ou referências para **cada ambiente** (local e Docker). Incluir cenário: operador consulta o guia para atualizar em Docker e encontra a secção "Atualização Docker" e a lista de scripts com comandos ou referência ao README da API.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-version-1-3-and-update-deploy-docs --strict` e corrigir qualquer falha.
