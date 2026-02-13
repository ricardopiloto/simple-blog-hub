# security-hardening Specification (delta: adjust-dockerfiles-and-docs-after-hardening)

## Purpose
Spec delta for change adjust-dockerfiles-and-docs-after-hardening. Base spec: openspec/specs/security-hardening/spec.md

## MODIFIED Requirements

### Requirement: Hardening de infra e documentação — Docker MAY run as root when required for volumes (MODIFIED)

Os Dockerfiles da API e do BFF **PODEM** (MAY) executar o processo como utilizador não-root (ex.: USER com UID/GID não privilegiados) quando isso for viável e quando a documentação exigir que o operador configure permissões no host (ex.: `chown` da pasta `data/` para esse UID). Os Dockerfiles **PODEM** (MAY) executar como **root** quando a operação com **volumes montados** no host (ex.: `./data:/data` para o SQLite) assim o exigir, para evitar o erro **SQLite Error 8: attempt to write a readonly database** e a dependência de que todos os operadores executem `chown` no host para um UID específico. O repositório **DEVE** (SHALL) dispor de documentação que descreva as variáveis de ambiente e configurações obrigatórias para produção, recomendações de firewall e um Caddyfile de exemplo com HTTPS e headers de segurança. A pasta de dados (ex.: `data/` com SQLite) **DEVE** ter permissões adequadas no host (quando os contentores correm como root, tipicamente o processo consegue escrever; quando correm como não-root, a documentação **DEVE** indicar o passo de `chown` para o UID do contentor). O **trade-off** entre segurança (não-root) e operacionalidade (root para evitar readonly database) **DEVE** estar documentado (ex.: no spec ou em SECURITY-HARDENING.md).

#### Scenario: Container pode correr como root para compatibilidade com volumes

- **Dado** que o docker-compose monta `./data` no host em `/data` no contentor da API
- **Quando** o processo da API precisa de escrever no SQLite (migrações, dados)
- **Então** o Dockerfile **PODE** declarar o processo a correr como root (sem USER não-root) de modo que a escrita no volume montado funcione sem exigir chown no host
- **E** a documentação indica que os contentores correm como root e que este é um trade-off aceite (operacionalidade vs. não-root)

#### Scenario: Documentação de produção existe

- **Quando** um operador consulta o repositório para preparar um deploy em produção
- **Então** existe documentação que lista variáveis obrigatórias (Jwt:Secret, API:InternalKey, Cors:AllowedOrigins, etc.)
- **E** existe referência a HTTPS, headers de segurança e Caddyfile de exemplo versionado
