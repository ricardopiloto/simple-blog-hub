# Proposal: Versão 1.4, atualização da documentação e dos procedimentos de atualização/instalação

## Summary

(1) **Atualizar a documentação** do projeto (README, DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, READMEs do backend, openspec/project.md) para refletir o estado atual do sistema após as changes aplicadas desde v1.3 (incl. sitemap dinâmico, robots.txt, e, se aplicável, base de dados no host). (2) **Revisar os procedimentos de atualização e de instalação** para garantir que estão corretos e alinhados (passos local vs Docker, Caddyfile com sitemap/robots, scripts de banco, referências entre documentos). (3) **Marcar esta release como versão 1.4** e **documentar no CHANGELOG** o que está a ser alterado nesta versão (lista das changes incluídas e menção à atualização da documentação e dos procedimentos).

## Goals

- **Documentação consistente**: README, guias de deploy e de atualização, e project.md refletem as funcionalidades e opções atuais (sitemap/robots, Caddy handles, opção de base no host quando aplicável).
- **Procedimentos claros**: Os passos de instalação inicial e de atualização (local e Docker) estão corretos, com referências cruzadas e menção a sitemap/robots e a scripts de banco quando relevante.
- **Versão 1.4 e CHANGELOG**: O ficheiro CHANGELOG.md inclui uma secção **[1.4]** que descreve o que está a ser alterado nesta release (changes OpenSpec aplicadas desde v1.3 e a própria atualização da documentação e dos procedimentos).

## Scope

- **In scope**: (1) Revisão e atualizações pontuais em README.md (raiz), backend/api/README.md, backend/bff/README.md, DEPLOY-DOCKER-CADDY.md e ATUALIZAR-SERVIDOR-DOCKER-CADDY.md para alinhar com o estado atual (sitemap, robots, Caddyfile; referência a EXPOR-DB-NO-HOST.md e pasta data/ se a change expose-db-on-host-for-docker tiver sido aplicada). (2) Revisão dos procedimentos de instalação (DEPLOY) e de atualização (ATUALIZAR): garantir que os passos estão corretos e que referenciam sitemap/robots e, quando aplicável, base no host. (3) Atualizar openspec/project.md se necessário (menções a sitemap/robots, SEO). (4) Adicionar no **CHANGELOG.md** a secção **[1.4]** com: lista das changes incluídas nesta release (ex.: add-dynamic-sitemap-and-robots; expose-db-on-host-for-docker se aplicada; add-version-1-4-and-update-docs) e uma linha a indicar que a documentação do projeto e os procedimentos de atualização/instalação foram atualizados para v1.4. (5) No README, referir a versão atual (v1.4) ou que os releases são versionados (tag v1.4). (6) Spec delta em project-docs: requisito ou cenário que exija que cada release versionada tenha entrada no CHANGELOG descrevendo as alterações.
- **Out of scope**: Alterar código da aplicação; automatizar a geração do CHANGELOG; alterar a estrutura do OpenSpec.

## Affected code and docs

- **CHANGELOG.md**: Nova secção `## [1.4]` com a lista das alterações (add-dynamic-sitemap-and-robots, expose-db-on-host-for-docker se aplicada, add-version-1-4-and-update-docs) e menção à atualização da documentação e dos procedimentos.
- **README.md**: Pequenas revisões; referência à versão v1.4 ou à tag.
- **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Revisão para consistência; garantir que sitemap/robots e (se aplicável) EXPOR-DB-NO-HOST estão referenciados.
- **backend/api/README.md**, **backend/bff/README.md**: Consistência com os guias (scripts, migrações, referências).
- **openspec/project.md**: Atualizar se faltar menção a sitemap/robots ou a documentação de deploy.
- **openspec/changes/add-version-1-4-and-update-docs/specs/project-docs/spec.md**: Delta (ADDED ou MODIFIED) para CHANGELOG por release versionada.

## Dependencies and risks

- **Ordem de aplicação**: Se a change expose-db-on-host-for-docker for aplicada antes desta, a documentação v1.4 pode referir a pasta data/ e EXPOR-DB-NO-HOST.md; caso contrário, as referências a "base no host" podem ser genéricas ou omitidas até essa change ser aplicada.
- **Nenhum risco de código**: Apenas documentação e CHANGELOG.

## Success criteria

- CHANGELOG.md contém a secção [1.4] com a lista do que está a ser alterado (changes incluídas e atualização da documentação e procedimentos).
- Documentação do projeto (README e guias) revisada e alinhada com o estado atual; procedimentos de instalação e atualização corretos e referenciados.
- openspec/project.md atualizado se necessário.
- `openspec validate add-version-1-4-and-update-docs --strict` passa.
