# Tasks: add-security-hardening-assessment

## 1. Documento de avaliação na raiz

- [x] 1.1 Criar `SECURITY-HARDENING.md` na raiz do projeto com: objetivo do plano de hardening, contexto e arquitetura relevante (frontend, BFF, API, infra), fluxo simplificado (mermaid), principais riscos identificados (resumo numerado), plano de melhorias em cinco fases (Fase 1 XSS/tokens, Fase 2 CORS/headers/secrets, Fase 3 uploads/input/auth, Fase 4 rate limiting/auditoria, Fase 5 infra/docs) e sequência recomendada. Formato e conteúdo alinhados ao plano de avaliação existente (sem aplicar alterações de código).

## 2. Spec delta security-hardening

- [x] 2.1 Criar `openspec/changes/add-security-hardening-assessment/specs/security-hardening/spec.md` com secção `## ADDED Requirements` contendo requisitos para: (1) mitigação XSS e sanitização de HTML no conteúdo de posts; (2) CORS restritivo em produção; (3) headers de segurança HTTP na API/BFF ou Caddy; (4) validação de Jwt:Secret e API:InternalKey em produção; (5) validação robusta de uploads (magic bytes / tipos permitidos); (6) validação de input (DTOs, senha, email/slug); (7) rate limiting em endpoints sensíveis; (8) logs de auditoria para ações administrativas; (9) hardening de infra (Docker não-root, Caddyfile versionado, documentação). Cada requisito com pelo menos um `#### Scenario:`.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-security-hardening-assessment --strict` e corrigir falhas até passar.
