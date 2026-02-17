# Proposal: Avaliações de segurança, otimização de código e otimização de imagens

## Summary

Este change adiciona **três documentos de avaliação e recomendações** ao repositório, sem implementar alterações de código: (1) **Segurança** — análise de follow-up com recomendações adicionais após o hardening já aplicado (CSP, dependências, logging, etc.); (2) **Otimização de código** — análise para reaproveitamento e simplificação (estruturas partilhadas, redução de duplicação, priorização face ao estado atual); (3) **Otimização de imagens** — análise sobre compactação no envio, tamanho servido ao utilizador e tempo de carregamento (compressão no upload, formatos, dimensões, lazy loading, menor quantidade de dados ao utilizador final). Os documentos ficam em `docs/security/`, `docs/improvements/` e servem como base para changes futuras de implementação.

## Why

- **Segurança:** O projeto já segue SECURITY-HARDENING e SECURITY-REMEDIATION; é útil uma **nova análise** que identifique melhorias adicionais (ex.: Content-Security-Policy, auditoria de dependências, revisão de logs) e priorize próximos passos.
- **Código:** CODE-IMPROVEMENTS.md já existe; parte foi implementada (BFF GetAuthorId, API base controller). Uma **análise atualizada** pode listar o que falta (ex.: frontend requestPublic/requestWithAuth, Data Annotations completos) e sugerir novas estruturas para simplificação.
- **Imagens:** Atualmente as imagens de capa são enviadas e guardadas **sem compressão ou redimensionamento**; o frontend serve a mesma URL em todos os contextos (lista, post, índice), o que pode enviar ficheiros grandes ao navegador. Falta uma **análise** com recomendações (compressão no upload, respostas responsivas, lazy loading) para reduzir dados transferidos e melhorar tempo de carregamento.

## What Changes

- **Novo documento:** `docs/security/SECURITY-ASSESSMENT-FOLLOW-UP.md` — análise de segurança de follow-up: itens já cobertos pelo hardening atual; recomendações adicionais (CSP, auditoria de pacotes, revisão de logging, cookies seguros, etc.); priorização.
- **Novo documento:** `docs/improvements/CODE-OPTIMIZATION-RECOMMENDATIONS.md` — análise atualizada de otimização de código: estado atual (BFF helper, API base); itens pendentes do CODE-IMPROVEMENTS (frontend client, Data Annotations); novas recomendações para classes e estruturas que simplifiquem e evitem duplicação.
- **Novo documento:** `docs/improvements/IMAGE-OPTIMIZATION.md` — análise de otimização de imagens: estado atual (upload sem compressão, serviço de ficheiro único); recomendações para compactação no envio ao servidor, redução do tamanho servido ao navegador (redimensionamento, formatos, srcset/lazy loading), com o objetivo de carregar a **menor quantidade possível de dados** para o utilizador final.
- **Spec deltas:** project-docs — requisito ADDED que o repositório contenha ou referencie documentos de avaliação para segurança (follow-up), otimização de código e otimização de imagens com recomendações acionáveis. Opcional: code-improvements — referência ao documento de otimização de imagens quando aplicável.

## Goals

- Operadores e desenvolvedores dispõem de **três avaliações** claras (segurança, código, imagens) com recomendações priorizadas.
- As recomendações são **acionáveis** (podem ser implementadas em changes OpenSpec futuras) e alinhadas ao estado atual do projeto.
- Nenhuma alteração de código nem de comportamento nesta change; apenas documentação e, se aplicável, requisitos de documentação nos specs.

## Scope

- **In scope:** Redação e inclusão dos três documentos; atualização do spec project-docs (e opcionalmente code-improvements) para exigir ou referenciar esses documentos.
- **Out of scope:** Implementar as recomendações (compressão de imagens, CSP, refatoração do client.ts, etc.); alterar BFF, API ou frontend além de adicionar os ficheiros em docs/.

## Affected code and docs

- **docs/security/SECURITY-ASSESSMENT-FOLLOW-UP.md** (novo)
- **docs/improvements/CODE-OPTIMIZATION-RECOMMENDATIONS.md** (novo)
- **docs/improvements/IMAGE-OPTIMIZATION.md** (novo)
- **openspec/changes/add-security-code-and-image-optimization-assessments/specs/project-docs/spec.md** (delta ADDED)

## Success criteria

- Os três documentos existem e descrevem estado atual, recomendações e priorização.
- `openspec validate add-security-code-and-image-optimization-assessments --strict` passa.
