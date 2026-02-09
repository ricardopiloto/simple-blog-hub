# project-docs — delta for simplify-readme-docs-changelog-v1-8

## ADDED Requirements

### Requirement: README organizado em sete secções e CHANGELOG com versão 1.8

O **README.md** do repositório **deve** (SHALL) estar organizado em **sete secções**, na seguinte ordem: (1) **Explicação breve do projeto** — o que é o blog, fonte de dados (BFF → API → SQLite), interface em português, e URL do repositório; (2) **Stack de desenvolvimento** — tecnologias do frontend e do backend, comandos de build e scripts principais; (3) **Requisitos mínimos** — Node.js/npm e .NET 8 SDK com links de instalação; (4) **Links para CHANGELOG** — referência ao CHANGELOG.md e ao versionamento por tag (ex.: v1.7, v1.8); (5) **Funcionalidades existentes no blog** — lista concisa das capacidades atuais; (6) **Procedimentos de instalação e atualização (com os links)** — links para DEPLOY-DOCKER-CADDY.md (instalação inicial), ATUALIZAR-SERVIDOR-DOCKER-CADDY.md (atualização) e EXPOR-DB-NO-HOST.md (base de dados no host), sem duplicar o conteúdo completo desses guias; (7) **Estrutura de pastas** — árvore do repositório com descrição breve das pastas principais.

O **CHANGELOG.md** **deve** conter a secção **## [1.8]** (ou o número de versão acordado para esta release) descrevendo a simplificação do README, a atualização da documentação e a nova versão no changelog, em conformidade com o requisito existente de que cada release versionada tem uma secção no CHANGELOG.

#### Scenario: Leitor encontra as sete secções e os links no README

- **Quando** um desenvolvedor ou operador abre o README.md
- **Então** encontra as sete secções na ordem indicada (explicação, stack, requisitos, links CHANGELOG, funcionalidades, procedimentos com links, estrutura de pastas)
- **E** na secção de procedimentos encontra links para DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md e EXPOR-DB-NO-HOST.md
- **E** na secção de links encontra referência ao CHANGELOG e ao versionamento por tag

#### Scenario: Leitor consulta o CHANGELOG para a versão 1.8

- **Quando** um utilizador abre o CHANGELOG.md
- **Então** encontra a secção **## [1.8]** com a entrada para simplify-readme-docs-changelog-v1-8 (README reorganizado em sete secções, documentação alinhada, nova versão no changelog)
- **E** pode usar essa informação para saber o que mudou nesta release

## MODIFIED Requirements

### Requirement: README inclui funcionalidades completas, estrutura dos serviços, stack e passo a passo de configuração

O README **deve** (SHALL) continuar a incluir lista de funcionalidades, estrutura dos serviços (e estrutura de pastas) e stack, nas secções correspondentes da estrutura em sete secções (secções 2, 5 e 7). O README **deve** (SHALL) referenciar os guias de instalação e atualização (DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY) na secção de Procedimentos (secção 6), de forma que o passo a passo detalhado de configuração **possa** estar nesses guias em vez de duplicado no README. O README **deve** (SHALL) permitir que um novo desenvolvedor ou operador saiba onde encontrar as instruções completas de instalação e atualização (via links) e entenda as capacidades do produto e a estrutura do repositório.

#### Scenario: Leitor usa o README para chegar aos guias de instalação

- **Quando** um operador precisa de instalar o blog em servidor ou atualizar após pull
- **Então** encontra no README (secção 6) os links para DEPLOY-DOCKER-CADDY.md e ATUALIZAR-SERVIDOR-DOCKER-CADDY.md
- **E** ao seguir esses links obtém o passo a passo completo de configuração e atualização
