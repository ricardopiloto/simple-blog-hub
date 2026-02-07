# Proposal: Link do GitHub no rodapé e atualização da documentação do projeto

## Summary

Adicionar no **rodapé** do site um link para o **repositório do projeto no GitHub** (https://github.com/ricardopiloto/simple-blog-hub), para que visitantes e desenvolvedores possam aceder ao código fonte. Em paralelo, **atualizar a documentação** do projeto (README.md, openspec/project.md e, quando relevante, DEPLOY-DOCKER-CADDY.md e ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) para referenciar de forma explícita o repositório e manter a documentação alinhada com o estado atual do sistema.

## Goals

- **Rodapé**: Exibir no rodapé da aplicação um link clicável para o repositório GitHub do projeto (https://github.com/ricardopiloto/simple-blog-hub), com texto acessível (ex.: "Código no GitHub" ou ícone + "GitHub"). O link deve abrir numa nova aba (`target="_blank"`) e usar `rel="noopener noreferrer"`.
- **Documentação**: Garantir que README.md e openspec/project.md mencionam o repositório (URL canónica) onde for apropriado (ex.: início do README, secção "Repositório" ou equivalente; em project.md na secção de contexto ou convenções). Nos guias de deploy (DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md), onde hoje se usa placeholder `<url-do-repositório>`, adicionar o URL real como exemplo (ex.: "Ex.: https://github.com/ricardopiloto/simple-blog-hub") para facilitar o clone e a atualização.

## Scope

- **In scope**: (1) **Frontend** `Footer.tsx`: adicionar um link para https://github.com/ricardopiloto/simple-blog-hub no rodapé (ex.: na área inferior junto ao copyright ou numa coluna "Projeto"/"Código"). (2) **README.md**: incluir referência ao repositório (URL) no início ou numa secção dedicada (ex.: "Repositório: https://github.com/ricardopiloto/simple-blog-hub"). (3) **openspec/project.md**: referenciar o repositório onde fizer sentido (ex.: Git Workflow ou nota de contexto). (4) **DEPLOY-DOCKER-CADDY.md** e **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: onde for referido clone ou pull do repositório, indicar o URL canónico como exemplo. (5) **Spec deltas**: branding (ou layout) para o link no rodapé; project-docs para a documentação referenciar o repositório.
- **Out of scope**: Alterar funcionalidades da aplicação além do rodapé; adicionar badges ou metadados no código que não sejam documentação; automatizar sincronização contínua da documentação (apenas uma passagem de atualização explícita).

## Affected code and docs

- **frontend/src/components/layout/Footer.tsx**: Novo link (e opcionalmente ícone) para o GitHub do projeto.
- **README.md**: Secção ou parágrafo com URL do repositório.
- **openspec/project.md**: Menção ao repositório (URL) em contexto ou convenções.
- **DEPLOY-DOCKER-CADDY.md**: Exemplo de URL na instrução de clone.
- **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Exemplo de URL se aplicável (ex.: git pull).
- **openspec/changes/add-github-link-to-footer-and-docs/specs/branding/spec.md** (ou layout): ADDED — rodapé exibe link para o repositório GitHub do projeto.
- **openspec/changes/add-github-link-to-footer-and-docs/specs/project-docs/spec.md**: ADDED — documentação (README, project.md, guias de deploy) referencia o URL canónico do repositório.

## Dependencies and risks

- **Nenhum**: Links e texto em documentação; alteração localizada no rodapé.

## Success criteria

- No rodapé do site, um link visível leva ao repositório https://github.com/ricardopiloto/simple-blog-hub (abre em nova aba).
- README e openspec/project.md indicam claramente o repositório do projeto.
- Guias de deploy (Docker/Caddy) incluem o URL como exemplo onde se fala em clone ou atualização do código.
- Spec deltas e `openspec validate add-github-link-to-footer-and-docs --strict` passam.
