# Avaliação de melhorias para o código (segurança, simplificação, reaproveitamento)

## Why

O projeto beneficia de uma avaliação estruturada de melhorias que abranja **segurança** (alinhada ao plano existente em SECURITY-HARDENING.md), **simplificação de código** (redução de duplicação, validação consistente) e **reaproveitamento de estruturas** através de padrões ou pequenos “frameworks” internos (extração de contexto de autor, cliente HTTP, validação). Esta change **não implementa** nenhuma alteração de código; apenas regista a avaliação e a proposta em documento e em requisitos OpenSpec, para que futuras changes possam implementar de forma incremental.

## What Changes

1. **Documento de avaliação (CODE-IMPROVEMENTS.md na raiz):** Criar um ficheiro que descreva: (a) **Segurança** — resumo e referência ao SECURITY-HARDENING.md e ao spec security-hardening; priorização das fases já definidas; (b) **Simplificação de código** — padrões repetidos identificados (extração de AuthorId no backend API e BFF, validação manual sem Data Annotations nos DTOs, tratamento de erros HTTP no frontend); propostas concretas (middleware ou base controller para X-Author-Id na API; helper partilhado para GetAuthorId(ClaimsPrincipal) no BFF; Data Annotations e ModelState na API; possível centralização de mensagens de erro no frontend); (c) **Reaproveitamento e estruturas reutilizáveis** — proposta de “mini-frameworks” ou convenções: contexto de autor na API (serviço ou middleware que exponha AuthorId após validar header); contexto de autor no BFF (extração do JWT numa única vez por request); cliente HTTP do frontend (função/base que unifique base URL, token, 401 e parsing); pipeline de validação na API (FluentValidation ou Data Annotations de forma consistente). O documento deve listar ficheiros relevantes e prioridade sugerida, **sem executar** alterações.

2. **Nova capability OpenSpec `code-improvements`:** Adicionar um spec com requisitos ADDED que cubram: (1) melhorias de segurança conforme plano SECURITY-HARDENING (referência ao spec security-hardening); (2) simplificação de código (extração de padrões repetidos de AuthorId, validação de input na API, tratamento de erros no frontend); (3) reaproveitamento de estruturas (convenções ou componentes reutilizáveis para contexto de autor, cliente BFF e validação). Cada requisito com pelo menos um cenário verificável. A implementação ficará para changes futuras.

3. **Tarefas:** Incluir em tasks.md a criação do documento, a redação dos deltas de spec e a validação com `openspec validate --strict`.

## Goals

- Existe um documento **CODE-IMPROVEMENTS.md** na raiz que descreve a avaliação e a proposta (segurança, simplificação, reaproveitamento), com referências a ficheiros e prioridade, sem aplicar código.
- O spec **code-improvements** existe com requisitos ADDED e cenários, permitindo futuras implementações alinhadas ao spec.
- A change valida com `openspec validate add-code-improvements-evaluation --strict`.

## Out of scope

- Implementar em código qualquer melhoria (segurança, simplificação ou framework). Esta change é apenas documento e proposta (spec + CODE-IMPROVEMENTS.md).
- Alterar comportamento da API, BFF ou frontend.

## Success criteria

- Ficheiro **CODE-IMPROVEMENTS.md** existe na raiz com secções para segurança, simplificação e reaproveitamento, e referências a ficheiros.
- **openspec/changes/add-code-improvements-evaluation/specs/code-improvements/spec.md** existe com requisitos ADDED e cenários.
- `openspec validate add-code-improvements-evaluation --strict` passa.
