# Tasks: adjust-dockerfiles-and-docs-after-hardening

## 1. Dockerfiles: remover user não-root

- [x] 1.1 Em `backend/api/Dockerfile`, remover a linha `RUN adduser --disabled-password --gecos "" --uid 1000 app && chown -R app:app /app` e a linha `USER app`.
- [x] 1.2 Em `backend/bff/Dockerfile`, remover as mesmas duas linhas (RUN adduser e USER app).

## 2. Spec security-hardening: permitir exceção root e documentar trade-off

- [x] 2.1 Em `openspec/specs/security-hardening/spec.md`, no requisito "Hardening de infra e documentação de segurança SHALL": alterar para que os Dockerfiles **POSSAM** (MAY) executar como utilizador não-root quando viável, mas **PODEM** (MAY) executar como root quando a operação com volumes montados (ex.: pasta `data/` no host) assim o exigir, para evitar "readonly database" e dependência de chown no host; adicionar nota ou cenário que documenta o trade-off (segurança vs. operacionalidade). Ajustar o cenário "Container não corre como root" para refletir que a implementação atual pode usar root (ex.: cenário opcional ou "SHOULD" em vez de "SHALL").

## 3. Documentação de deploy e atualização

- [x] 3.1 Em `docs/deploy/DEPLOY-DOCKER-CADDY.md`: remover ou reescrever referências a "UID com que o processo do BFF corre" e "chown para o UID"; remover exemplo `docker compose run --rm --entrypoint "" api chown -R 1000:1000 /data` se existir; indicar que os contentores correm como root (ou não mencionar user).
- [x] 3.2 Em `docs/deploy/ATUALIZAR-1-9-PARA-1-10.md`: remover ou alterar o parágrafo "Docker não-root: Os contentores da API e do BFF correm como utilizador não-root (uid 1000). Se a pasta data/... chown no host"; indicar que os contentores correm como root.
- [x] 3.3 Em `docs/local/atualizar-1-9-para-2-0.md`: remover ou alterar "Docker não-root: Os contentores usam uid 1000. Se a pasta data/... chown no host"; indicar que os contentores correm como root.

## 4. Documentação de segurança

- [x] 4.1 Em `docs/security/PRODUCTION-CHECKLIST.md`: na checklist "Dados", ajustar o texto sobre permissões da pasta `data/` para não exigir chown para uid do contentor; indicar que os contentores correm como root quando aplicável.
- [x] 4.2 Em `docs/security/SECURITY-HARDENING.md`: na secção sobre Docker (user não-root) e permissões da pasta data/, indicar que a implementação atual usa root nos contentores por compatibilidade com volumes; documentar o trade-off.
- [x] 4.3 Em `docs/security/SECURITY-REMEDIATION.md`: ajustar a entrada "Docker como root" / "User não-root" para refletir que os Dockerfiles foram revertidos para root por motivos operacionais.

## 5. Documentação de base de dados

- [x] 5.1 Em `docs/database/EXPOR-DB-NO-HOST.md`: se existir exemplo `chown 1000:1000`, remover ou alterar para indicar que com contentores a correr como root não é necessário chown para um UID específico.

## 6. CHANGELOG

- [x] 6.1 Em `docs/changelog/CHANGELOG.md`, adicionar entrada para esta change (ex.: na secção [2.0] ou nova secção): ajuste dos Dockerfiles (remover user não-root) e da documentação para corrigir o erro "readonly database" da API quando o volume data/ não tem permissões para o uid do contentor; contentores passam a correr como root; spec security-hardening atualizado para permitir exceção.

## 7. Validação

- [x] 7.1 Executar `openspec validate adjust-dockerfiles-and-docs-after-hardening --strict` e corrigir eventuais falhas.
