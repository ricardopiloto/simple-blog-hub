# Proposal: Executar contentores do backend como utilizador não-root

## Summary

Os contentores da **API** e do **BFF** são atualmente executados como **root** (tanto dentro do contentor como no contexto do servidor), o que representa um risco de segurança. Este change altera os **Dockerfiles** e a **documentação** para que os serviços de backend passem a correr como **utilizador não-root** (UID fixo, ex.: 10000), e adiciona um **guia passo a passo** com os comandos e alterações necessárias **no servidor** (criação de pastas, `chown` nos volumes) para que a API consiga escrever no SQLite e no ficheiro de trigger de reset de senha, e o BFF consiga gravar imagens de capa nos uploads. O objetivo é **garantir segurança no servidor** sem perder funcionalidade.

## Why

- **Problema**: Todos os serviços de backend (API e BFF) correm como root no contentor; em caso de comprometimento, o atacante teria privilégios elevados. No servidor, a configuração atual evita erros de permissão (ex.: "readonly database") precisamente por correr como root.
- **Objetivo**: Reduzir a superfície de ataque executando a API e o BFF como utilizador não-root (UID fixo), com documentação clara para o operador configurar as permissões dos volumes no host **uma vez** (deploy inicial ou migração desde a configuração root).

## What Changes

- **Dockerfiles (API e BFF)**: Criar utilizador não-root com UID/GID fixos (ex.: 10000) na imagem, garantir que o diretório de trabalho pertence a esse utilizador, e usar `USER` para iniciar o processo. A API precisa de escrever em `/data` (SQLite + ficheiro de trigger); o BFF em `/frontend/public/images/posts`. Esses paths são montados a partir do host; a documentação explica como fazer `chown` no host para o UID do contentor.
- **docker-compose.yml**: Opcionalmente fixar `user:` ao mesmo UID:GID para consistência e documentação explícita.
- **Documentação nova**: Um documento (ex.: **docs/deploy/CONFIGURAR-SERVIDOR-NAO-ROOT.md**) com **passo a passo** para o servidor: (1) garantir que as pastas `data/` e `frontend/public/images/posts` existem no host; (2) atribuir dono UID:GID (ex.: 10000:10000) a essas pastas com `chown -R`; (3) comandos exatos (copiáveis) por cenário (deploy novo vs. migração desde root); (4) verificação (contentores a correr, API a gravar na base, BFF a gravar uploads). Opcional: script de apoio (ex.: `docs/local/configurar-permissoes-nao-root.sh`) ou referência no script de atualização existente.
- **Documentação existente**: Atualizar **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**, **SECURITY-HARDENING.md**, **SECURITY-REMEDIATION.md**, **PRODUCTION-CHECKLIST.md** e **EXPOR-DB-NO-HOST.md** para indicar que os contentores correm como **não-root** e referenciar o novo guia para configuração de permissões no servidor. Troubleshooting: se aparecer "readonly database" ou "Permission denied", verificar dono das pastas (chown para o UID do contentor).
- **Spec security-hardening**: Alterar o requisito "Hardening de infra" de MAY root para **SHALL** executar como não-root quando os volumes no host tiverem permissões configuradas conforme a documentação; a documentação **DEVE** incluir o passo a passo no servidor (comandos e alterações).
- **Spec project-docs** (se aplicável): Garantir que o guia de deploy ou um documento referenciado inclui os passos de configuração do servidor para não-root (permissões dos volumes).

## Goals

- Contentores da API e do BFF **não** correm como root; utilizam um UID fixo (ex.: 10000).
- Operador que segue o novo guia consegue, com comandos claros, configurar o servidor (chown) **uma vez** e ter a aplicação a funcionar (API a escrever em `data/`, BFF a escrever em `frontend/public/images/posts`).
- Documentação de deploy e de segurança atualizada e coerente com não-root; troubleshooting cobre erros de permissão.

## Scope

- **In scope**: (1) Alteração dos Dockerfiles da API e do BFF (user não-root com UID fixo). (2) Documento passo a passo para o servidor (comandos, chown, verificação). (3) Atualização de DEPLOY, ATUALIZAR, SECURITY-HARDENING, SECURITY-REMEDIATION, PRODUCTION-CHECKLIST, EXPOR-DB-NO-HOST. (4) docker-compose com `user:` explícito (opcional). (5) Spec security-hardening (e project-docs se necessário) a exigir não-root e documentação do servidor.
- **Out of scope**: Alterar a forma como o Caddy ou o frontend são executados no host; criar utilizador no host com nome específico (apenas UID:GID numéricos são obrigatórios; documento pode sugerir utilizador nomeado como opcional); suporte a outros runtimes além de Docker para este fluxo.

## Affected code and docs

- **backend/api/Dockerfile**: adicionar utilizador não-root (UID 10000), `USER`.
- **backend/bff/Dockerfile**: adicionar utilizador não-root (UID 10000), `USER`.
- **docker-compose.yml**: opcional `user: "10000:10000"` nos serviços api e bff.
- **docs/deploy/CONFIGURAR-SERVIDOR-NAO-ROOT.md** (novo): passo a passo no servidor.
- **docs/deploy/DEPLOY-DOCKER-CADDY.md**, **docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: referência ao guia não-root e permissões.
- **docs/security/SECURITY-HARDENING.md**, **docs/security/SECURITY-REMEDIATION.md**, **docs/security/PRODUCTION-CHECKLIST.md**: contentores como não-root, link para CONFIGURAR-SERVIDOR-NAO-ROOT.
- **docs/database/EXPOR-DB-NO-HOST.md**: mencionar UID do contentor e chown quando necessário.
- **openspec/changes/run-backend-containers-non-root/specs/security-hardening/spec.md**: delta MODIFIED.
- **openspec/changes/run-backend-containers-non-root/specs/project-docs/spec.md**: delta (se necessário) para documentação do deploy.

## Dependencies and risks

- **Migração**: Servidores que já correm com root precisam de executar os passos do novo guia (chown) **antes** ou **após** puxar a nova versão; o documento deve cobrir "já tenho dados em data/ — como migrar para não-root".
- **Risco**: Se o operador não executar o chown, a API pode falhar com "readonly database" ou o BFF com "Permission denied" nos uploads; a documentação e o troubleshooting devem deixar isso explícito.

## Success criteria

- `docker compose up` com as novas imagens faz a API e o BFF correrem como UID 10000 (não root).
- Seguindo CONFIGURAR-SERVIDOR-NAO-ROOT.md num servidor (novo ou com dados existentes), a aplicação funciona (base de dados gravável, uploads a funcionar).
- DEPLOY e ATUALIZAR referenciam o guia e indicam que os contentores são não-root.
- Spec security-hardening exige execução como não-root e documentação do passo a passo no servidor.
- `openspec validate run-backend-containers-non-root --strict` passa.
