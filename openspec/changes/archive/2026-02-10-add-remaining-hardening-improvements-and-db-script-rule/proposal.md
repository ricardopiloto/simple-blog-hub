# Validação das propostas de hardening e melhoria — itens em falta e regra de script para BD

## Why

É necessário **validar** que todas as propostas de hardening (SECURITY-HARDENING.md, SECURITY-REMEDIATION.md) e de melhoria de código (CODE-IMPROVEMENTS.md, spec code-improvements) estão cobertas por changes e tarefas concretas, e **corrigir lacunas** quando alguma proposta ficar para trás. Além disso, o utilizador exigiu que **qualquer proposta que gere alteração no banco de dados** tenha um **script para execução manual** (ex.: em `backend/api/Migrations/Scripts/`). Esta change regista a validação, cobre os itens em falta e introduz a regra formal de script para alterações de esquema.

## Validação — mapeamento proposta → change/tarefa

### Hardening (Fases 1–5)

| Proposta | Change / tarefa | Estado |
|----------|------------------|--------|
| Sanitização HTML (backend + opcional frontend) | apply-security-hardening 1.1, 1.2 | Coberto |
| Documentar estratégia de token | apply-security-hardening 1.3 | Coberto |
| CORS restritivo em produção | apply-security-hardening 2.1 | Coberto |
| Security headers (BFF + API) | apply-security-hardening 2.2, 2.3 | Coberto |
| Jwt:Secret e API:InternalKey obrigatórios em prod | apply-security-hardening 2.4, 2.5 | Coberto |
| Upload magic bytes | apply-security-hardening 3.1 | Coberto |
| Data Annotations + ModelState | apply-security-hardening 3.2, apply-code-improvements 3.x | Coberto |
| **Slug com expressão restritiva (regex)** | **Não explícito em nenhuma tarefa** | **Lacuna** |
| Política de senha (8 chars, complexidade) | apply-security-hardening 3.3 | Coberto |
| Rate limiting | apply-security-hardening 4.1 | Coberto |
| Logs de auditoria (quem, o quê, quando) | apply-security-hardening 4.2 | Coberto |
| **Rever logging existente (senhas/tokens nunca em log)** | **Mencionado no plano, não como tarefa** | **Lacuna** |
| Docker user não-root | apply-security-hardening 5.1 | Coberto |
| Caddyfile de exemplo | apply-security-hardening 5.2 | Coberto |
| Doc variáveis obrigatórias e checklist | apply-security-hardening 5.3 | Coberto |
| **Permissões restritivas na pasta data/ no host** | Spec exige; doc de deploy pode não detalhar | **Lacuna (doc)** |
| Exposição de credenciais em doc/config | harden-login-credentials-exposure | Coberto |

### Melhorias de código

| Proposta | Change / tarefa | Estado |
|----------|------------------|--------|
| BFF helper GetAuthorId(ClaimsPrincipal) | apply-code-improvements 1.1, 1.2 | Coberto |
| API contexto X-Author-Id (base ou middleware) | apply-code-improvements 2.1, 2.2 | Coberto |
| Data Annotations e ModelState na API | apply-code-improvements 3.x, apply-security-hardening 3.2 | Coberto |
| Frontend requestPublic / requestWithAuth | apply-code-improvements 4.x | Coberto |

### Regra de alterações de banco de dados

- **Requisito do utilizador:** "Caso alguma proposta gere alteração no banco de dados, nós precisamos gerar um script para execução manual."
- **Estado atual:** O projeto já tem scripts manuais em `backend/api/Migrations/Scripts/` (ex.: add_scheduled_publish_at_to_posts.sql) e documentação no README da API para migrações manuais. **Não existe** uma regra formal em OpenSpec ou em docs que exija que **qualquer** change que introduza alteração de esquema (nova tabela, nova coluna) **deve** incluir um script em `Migrations/Scripts/` e referenciá-lo no README e na change. **Lacuna:** formalizar esta regra como requisito do projeto e documentá-la.

## Itens em falta (lacunas)

1. **Validação de slug com regex:** O spec security-hardening exige que "O slug de posts **DEVE** ser validado com uma expressão restritiva (ex.: apenas caracteres seguros para URL)". As tarefas de apply-security-hardening 3.2 falam em "Data Annotations aos DTOs" sem mencionar explicitamente o slug. É necessário garantir que o DTO que contém slug (ex.: CreateOrUpdatePostRequest) tenha validação por regex (ex.: `[RegularExpression(...)]`) e que a API rejeite slugs inválidos.

2. **Revisão de logging:** SECURITY-HARDENING diz "Rever pontos de logging para garantir que senhas/tokens nunca são logados". apply-security-hardening 4.2 adiciona logs de auditoria sem dados sensíveis, mas não há tarefa explícita para **revisar** o código existente (controllers, services) e garantir que em nenhum ponto se faz log de senhas ou tokens. Documentar este requisito e, se aplicável, incluir uma tarefa de revisão (ou checklist em docs).

3. **Permissões da pasta data/ no host:** O spec security-hardening exige "A pasta de dados (ex.: data/) **DEVE** ter permissões restritivas no host." apply-security-hardening 5.1 e 5.3 cobrem Docker e documentação geral; a recomendação explícita de permissões no host (ex.: chmod, proprietário do processo) deve constar na documentação de deploy ou de hardening.

4. **Regra de script para alterações de BD:** Qualquer change que introduza alteração de esquema (nova tabela, nova coluna, nova migração EF que altere o BD) **deve** incluir um script SQL em `backend/api/Migrations/Scripts/` para execução manual (quando aplicável) e **deve** referenciar esse script no README da API e nas tarefas da change. Isto permite deploy e atualizações em ambientes onde as migrações EF não são executadas automaticamente e garante rastreabilidade.

## What Changes

1. **Validação de slug na API:** Adicionar ao DTO que contém slug (CreateOrUpdatePostRequest em PostDto.cs) uma anotação `[RegularExpression(...)]` que restrinja o slug a caracteres seguros para URL (ex.: letras minúsculas, números, hífens; sem espaços nem caracteres especiais). Garantir que a API valida e rejeita com BadRequest quando o slug for inválido. (Pode ser feito nesta change ou como tarefa adicional em apply-security-hardening; nesta change fica explícito como tarefa para não ficar para trás.)

2. **Documentação de requisitos de logging e permissões:** Em docs/security (SECURITY-REMEDIATION.md ou SECURITY-HARDENING.md) ou em documento de deploy: (a) indicar que os pontos de logging existentes e futuros **não** devem registar senhas, tokens ou dados sensíveis em texto claro; recomendar revisão ao implementar auditoria; (b) indicar que a pasta `data/` no host (onde fica o SQLite) deve ter permissões restritivas (ex.: apenas o utilizador que corre a API/BFF; documentar chmod ou equivalente).

3. **Regra de script para alterações de BD:** Documentar em `backend/api/README.md` (e opcionalmente em docs/deploy ou docs/database) a regra: **qualquer change que introduza alteração de esquema de base de dados** (nova tabela, nova coluna, ou migração EF que altere o esquema) **deve** incluir um script SQL em `backend/api/Migrations/Scripts/` para execução manual quando aplicável, e a change **deve** referenciar esse script no README da API e nas suas tarefas. Incluir na secção de migrações manuais do README da API um aviso neste sentido.

4. **Spec project-docs (ou security-hardening):** Adicionar requisito ADDED: quando uma change introduz alteração de esquema de base de dados, o projeto **deve** disponibilizar um script SQL em `backend/api/Migrations/Scripts/` para execução manual e **deve** documentá-lo no README da API e na change. Cenário verificável.

## Goals

- Nenhuma proposta de hardening ou melhoria fica sem tarefa ou referência; lacunas (slug regex, revisão de logging, permissões data/, regra de script BD) estão cobertas.
- Slug de posts validado com regex na API.
- Documentação atualizada com requisitos de logging (sem senhas/tokens) e permissões da pasta data/ no host.
- Regra formal: alterações de BD exigem script manual em Migrations/Scripts/ e documentação; spec e README da API refletem esta regra.
- `openspec validate add-remaining-hardening-improvements-and-db-script-rule --strict` passa.

## Out of scope

- Implementar rate limiting, auditoria em tabela ou outras alterações de BD nesta change; a regra aplica-se a **futuras** changes que alterem o esquema.
- Substituir tarefas já definidas em apply-security-hardening ou apply-code-improvements; apenas completar o que faltou.

## Success criteria

- Slug com validação por regex no DTO de criação/atualização de post (e rejeição pela API quando inválido).
- Docs de segurança ou deploy mencionam: (a) logging sem senhas/tokens; (b) permissões restritivas na pasta data/ no host.
- README da API (e/ou docs) contém a regra de script para alterações de BD; spec project-docs (ou security-hardening) inclui requisito ADDED com cenário.
- Validação OpenSpec em modo strict passa.
