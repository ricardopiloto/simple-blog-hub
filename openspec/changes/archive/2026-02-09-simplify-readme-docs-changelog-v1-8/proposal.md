# Simplificar README, atualizar documentação e gerar nova versão no CHANGELOG

## Summary

Reorganizar o **README.md** em sete secções claras (explicação breve do projeto, stack, requisitos, links para CHANGELOG, funcionalidades, procedimentos de instalação/atualização com links, estrutura de pastas); alinhar o resto da documentação do repositório com essa estrutura onde aplicável; e adicionar uma nova secção de versão no **CHANGELOG.md** (ex.: **[1.8]**) que descreva esta alteração e quaisquer outras changes aplicadas desde a última versão documentada.

## Goals

1. **README simplificado em 7 secções**
   - **1. Explicação breve do projeto** — o que é o blog, fonte de dados (BFF → API → SQLite), interface em português.
   - **2. Stack de desenvolvimento** — frontend (Node, Vite, React, TypeScript, etc.) e backend (.NET 8, EF Core, SQLite); comandos de build e scripts principais; referência a `frontend/` como raiz dos comandos npm.
   - **3. Requisitos mínimos** — Node.js/npm e .NET 8 SDK, com links de instalação.
   - **4. Links para CHANGELOG** — referência explícita ao CHANGELOG.md e ao versionamento por tag (ex.: v1.7, v1.8).
   - **5. Funcionalidades existentes no blog** — lista das capacidades atuais (página inicial, lista de posts, post por slug, índice da história, tema, login, área do autor, Contas, permissões, recuperação de senha Admin, etc.), de forma concisa.
   - **6. Procedimentos de instalação e atualização (com os links)** — links para **DEPLOY-DOCKER-CADDY.md** (instalação inicial em servidor), **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** (atualização após pull), **EXPOR-DB-NO-HOST.md** (base de dados no host). Incluir referência ao guia de atualização para ambientes local e Docker. Não duplicar os passos completos; o README aponta para os documentos dedicados.
   - **7. Estrutura de pastas** — árvore do repositório (`frontend/`, `backend/api/`, `backend/bff/`, `openspec/`, etc.) com descrição breve das pastas principais.

2. **Documentação alinhada**
   - Reduzir redundância no README (passo a passo longo de configuração, variáveis de ambiente detalhadas, instalação em cloud passo a passo) em favor de links para os guias existentes. Manter no README apenas o essencial para um novo leitor: o que é o projeto, o que precisa para correr, onde está cada coisa e onde ir para instalar/atualizar.
   - Garantir que **openspec/project.md** continua a refletir a stack e as convenções (já está detalhado; não é necessário reescrever, apenas confirmar consistência com o novo README na menção a .NET 8 e estrutura).
   - Garantir que o README inclui o **URL do repositório** (https://github.com/ricardopiloto/simple-blog-hub) numa secção visível (ex.: no início ou em "Links").

3. **CHANGELOG [1.8]**
   - Adicionar secção **## [1.8]** no `CHANGELOG.md` com a entrada para esta change (simplificação do README, documentação atualizada, nova versão no changelog). Se houver outras changes OpenSpec aplicadas desde a 1.7 que ainda não estejam numa versão, incluí-las na mesma secção.

## Out of scope

- Alterar o conteúdo técnico dos guias DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY ou EXPOR-DB-NO-HOST além de eventuais referências cruzadas ou pequenos ajustes de consistência.
- Adicionar novas funcionalidades ao produto; apenas documentação e changelog.

## Success criteria

- O README está organizado nas sete secções solicitadas, com links para CHANGELOG e para os guias de instalação/atualização.
- A lista de funcionalidades reflete o estado atual do blog (sem remover capacidades documentadas).
- A estrutura de pastas no README está atualizada e coerente com o repositório.
- O CHANGELOG contém a secção [1.8] (ou o número de versão acordado) descrevendo esta alteração.
- Os requisitos de documentação em openspec/specs/project-docs continuam a ser satisfeitos (referência ao repositório, deploy, atualização, etc.), com o spec delta a refletir a nova estrutura do README.
- `openspec validate simplify-readme-docs-changelog-v1-8 --strict` passa.
