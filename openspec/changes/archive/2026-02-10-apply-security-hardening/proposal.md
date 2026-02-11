# Aplicar alterações de hardening na aplicação

## Why

As análises em [SECURITY-HARDENING.md](../../../docs/security/SECURITY-HARDENING.md) e [SECURITY-REMEDIATION.md](../../../docs/security/SECURITY-REMEDIATION.md) identificaram riscos e um plano de correção em cinco fases. O spec **security-hardening** define os requisitos. Esta change **implementa** na aplicação as alterações recomendadas: sanitização de HTML, CORS e headers de segurança, validação de secrets em produção, validação de uploads por magic bytes, Data Annotations e política de senha, rate limiting e auditoria, e hardening de infra (Docker, Caddyfile, documentação). A implementação segue a ordem das fases 1 a 5 e cumpre os cenários do spec.

## What Changes

1. **Fase 1 — XSS e tokens:** Sanitização de HTML no backend (MarkdownService) para todo o conteúdo (Markdown convertido e pass-through); opcionalmente sanitização no frontend (PostPage) como defesa em profundidade. Documento em docs/security com a decisão sobre armazenamento de token (sessionStorage vs cookies HttpOnly) e mitigações.

2. **Fase 2 — CORS, headers e secrets:** BFF em produção exige Cors:AllowedOrigins configurado (falha de arranque se vazio). Middleware de security headers no BFF (e na API) com X-Content-Type-Options, X-Frame-Options, Referrer-Policy; HSTS em produção quando aplicável. BFF em produção exige Jwt:Secret com comprimento mínimo (ex.: 32 caracteres); API em produção exige API:InternalKey (falha de arranque se ausente).

3. **Fase 3 — Uploads, validação e senha:** UploadsController valida magic bytes (assinatura) para JPEG, PNG e WebP antes de gravar. DTOs da API com Data Annotations ([Required], [EmailAddress], [StringLength], etc.) e validação ModelState.IsValid nos controllers. PasswordValidation endurecida: mínimo 8 caracteres e critérios de complexidade (maiúscula, minúscula, dígito).

4. **Fase 4 — Rate limiting e auditoria:** Rate limiting no BFF para login, uploads e rotas administrativas (ex.: por IP). Logs de auditoria para criação/exclusão de utilizadores, reset de senha e ações administrativas em posts (quem, o quê, quando; sem senhas/tokens).

5. **Fase 5 — Infra e documentação:** Dockerfiles da API e BFF com user não-root. Caddyfile de exemplo no repositório com HTTPS e headers de segurança. Documento (ou secção em docs/security) com variáveis obrigatórias para produção e checklist de hardening.

Cada grupo acima corresponde a tarefas concretas em tasks.md. O design.md descreve decisões (sanitização backend vs frontend, validação de secrets apenas em produção).

## Goals

- Conteúdo de posts sanitizado (backend e opcionalmente frontend); risco XSS mitigado.
- CORS restritivo em produção; security headers em respostas; Jwt:Secret e API:InternalKey obrigatórios em produção.
- Uploads validados por magic bytes; DTOs validados; política de senha reforçada.
- Rate limiting e logs de auditoria nos pontos sensíveis.
- Docker não-root; Caddyfile versionado; documentação de produção.
- `openspec validate apply-security-hardening --strict` passa.

## Out of scope

- Migração de JWT de sessionStorage para cookies HttpOnly (esta change documenta a estratégia; implementação pode ser change futura).
- Content-Security-Policy restritiva (pode ser adicionada depois).
- Verificação de senhas contra listas de senhas comuns (opcional, pode ser change futura).

## Success criteria

- Sanitização de HTML ativa no MarkdownService (e opcionalmente em PostPage).
- BFF e API aplicam security headers; CORS em produção exige origens configuradas; BFF/API falham em produção sem Jwt:Secret forte e API:InternalKey.
- UploadsController rejeita ficheiros cujos magic bytes não correspondam a JPEG/PNG/WebP; DTOs com anotações e ModelState validado; PasswordValidation com mínimo 8 caracteres e complexidade.
- Rate limiting ativo em login, uploads e rotas admin; auditoria para ações sensíveis.
- Dockerfiles com user não-root; Caddyfile de exemplo presente; docs com variáveis obrigatórias e checklist.
- Validação OpenSpec em modo strict passa.
