# security-hardening — delta for apply-security-hardening

## ADDED Requirements

### Requirement: Hardening implementado conforme fases 1–5 (SHALL)

As alterações de segurança definidas no spec **security-hardening** e nos documentos SECURITY-HARDENING.md e SECURITY-REMEDIATION.md **devem** (SHALL) ser implementadas na aplicação através das tarefas da change **apply-security-hardening**, na ordem das fases 1 a 5: (1) sanitização de HTML e estratégia de token; (2) CORS restritivo, headers de segurança e validação de secrets em produção; (3) validação de uploads por magic bytes, Data Annotations nos DTOs e política de senha reforçada; (4) rate limiting e logs de auditoria; (5) Docker não-root, Caddyfile de exemplo e documentação de produção. A implementação **deve** cumprir os cenários dos requisitos existentes do spec security-hardening (sanitização XSS, CORS, headers, secrets, uploads, validação de input e senha, rate limiting, auditoria, infra).

#### Scenario: Fase 1 aplicada — conteúdo sanitizado

- **Quando** as tarefas da Fase 1 da change apply-security-hardening estão concluídas
- **Então** o MarkdownService sanitiza todo o HTML (Markdown convertido e pass-through) antes de devolver ao cliente
- **E** existe documento em docs/security que descreve a decisão sobre armazenamento de token e mitigações
- **E** um post com conteúdo malicioso (script, on*) não executa na página do post

#### Scenario: Fase 2 aplicada — produção exige configuração

- **Quando** as tarefas da Fase 2 estão concluídas
- **Então** em ambiente de produção o BFF não arranca sem Cors:AllowedOrigins e Jwt:Secret forte
- **E** a API em produção não arranca sem API:InternalKey
- **E** as respostas do BFF e da API incluem X-Content-Type-Options, X-Frame-Options e Referrer-Policy
