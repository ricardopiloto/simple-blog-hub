# Análise de segurança do código e proposta de correção

## Why

O projeto dispõe do documento [SECURITY-HARDENING.md](../../../docs/security/SECURITY-HARDENING.md) e do spec **security-hardening**, que descrevem riscos e um plano em cinco fases. Falta uma **análise explícita do código atual** que associe cada risco a ficheiros e comportamentos concretos, e uma **proposta de correção** com tarefas verificáveis para implementar as melhorias. Esta change faz essa análise e regista a proposta de correção (tarefas ordenadas por fase), sem aplicar alterações de código nesta change — apenas documentação e plano. A implementação será feita em changes futuras (ou via openspec-apply de tarefas incrementais).

## Análise de segurança do código (resumo)

Com base na revisão do repositório e em SECURITY-HARDENING.md, os pontos seguintes foram confirmados no código:

### Fase 1 — XSS e roubo de sessão

| Risco | Onde | Evidência |
|-------|------|-----------|
| **XSS por HTML não sanitizado** | `frontend/src/pages/PostPage.tsx` | Uso de `dangerouslySetInnerHTML={{ __html: post.content }}` sem sanitização. |
| **HTML pass-through sem sanitização** | `backend/api/Services/MarkdownService.cs` | `ToHtml` devolve o conteúdo inalterado quando `TrimStart().StartsWith("<")`, permitindo HTML arbitrário que chega ao frontend. |
| **Token em sessionStorage** | `frontend/src/auth/storage.ts` | JWT e dados de autor em `sessionStorage`; vulnerável a roubo via XSS. |

### Fase 2 — CORS, headers e secrets

| Risco | Onde | Evidência |
|-------|------|-----------|
| **CORS permissivo** | `backend/bff/Program.cs` | Quando `Cors:AllowedOrigins` está vazio ou não definido, usa `AllowAnyOrigin()`. |
| **Headers de segurança ausentes** | BFF e API | Nenhum middleware adiciona `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, etc. |
| **Jwt:Secret com fallback fraco** | `backend/bff/Program.cs` | `builder.Configuration["Jwt:Secret"] ?? "dev-secret-change-in-production-min-32-chars"` — valor em código e em appsettings.json. |
| **API:InternalKey opcional** | `backend/api/Program.cs`, BFF | API aceita pedidos sem `X-Api-Key` quando a chave não está configurada; BFF envia header só se configurado. |

### Fase 3 — Uploads, validação de input e senha

| Risco | Onde | Evidência |
|-------|------|-----------|
| **Upload validado só por Content-Type** | `backend/bff/Controllers/UploadsController.cs` | Verificação apenas de `file.ContentType`; não há validação de magic bytes (assinatura do ficheiro). |
| **DTOs sem Data Annotations** | `backend/api/Models/*Dtos.cs` | LoginRequest, CreateUserRequest, CreateOrUpdatePostRequest, etc. sem `[Required]`, `[EmailAddress]`, `[StringLength]`; validação manual esparsa. |
| **Política de senha fraca** | `backend/api/Services/PasswordValidation.cs` | Mínimo 6 caracteres, uma maiúscula e um número; sem verificação contra listas de senhas comuns nem mínimo 8 caracteres. |

### Fase 4 — Rate limiting e auditoria

| Risco | Onde | Evidência |
|-------|------|-----------|
| **Sem rate limiting** | BFF | Nenhum middleware ou atributo limita tentativas de login, uploads ou endpoints administrativos. |
| **Logs de auditoria insuficientes** | API/BFF | Criação de utilizadores, reset de senha, exclusão, publicação/remoção de posts não têm logs de auditoria estruturados (quem, o quê, quando). |

### Fase 5 — Infra e documentação

| Risco | Onde | Evidência |
|-------|------|-----------|
| **Docker como root** | Dockerfiles (backend/api, backend/bff) | Imagens podem executar como root. |
| **Caddyfile não versionado** | Documentação | Headers de segurança e HTTPS dependem de documentação; não há Caddyfile de exemplo no repositório. |

### Outras changes relacionadas

- **harden-login-credentials-exposure:** Corrige exposição de credenciais em documentação, appsettings e frontend (senha em texto claro, e-mail real em config). Essa change é complementar e deve ser aplicada em paralelo ou antes.

## What Changes (proposta de correção)

1. **Documento de análise e plano (docs/security/):** Criar ou atualizar um ficheiro (ex.: `SECURITY-REMEDIATION.md` ou secção em SECURITY-HARDENING.md) que liste, por fase, os **pontos confirmados no código** (tabela resumo como acima) e as **ações de correção** associadas (uma por risco), com referência aos ficheiros e ao spec security-hardening. Este documento será a referência para implementação incremental.

2. **Tarefas ordenadas (tasks.md):** Lista de tarefas verificáveis, agrupadas por fase (Fase 1 a 5), que implementam as correções:
   - **Fase 1:** Sanitização de HTML (backend em MarkdownService e/ou frontend em PostPage); documento de decisão sobre estratégia de armazenamento de token (sessionStorage vs cookies HttpOnly).
   - **Fase 2:** CORS restritivo em produção (ex.: falhar arranque se AllowedOrigins vazio); middleware de security headers no BFF (e opcionalmente API ou Caddy); validação de Jwt:Secret e API:InternalKey em produção (obrigatórios, sem fallback de desenvolvimento).
   - **Fase 3:** Validação de uploads por magic bytes no UploadsController; Data Annotations nos DTOs da API e validação ModelState; endurecer PasswordValidation (mínimo 8 caracteres, complexidade, opcional: lista de senhas comuns).
   - **Fase 4:** Rate limiting em endpoints de login, upload e administrativos; logs de auditoria para criação/exclusão de utilizadores, reset de senha, ações administrativas em posts.
   - **Fase 5:** Dockerfiles com user não-root; Caddyfile de exemplo versionado com HTTPS e headers; documentação de hardening (variáveis obrigatórias, checklist).

3. **Spec delta security-hardening:** Adicionar um requisito (ADDED) que exija que as correções de segurança sejam implementadas conforme as fases 1–5 do plano (SECURITY-HARDENING.md) e que o documento de análise/remediação (ou SECURITY-HARDENING.md atualizado) contenha o mapeamento risco → código → ação. Cenário verificável: quando uma fase N está implementada, os itens dessa fase estão cumpridos (ex.: Fase 1 → HTML sanitizado e decisão sobre tokens documentada).

4. **Validação:** `openspec validate add-security-remediation-proposal --strict` deve passar.

## Goals

- Existe um documento (em docs/security/) que descreve a análise de segurança do código (riscos confirmados por ficheiro) e o plano de correção por fase.
- tasks.md contém tarefas ordenadas por fase (1–5) que, quando executadas, implementam as correções descritas em SECURITY-HARDENING.md.
- O spec security-hardening inclui um requisito que exige a implementação das fases e o documento de análise/remediação.
- A change valida em modo strict.

## Out of scope

- Implementar em código as correções nesta change; apenas documentação (análise + plano) e tarefas/spec.
- Substituir ou duplicar a change harden-login-credentials-exposure; essa change trata especificamente da exposição de credenciais em doc/config/frontend.

## Success criteria

- Documento em docs/security/ com análise (risco → ficheiro → evidência) e plano de correção por fase.
- tasks.md com tarefas verificáveis para Fases 1–5.
- openspec/changes/add-security-remediation-proposal/specs/security-hardening/spec.md com requisito ADDED e cenário.
- `openspec validate add-security-remediation-proposal --strict` passa.
