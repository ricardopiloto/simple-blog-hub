# Tasks: add-version-1-4-and-update-docs

## 1. CHANGELOG: secção [1.4]

- [x] 1.1 No ficheiro **CHANGELOG.md**, adicionar uma nova secção **## [1.4]** (acima de [1.3]) com as alterações desta release:
  - **add-dynamic-sitemap-and-robots**: Sitemap dinâmico (GET /sitemap.xml) e robots.txt (GET /robots.txt) servidos pelo BFF; Caddy encaminha /sitemap.xml e /robots.txt para o BFF (documentado em DEPLOY-DOCKER-CADDY).
  - **expose-db-on-host-for-docker**: (Incluir apenas se esta change tiver sido aplicada antes ou na mesma release.) Base de dados no host via bind mount (pasta data/); documento EXPOR-DB-NO-HOST.md; documentação local em docs/local/ não commitada.
  - **add-version-1-4-and-update-docs**: Documentação do projeto e procedimentos de atualização/instalação revisados e alinhados para v1.4.
  Utilizar o mesmo estilo de lista e descrição curta que em [1.3].

## 2. Revisão da documentação geral

- [x] 2.1 Revisar **README.md** (raiz): garantir que a referência à versão ou às tags está atualizada (ex.: "releases versionados por tag (ex.: v1.3, v1.4)" ou menção a v1.4); confirmar que os links para DEPLOY, ATUALIZAR e CHANGELOG estão corretos; adicionar, se faltar, menção a sitemap/robots (ex.: na secção de funcionalidades ou de documentação).
- [x] 2.2 Revisar **DEPLOY-DOCKER-CADDY.md**: confirmar que a secção do Caddyfile inclui os handles para /sitemap.xml e /robots.txt e que o texto explica que são servidos pelo BFF; confirmar referências a migrações e a scripts de banco; se a change expose-db-on-host tiver sido aplicada, referir que a base pode estar na pasta data/ no host e apontar para EXPOR-DB-NO-HOST.md.
- [x] 2.3 Revisar **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: confirmar que os passos de atualização (local e Docker) estão corretos e que a secção Caddy menciona sitemap/robots quando aplicável; confirmar a secção de scripts de banco de dados; se expose-db-on-host tiver sido aplicada, referir execução de scripts no host (data/blog.db) e EXPOR-DB-NO-HOST.md.

## 3. Revisão dos READMEs do backend

- [x] 3.1 Revisar **backend/api/README.md** e **backend/bff/README.md**: garantir consistência com DEPLOY e ATUALIZAR (migrações, scripts manuais, configuração); referências cruzadas corretas. Se expose-db-on-host tiver sido aplicada, o README da API pode referir que em Docker a base pode estar em data/ no host.

## 4. openspec/project.md

- [x] 4.1 Em **openspec/project.md**, adicionar ou atualizar uma menção a que o BFF serve **sitemap** e **robots.txt** (GET /sitemap.xml e GET /robots.txt) para SEO, e que em deploy com Caddy estes caminhos devem ser encaminhados para o BFF. Inserir no Domain Context ou em Architecture/Important Constraints, conforme o estilo do ficheiro.

## 5. Spec delta (project-docs)

- [x] 5.1 Em **openspec/changes/add-version-1-4-and-update-docs/specs/project-docs/spec.md**, ADDED requirement: para cada **release versionada** do projeto (tag de versão, ex.: v1.4), o ficheiro **CHANGELOG.md** **deve** (SHALL) conter uma secção correspondente (ex.: `## [1.4]`) que descreva as **alterações** dessa versão: lista das changes OpenSpec incluídas (com descrição breve) e, quando aplicável, a atualização da documentação e dos procedimentos de atualização/instalação. Incluir cenário: quando um utilizador consulta o CHANGELOG, encontra a secção da versão mais recente com a lista do que foi alterado.

## 6. Validação

- [x] 6.1 Executar `openspec validate add-version-1-4-and-update-docs --strict` e corrigir qualquer falha.
