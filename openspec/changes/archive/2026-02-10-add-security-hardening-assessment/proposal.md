# Avaliação de segurança e proposta de melhorias

## Why

Uma avaliação de segurança do projeto simple-blog-hub (revisão estática do frontend, BFF, API e infraestrutura) identificou riscos em várias camadas: XSS por conteúdo HTML não sanitizado, tokens JWT em sessionStorage vulneráveis a roubo via XSS, CORS e headers de segurança ausentes ou permissivos, segredos com fallbacks fracos ou opcionais em produção, validação de uploads baseada apenas em Content-Type, ausência de rate limiting e de logs de auditoria, e hardening incompleto em Docker/Caddy. Para permitir implementação incremental e rastreável, é necessário documentar a avaliação no repositório e formalizar as melhorias como requisitos (spec) e tarefas, sem aplicar alterações de código nesta change — apenas a documentação e a proposta.

## What Changes

1. **Documento de avaliação na raiz do projeto:** Criar `SECURITY-HARDENING.md` na raiz com o resumo da avaliação (objetivo, contexto/arquitetura, principais riscos, plano de melhorias em cinco fases e sequência recomendada), em formato similar a um plano de hardening, para uso por equipa e futuras implementações.

2. **Nova capability OpenSpec `security-hardening`:** Adicionar um spec com requisitos ADDED que cobrem as áreas de melhoria (mitigação XSS/sanitização de HTML, CORS restritivo, headers de segurança HTTP, validação de secrets e chave interna em produção, validação robusta de uploads, validação de input e política de senha, rate limiting e auditoria, hardening de infra e documentação). Cada requisito terá pelo menos um cenário verificável. A implementação concreta de cada requisito ficará para changes futuras; esta change apenas introduz o spec e o documento de avaliação.

3. **Tarefas:** Incluir em `tasks.md` a criação do documento na raiz, a redação dos deltas de spec e a validação com `openspec validate --strict`.

## Goals

- Repositório dispõe de um documento único (`SECURITY-HARDENING.md`) que descreve a avaliação de segurança e o plano de melhorias priorizado.
- O spec `security-hardening` existe e contém requisitos ADDED para cada fase do plano, com cenários, permitindo futuras changes de implementação alinhadas ao spec.
- A change valida com `openspec validate add-security-hardening-assessment --strict`.

## Out of scope

- Implementar em código qualquer uma das melhorias (sanitização, CORS, headers, secrets, uploads, rate limiting, auditoria, Docker/Caddy). Esta change é apenas documentação e proposta (spec + documento).
- Alterar comportamento da API, BFF ou frontend.

## Success criteria

- Ficheiro `SECURITY-HARDENING.md` existe na raiz do projeto com conteúdo completo (objetivo, contexto, riscos, fases 1–5, sequência).
- `openspec/changes/add-security-hardening-assessment/specs/security-hardening/spec.md` existe com requisitos ADDED e cenários.
- `openspec validate add-security-hardening-assessment --strict` passa.
