# Tasks: add-code-improvements-evaluation

## 1. Documento de avaliação na raiz

- [x] 1.1 Criar **CODE-IMPROVEMENTS.md** na raiz com: (1) **Segurança** — resumo e referência a SECURITY-HARDENING.md e ao spec security-hardening; priorização das fases existentes; (2) **Simplificação de código** — padrões repetidos (extração de AuthorId na API e no BFF, validação manual nos DTOs, tratamento de erros no cliente frontend); propostas (middleware/base para X-Author-Id na API, helper partilhado GetAuthorId no BFF, Data Annotations/ModelState na API, centralização de erros no frontend); (3) **Reaproveitamento** — proposta de convenções ou “mini-frameworks” (contexto de autor na API/BFF, cliente HTTP frontend unificado, pipeline de validação na API). Listar ficheiros relevantes e prioridade sugerida. Não aplicar alterações de código.

## 2. Spec delta code-improvements

- [x] 2.1 Criar **openspec/changes/add-code-improvements-evaluation/specs/code-improvements/spec.md** com secção **## ADDED Requirements** para: (1) melhorias de segurança alinhadas ao plano SECURITY-HARDENING (referência ao spec security-hardening); (2) simplificação de código (redução de duplicação de extração de AuthorId, validação de input consistente na API, tratamento de erros no cliente frontend); (3) reaproveitamento de estruturas (contexto de autor reutilizável na API e no BFF, cliente BFF com base URL e auth centralizados, validação consistente na API). Cada requisito com pelo menos um **#### Scenario:**. Incluir SHALL ou MUST no corpo dos requisitos onde aplicável.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-code-improvements-evaluation --strict` e corrigir falhas até passar.
