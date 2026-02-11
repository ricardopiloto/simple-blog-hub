# security-hardening — delta for add-security-remediation-proposal

## ADDED Requirements

### Requirement: Implementação das fases de hardening e documento de remediação (SHALL)

As correções de segurança identificadas no plano **SECURITY-HARDENING.md** **devem** (SHALL) ser implementadas na ordem das fases 1 a 5 (Fase 1: XSS e tokens; Fase 2: CORS, headers e secrets; Fase 3: uploads, validação de input e senha; Fase 4: rate limiting e auditoria; Fase 5: infra e documentação). O projeto **deve** dispor de um documento de análise e remediação (ex.: **docs/security/SECURITY-REMEDIATION.md**) que mapeie, por fase: **risco** → **ficheiros/código afetado** → **ação de correção**, de forma a permitir implementação incremental e rastreável. Este documento **deve** estar alinhado aos requisitos do spec **security-hardening** e **deve** referenciar a change **harden-login-credentials-exposure** para a exposição de credenciais em documentação e configuração.

#### Scenario: Fase 1 implementada — sanitização e estratégia de token

- **Dado** que o documento SECURITY-REMEDIATION.md descreve a Fase 1 (XSS e roubo de sessão)
- **Quando** a Fase 1 está implementada
- **Então** o conteúdo HTML de posts é sanitizado antes de ser exibido (no backend e/ou no frontend), cumprindo o requisito de sanitização do spec security-hardening
- **E** existe documento ou decisão que descreve a estratégia de armazenamento de token (sessionStorage vs cookies HttpOnly) e mitigações associadas

#### Scenario: Documento de remediação existe e mapeia riscos por fase

- **Quando** um desenvolvedor ou operador consulta docs/security/SECURITY-REMEDIATION.md
- **Então** vê, por cada fase (1–5), os riscos confirmados no código com ficheiros e evidência
- **E** vê as ações de correção correspondentes e a referência ao spec security-hardening
- **E** pode usar o documento para implementar ou verificar as correções de forma incremental
