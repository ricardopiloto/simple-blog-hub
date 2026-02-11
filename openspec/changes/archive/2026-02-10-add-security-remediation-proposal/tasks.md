# Tasks: add-security-remediation-proposal

## 1. Documento de análise e plano

- [x] 1.1 Criar **docs/security/SECURITY-REMEDIATION.md** com: (1) resumo da análise de segurança do código (tabelas por fase: risco, ficheiro, evidência), alinhado à secção "Análise de segurança do código" da proposta; (2) plano de correção por fase (Fase 1–5) com ações concretas e referência ao spec security-hardening; (3) referência à change harden-login-credentials-exposure para exposição de credenciais.

## 2. Spec delta security-hardening

- [x] 2.1 Em **openspec/changes/add-security-remediation-proposal/specs/security-hardening/spec.md**, adicionar requisito ADDED: as correções de segurança **devem** ser implementadas conforme as fases 1–5 do plano em SECURITY-HARDENING.md; o projeto **deve** dispor de um documento (ex.: SECURITY-REMEDIATION.md) que mapeie risco → código → ação por fase. Incluir pelo menos um **#### Scenario:** (ex.: quando a Fase 1 está implementada, o conteúdo de posts é sanitizado e a estratégia de armazenamento de token está documentada).

## 3. Validação

- [x] 3.1 Executar `openspec validate add-security-remediation-proposal --strict` e corrigir falhas até passar.
