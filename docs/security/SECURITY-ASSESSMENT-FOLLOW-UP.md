# Avaliação de segurança (follow-up)

Este documento descreve uma **análise de follow-up** após o hardening já aplicado (SECURITY-HARDENING.md, SECURITY-REMEDIATION.md e changes apply-security-hardening, run-backend-containers-non-root). **Nenhuma alteração de código é aplicada** neste documento; serve como referência para implementação futura.

---

## 1. O que já está coberto

| Área | Estado | Referência |
|------|--------|------------|
| Sanitização HTML (XSS) | Implementado no backend (HtmlSanitizer) e frontend (DOMPurify) | MarkdownService, PostPage |
| CORS restritivo em produção | BFF exige Cors:AllowedOrigins em produção; arranque falha se vazio | Program.cs, PRODUCTION-CHECKLIST |
| Headers de segurança | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS em produção | Middleware BFF/API, Caddyfile.example |
| Secrets em produção | Jwt:Secret ≥ 32 chars, API:InternalKey obrigatórios em produção | Validação ao arranque |
| Uploads (magic bytes) | Validação por assinatura de ficheiro (JPEG, PNG, WebP) no BFF | UploadsController |
| Política de senha | Mínimo 8 caracteres, maiúscula, minúscula, número | PasswordValidation, API |
| Rate limiting | Login e Uploads com políticas configuráveis | Program.cs, AddRateLimiting |
| Logs de auditoria | Ações sensíveis (criação de utilizadores, reset de senha, etc.) registadas | API/BFF |
| Contentores não-root | API e BFF como UID 10000; guia CONFIGURAR-SERVIDOR-NAO-ROOT | Dockerfiles, docs/deploy |
| Credenciais em documentação | Sem senha em texto claro; placeholders em appsettings | SECURITY-HARDENING, README |

---

## 2. Recomendações adicionais (priorizadas)

### 2.1 Alta prioridade

- **Content-Security-Policy (CSP):** Adicionar header `Content-Security-Policy` (ou `Content-Security-Policy-Report-Only`) no BFF ou no Caddy para restringir origens de script, estilo e recursos; reduz superfície de XSS. Requer análise dos scripts e estilos em uso (Vite, inline, CDN) para definir diretivas sem quebrar a aplicação.
- **Auditoria de dependências:** Integrar verificação periódica de vulnerabilidades em pacotes NuGet (API, BFF) e npm (frontend): `dotnet list package --vulnerable`, `npm audit`. Documentar no README ou em CI; tratar advisories de severidade alta/média em changes dedicadas.

### 2.2 Média prioridade

- **Revisão de logs:** Garantir que nenhum log (API, BFF, frontend em modo dev) regista senhas, tokens JWT, corpo de pedidos de login ou headers de autorização. Revisar pontos que usam ILogger e remover ou ofuscar dados sensíveis.
- **Cookies seguros:** Se no futuro o JWT for servido via cookie (HttpOnly, Secure), configurar `SameSite` e `Secure` e documentar em TOKEN-STORAGE.md. Mantém-se sessionStorage como está até decisão explícita.

### 2.3 Baixa prioridade

- **CSRF:** Endpoints que alteram estado (POST/PUT/DELETE) são chamados com JWT no header; em cenário same-origin (Caddy proxy) o risco de CSRF é mitigado. Se no futuro houver uso de cookies para autenticação, considerar tokens CSRF ou SameSite=Strict.
- **Limite de tamanho de corpo:** Além do limite de upload (5 MB), considerar limites globais de request body para evitar abuso em outros endpoints (ex.: criação de post com conteúdo muito grande).

---

## 3. Priorização (impacto vs. esforço)

| Recomendação | Impacto | Esforço | Ordem sugerida |
|--------------|---------|---------|----------------|
| CSP | Alto (reduz XSS) | Médio (ajustar diretivas) | 1 |
| Auditoria de dependências | Alto (remedia CVEs) | Baixo (comandos + doc/CI) | 2 |
| Revisão de logs | Médio (evita vazamento) | Baixo | 3 |
| Cookies seguros (se aplicável) | Médio | Médio | 4 |
| CSRF / limites de corpo | Baixo a médio | Baixo | 5 |

---

## 4. Como verificar vulnerabilidades (auditoria de dependências)

- **Backend (API e BFF):** Na raiz de cada projeto, execute `dotnet list package --vulnerable`. Corrigir pacotes com vulnerabilidades de severidade alta ou média em changes dedicadas.
- **Frontend:** No diretório `frontend/`, execute `npm audit`. Tratar advisories conforme a política do projeto (ex.: `npm audit fix` quando seguro, ou atualização manual de dependências).
- **Revisão de logs:** Garantir que nenhum log (API, BFF, frontend em modo dev) regista senhas, tokens JWT, corpo de pedidos de login ou headers de autorização. Revisar pontos que usam ILogger e remover ou ofuscar dados sensíveis. Ver também [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md).

---

Para o plano original em fases, ver [SECURITY-HARDENING.md](SECURITY-HARDENING.md). Para o mapeamento risco → correção, ver [SECURITY-REMEDIATION.md](SECURITY-REMEDIATION.md).
