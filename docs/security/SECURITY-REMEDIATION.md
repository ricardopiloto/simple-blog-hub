# Análise de segurança do código e plano de remediação

Este documento descreve a **análise de segurança** do código (riscos confirmados por ficheiro) e o **plano de correção** por fase, alinhado a [SECURITY-HARDENING.md](SECURITY-HARDENING.md) e ao spec **security-hardening**. A exposição de credenciais de login em documentação e configuração é tratada na change **harden-login-credentials-exposure**.

---

## Análise por fase (risco → ficheiro → evidência)

### Fase 1 — XSS e roubo de sessão

| Risco | Ficheiro(s) | Evidência / ação de correção |
|-------|-------------|------------------------------|
| XSS por HTML não sanitizado | `frontend/src/pages/PostPage.tsx` | `dangerouslySetInnerHTML={{ __html: post.content }}` sem sanitização. **Correção:** Sanitizar HTML no backend (MarkdownService) e/ou no frontend (ex.: DOMPurify) antes de exibir. |
| HTML pass-through sem sanitização | `backend/api/Services/MarkdownService.cs` | `ToHtml` devolve conteúdo inalterado quando começa com `<`. **Correção:** Aplicar sanitização também ao pass-through (HtmlSanitizer ou equivalente). |
| Token em sessionStorage | `frontend/src/auth/storage.ts` | JWT em sessionStorage; vulnerável a roubo via XSS. **Correção:** Documentar estratégia (sessionStorage vs cookies HttpOnly); se mantiver sessionStorage, endurecer XSS e CSP. |

### Fase 2 — CORS, headers e secrets

| Risco | Ficheiro(s) | Evidência / ação de correção |
|-------|-------------|------------------------------|
| CORS permissivo | `backend/bff/Program.cs` | `Cors:AllowedOrigins` vazio ou ausente → `AllowAnyOrigin()`. **Correção:** Em produção, exigir origens configuradas; falhar arranque se vazio. |
| Headers de segurança ausentes | BFF, API | Nenhum middleware adiciona X-Content-Type-Options, X-Frame-Options, Referrer-Policy, etc. **Correção:** Middleware de security headers no BFF (e/ou API/Caddy). |
| Jwt:Secret com fallback fraco | `backend/bff/Program.cs`, `appsettings.json` | Fallback "dev-secret-..." em código. **Correção:** Em produção, validar que Jwt:Secret existe e tem entropia mínima; sem fallback. |
| API:InternalKey opcional | `backend/api/Program.cs`, BFF | API aceita pedidos sem X-Api-Key quando não configurado. **Correção:** Em produção, exigir API:InternalKey configurado; recusar arranque se ausente. |

### Fase 3 — Uploads, validação de input e senha

| Risco | Ficheiro(s) | Evidência / ação de correção |
|-------|-------------|------------------------------|
| Upload só por Content-Type | `backend/bff/Controllers/UploadsController.cs` | Validação apenas `file.ContentType`. **Correção:** Validar magic bytes (assinatura) para JPEG/PNG/WebP; rejeitar ficheiros que não correspondam. |
| DTOs sem Data Annotations | `backend/api/Models/*Dtos.cs` | LoginRequest, CreateUserRequest, etc. sem [Required], [EmailAddress], etc. **Correção:** Adicionar anotações e validar ModelState.IsValid nas actions. |
| Política de senha fraca | `backend/api/Services/PasswordValidation.cs` | Mínimo 6 caracteres, uma maiúscula e um número. **Correção:** Mínimo 8 caracteres, complexidade reforçada; opcional: verificação contra listas de senhas comuns. |

### Fase 4 — Rate limiting e auditoria

| Risco | Ficheiro(s) | Evidência / ação de correção |
|-------|-------------|------------------------------|
| Sem rate limiting | BFF | Nenhum limite em login, uploads ou endpoints administrativos. **Correção:** Middleware ou política de rate limiting (ex.: por IP) em login, uploads e rotas administrativas. |
| Logs de auditoria insuficientes | API, BFF | Criação/exclusão de utilizadores, reset de senha, ações em posts sem log estruturado. **Correção:** Registrar quem, o quê e quando para ações sensíveis; sem senhas/tokens em log. |

### Fase 5 — Infra e documentação

| Risco | Ficheiro(s) | Evidência / ação de correção |
|-------|-------------|------------------------------|
| Docker como root | Dockerfiles (backend/api, backend/bff) | Imagens podem executar como root. **Correção:** User não-root nos Dockerfiles. |
| Caddyfile não versionado | docs | HTTPS e headers dependem da documentação. **Correção:** Caddyfile de exemplo no repositório com HTTPS e headers de segurança. |
| Documentação de hardening | docs | Variáveis obrigatórias e checklist não centralizados. **Correção:** Documento com variáveis obrigatórias para produção e checklist de revisão. |

---

## Plano de correção (ordem de implementação)

1. **Fase 1** — Sanitização de HTML (MarkdownService e/ou PostPage); documento de decisão sobre token (sessionStorage vs HttpOnly).
2. **Fase 2** — CORS restritivo em produção; middleware de security headers; Jwt:Secret e API:InternalKey obrigatórios em produção.
3. **Fase 3** — Validação de uploads por magic bytes; Data Annotations e ModelState nos DTOs; política de senha reforçada.
4. **Fase 4** — Rate limiting (login, uploads, admin); logs de auditoria para ações sensíveis.
5. **Fase 5** — Docker user não-root; Caddyfile versionado; documentação de hardening.

Requisitos formais: spec **security-hardening** em `openspec/changes/add-security-hardening-assessment/specs/security-hardening/spec.md` e delta em `openspec/changes/harden-login-credentials-exposure` e `add-security-remediation-proposal`.
