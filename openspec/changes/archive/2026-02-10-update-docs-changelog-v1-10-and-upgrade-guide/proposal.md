# Atualizar documentação do projeto, versão 1.10 completa e guia de atualização 1.9→1.10

## Why

Após a aplicação das changes **harden-login-credentials-exposure**, **add-remaining-hardening-improvements-and-db-script-rule**, **apply-code-improvements** e **apply-security-hardening**, a documentação do projeto e o CHANGELOG devem refletir o estado atual. A secção **[1.10]** do CHANGELOG deve contemplar **todas** as changes que fazem parte da release 1.10 (incluindo as de implementação e as de avaliação/documentação). É necessário criar um **guia de atualização da 1.9 para a 1.10** para operadores que já têm o servidor em produção na v1.9 e pretendem atualizar, com passos concretos e requisitos de produção (CORS, Jwt:Secret, API:InternalKey, política de senha, Docker não-root, novos documentos).

## Contexto — changes que integram a release 1.10

A release **v1.10** inclui, para além das alterações já descritas na change add-changelog-1-10-docs-update:

1. **add-security-hardening-assessment** — Avaliação de segurança; SECURITY-HARDENING.md; spec security-hardening.
2. **add-security-remediation-proposal** — Plano de correção; SECURITY-REMEDIATION.md; sem alterações de código.
3. **add-code-improvements-evaluation** — Avaliação de melhorias de código; CODE-IMPROVEMENTS.md; spec code-improvements.
4. **add-changelog-1-10-docs-update** — Reorganização em docs/, CHANGELOG em docs/changelog/, README com referências, secção [1.10] inicial.
5. **harden-login-credentials-exposure** — Redução da exposição de credenciais: documentação sem senha em texto claro; appsettings com placeholder; frontend sem string literal da senha; spec delta.
6. **add-remaining-hardening-improvements-and-db-script-rule** — Validação de slug com regex na API; documentação de logging e permissões da pasta data/; regra de script para alterações de BD no README da API; spec project-docs (script manual obrigatório para alterações de esquema).
7. **apply-code-improvements** — BFF: helper GetAuthorId(ClaimsPrincipal); API: base controller X-Author-Id, Data Annotations e ModelState; frontend: requestPublic/requestWithAuth e refatoração do cliente.
8. **apply-security-hardening** — Sanitização HTML (backend + DOMPurify no frontend); CORS e security headers; validação de secrets em produção; magic bytes em uploads; política de senha 8 chars + complexidade; rate limiting e auditoria; Docker não-root; Caddyfile.example; PRODUCTION-CHECKLIST.md; TOKEN-STORAGE.md.

## What Changes

1. **CHANGELOG (docs/changelog/CHANGELOG.md):** Atualizar a secção **## [1.10]** para listar **todas** as changes acima, com descrição breve de cada uma (avaliações, documentação, implementações de hardening e melhorias de código). Manter a frase introdutória com v1.10 na lista de tags.

2. **Documentação geral:**
   - **README.md:** Atualizar a secção 5 (Funcionalidades) para indicar o critério de senha atual (8 caracteres, maiúscula, minúscula e número). Na secção 6, adicionar referência a [PRODUCTION-CHECKLIST](docs/security/PRODUCTION-CHECKLIST.md) e, se útil, a [TOKEN-STORAGE](docs/security/TOKEN-STORAGE.md); na secção sobre SECURITY-HARDENING, indicar que o plano foi **aplicado** (apply-security-hardening) e que variáveis obrigatórias para produção estão em PRODUCTION-CHECKLIST. Incluir na estrutura de pastas (secção 7) a referência a **docs/deploy/Caddyfile.example** e a **docs/security/PRODUCTION-CHECKLIST.md** e **TOKEN-STORAGE.md**.
   - **docs/README.md:** Atualizar a tabela para incluir **Caddyfile.example** em deploy/ e **PRODUCTION-CHECKLIST.md** e **TOKEN-STORAGE.md** em security/.

3. **Guia de atualização 1.9→1.10:** Criar **docs/deploy/ATUALIZAR-1-9-PARA-1-10.md** (ou equivalente em docs/local/ se for considerado específico de versão; o utilizador pediu "documentação de atualização da 1.9 para 1.10", portanto um ficheiro dedicado em docs/deploy é adequado). O guia deve incluir:
   - Público-alvo: operadores com servidor em v1.9 (Docker + Caddy ou local).
   - Passos: pull, reconstruir imagens (Docker), build do frontend, atualizar variáveis de ambiente **obrigatórias em produção** (Cors:AllowedOrigins, Jwt:Secret ≥ 32 caracteres, API:InternalKey); reiniciar serviços.
   - Avisos: política de senha alterada (8 caracteres, maiúscula, minúscula, número); em produção o BFF e a API falham ao arranque se CORS/Jwt:Secret (BFF) ou API:InternalKey (API) não estiverem configurados; Dockerfiles usam user não-root (uid 1000) — garantir permissões no volume de dados se necessário.
   - Referências: PRODUCTION-CHECKLIST.md, DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, README da API (regra de script para alterações de BD).
   - Nota: a v1.10 **não** introduz novas colunas ou tabelas; não é necessário executar scripts SQL manuais para esta atualização.

4. **openspec/project.md (opcional):** Atualizar a menção ao critério de senha (8 caracteres, maiúscula, minúscula, número) e, se aplicável, à obrigatoriedade de CORS e secrets em produção. Manter consistência com README e PRODUCTION-CHECKLIST.

5. **Spec project-docs (delta):** Adicionar requisito ADDED: a secção [1.10] do CHANGELOG deve descrever todas as changes listadas neste contexto; o repositório deve incluir um guia de atualização da versão 1.9 para a 1.10 (ex.: ATUALIZAR-1-9-PARA-1-10.md) com passos e requisitos de produção. Cenários verificáveis.

## Goals

- CHANGELOG [1.10] completo com todas as changes da release.
- README e docs/README.md atualizados (critério de senha, PRODUCTION-CHECKLIST, TOKEN-STORAGE, Caddyfile.example, indicação de que o hardening foi aplicado).
- Guia ATUALIZAR-1-9-PARA-1-10.md criado com passos e avisos para operadores.
- project.md consistente com a documentação atual.
- `openspec validate update-docs-changelog-v1-10-and-upgrade-guide --strict` passa.

## Out of scope

- Alterar código da aplicação; apenas documentação e CHANGELOG.
- Criar nova migração ou script SQL (a v1.10 não altera o esquema de BD).

## Success criteria

- Secção [1.10] do CHANGELOG lista as oito changes com descrição breve.
- README reflete critério de senha 8 chars e referências a PRODUCTION-CHECKLIST e TOKEN-STORAGE; secção de segurança indica que o plano foi aplicado.
- docs/README.md inclui Caddyfile.example, PRODUCTION-CHECKLIST.md e TOKEN-STORAGE.md.
- Ficheiro ATUALIZAR-1-9-PARA-1-10.md existe em docs/deploy/ com passos, variáveis obrigatórias em produção e avisos.
- Validação OpenSpec em modo strict passa.
