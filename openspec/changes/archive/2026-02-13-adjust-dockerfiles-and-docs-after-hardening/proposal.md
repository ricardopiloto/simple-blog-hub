# Proposal: Ajustar Dockerfiles e documentação após hardening (corrigir API readonly database)

## Summary

A change **apply-security-hardening** (Fase 5) introduziu utilizador não-root nos Dockerfiles da API e do BFF (`RUN adduser --disabled-password --gecos "" --uid 1000 app` e `USER app`). Isso **quebrou** o funcionamento da API em muitos ambientes: o contentor corre como uid 1000, mas o volume montado (`./data:/data`) no host tem dono/permissões que não permitem escrita a esse utilizador, resultando em **SQLite Error 8: attempt to write a readonly database** ao aplicar migrações ou aceder ao `blog.db`. Exigir que todos os operadores executem `chown -R 1000:1000 data/` no host antes do primeiro arranque (ou após clone) é frágil e não estava destacado como passo obrigatório na instalação inicial. Para **restaurar o funcionamento** sem impor gestão de permissões no host, este change (1) **remove o user não-root** dos Dockerfiles da API e do BFF (o processo volta a correr como root dentro do contentor, como antes da 1.10); (2) **atualiza o spec security-hardening** para permitir que os Dockerfiles executem como root quando a operação com volumes montados assim o exigir, documentando o trade-off segurança vs. operacionalidade; (3) **atualiza toda a documentação** que referia "uid 1000", "Docker não-root" e "chown no host" para refletir que os contentores correm como root e que a pasta `data/` deve ser gravável pelo processo (em root, tipicamente já o é). As restantes medidas de hardening (CORS, JWT, API key, headers, rate limiting, etc.) mantêm-se.

## Goals

- **API e BFF arrancam e funcionam** com o volume `./data` (e, no BFF, `./frontend/public/images/posts`) montado no host, sem exigir que o operador faça `chown` no host para um UID específico.
- **Documentação consistente**: DEPLOY, PRODUCTION-CHECKLIST, guias de atualização (1.9→1.10, 1.9→2.0), SECURITY-HARDENING e referências ao Docker deixam de mencionar "uid 1000" e "chown para o utilizador do contentor"; passam a indicar que os contentores correm como root (ou a não impor não-root).
- **Spec alinhado**: O requisito de "Docker não-root" no spec security-hardening é alterado para permitir exceção (executar como root) quando necessário para compatibilidade com volumes; o trade-off fica documentado.

## Scope

- **In scope**: (1) **backend/api/Dockerfile** e **backend/bff/Dockerfile**: remover a linha `RUN adduser ...` e a linha `USER app`, de modo que o processo corra como root. (2) **openspec/specs/security-hardening/spec.md**: alterar o requisito de hardening de infra para que os Dockerfiles **POSSAM** (MAY) executar como não-root quando viável, mas **PODEM** (MAY) executar como root quando a operação com volumes montados (ex.: `data/` no host) assim o exigir; adicionar cenário ou nota que documenta o trade-off (segurança vs. evitar readonly database / chown no host). (3) **Documentação**: em docs/deploy/DEPLOY-DOCKER-CADDY.md, docs/deploy/ATUALIZAR-1-9-PARA-1-10.md, docs/local/atualizar-1-9-para-2-0.md, docs/security/PRODUCTION-CHECKLIST.md, docs/security/SECURITY-HARDENING.md, docs/security/SECURITY-REMEDIATION.md, docs/database/EXPOR-DB-NO-HOST.md (e outras referências a uid 1000 / chown / Docker não-root) — remover ou reescrever as instruções que assumem user não-root (uid 1000) e chown no host; indicar que os contentores correm como root. (4) **CHANGELOG**: entrada para esta change (ajuste dos Dockerfiles e docs após hardening).
- **Out of scope**: Alterar CORS, JWT, API key, rate limiting ou outras medidas de hardening; alterar a aplicação além dos Dockerfiles e da documentação.

## Affected code and docs

- **backend/api/Dockerfile**: Remover `RUN adduser ...` e `USER app`.
- **backend/bff/Dockerfile**: Idem.
- **openspec/specs/security-hardening/spec.md**: Requisito de infra: de SHALL não-root para MAY não-root com exceção para root quando volumes o exigirem; documentar trade-off.
- **docs/deploy/DEPLOY-DOCKER-CADDY.md**: Remover/ajustar referências a uid 1000, chown para UID do contentor; indicar que contentores correm como root.
- **docs/deploy/ATUALIZAR-1-9-PARA-1-10.md**, **docs/local/atualizar-1-9-para-2-0.md**: Remover parágrafo "Docker não-root (uid 1000)" e instruções de chown; indicar root.
- **docs/security/PRODUCTION-CHECKLIST.md**, **docs/security/SECURITY-HARDENING.md**, **docs/security/SECURITY-REMEDIATION.md**: Ajustar menções a Docker não-root e permissões data/.
- **docs/database/EXPOR-DB-NO-HOST.md**: Ajustar exemplo chown 1000:1000 se aplicável.
- **docs/changelog/CHANGELOG.md**: Nova entrada para esta change.

## Dependencies and risks

- **Segurança**: Os contentores passam a correr como root. O impacto é limitado ao interior do contentor; em caso de compromisso, o atacante tem mais privilégios dentro do container. Documentamos o trade-off no spec. Operadores que queiram não-root podem manter um Dockerfile customizado e fazer chown no host.
- **Compatibilidade**: Quem já fez chown 1000:1000 em data/ continua a funcionar (root no container consegue escrever). Nenhuma alteração de API ou BFF além dos Dockerfiles.

## Success criteria

- A API arranca com o volume `./data` montado e aplica migrações e escreve em `blog.db` sem erro "readonly database", sem o operador ter de executar chown no host.
- O BFF arranca e grava uploads em `./frontend/public/images/posts` quando montado, sem erro de permissão.
- A documentação não exige chown para uid 1000 e indica que os contentores correm como root.
- O spec security-hardening permite a exceção (root) e documenta o trade-off.
- `openspec validate adjust-dockerfiles-and-docs-after-hardening --strict` passa.
