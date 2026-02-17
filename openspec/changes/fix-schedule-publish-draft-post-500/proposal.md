# Proposal: Corrigir erro 500 ao agendar publicação de post em rascunho

## Summary

Ao deixar um post em **rascunho** e depois ativar **Agendar publicação** (toggle + data/hora) e guardar, o pedido **PUT /bff/posts/{id}** falha com **500 Internal Server Error**. A causa raiz é a **API**: em `ParseScheduledPublishAt` (PostsController.cs) era usada a combinação inválida `DateTimeStyles.RoundtripKind | DateTimeStyles.AdjustToUniversal`, que o .NET não permite — lança `ArgumentException: The DateTimeStyles value RoundtripKind cannot be used with the values AssumeLocal, AssumeUniversal or AdjustToUniversal`. Este change corrige o parse usando apenas `AdjustToUniversal`, de modo a aceitar ISO 8601 com offset e converter para UTC sem exceção.

## Why

- **Problema:** O autor não consegue agendar a publicação de um post que está em rascunho; a ação de guardar com "Agendar publicação" ativado resulta em erro 500 e o post não é atualizado.
- **Causa:** Na API, `ParseScheduledPublishAt` chamada em UpdatePost (linha 257) usa `RoundtripKind | AdjustToUniversal` em `DateTime.TryParse`, o que é inválido e lança exceção.
- **Objetivo:** O fluxo "post em rascunho → marcar Agendar publicação → preencher data/hora → Guardar" deve persistir o post como rascunho com `scheduled_publish_at` definido, sem erro do servidor.

## What Changes

- **Correção (API):** Em `backend/api/Controllers/PostsController.cs`, em `ParseScheduledPublishAt`, usar apenas `DateTimeStyles.AdjustToUniversal` (sem `RoundtripKind`), mantendo a conversão para UTC e o tratamento de `DateTimeKind.Unspecified` já existentes.
- **Spec:** Adicionar requisito (ou cenário) em post-edit-form: ao editar um post em rascunho e ativar agendamento e guardar, o sistema **DEVE** atualizar o post com sucesso (sem 500).

## Goals

- **Comportamento esperado:** Quando o autor edita um post que está em rascunho, ativa "Agendar publicação", preenche data/hora futura e guarda, o sistema **DEVE** responder com 200 e o post **DEVE** ficar com `scheduled_publish_at` definido e `published === false`.
- **Sem 500:** O endpoint PUT /bff/posts/{id} (e o PUT da API por baixo) **NÃO** deve devolver 500 neste fluxo; eventuais erros de validação devem ser 400/409 conforme o spec.

## Scope

- **In scope:** (1) Corrigir `ParseScheduledPublishAt` na API (usar apenas `DateTimeStyles.AdjustToUniversal`). (2) Delta de spec já existente com cenário "editar rascunho e agendar publicação → guardar com sucesso".
- **Out of scope:** Alterar o esquema da base de dados; alterar o formato do payload de agendamento (já em uso noutros fluxos); implementar retry ou lógica extra no frontend para este caso específico.

## Affected code and docs

- **backend/api/Controllers/PostsController.cs** — método `ParseScheduledPublishAt`: remover `RoundtripKind` e usar apenas `AdjustToUniversal` para parse de ISO 8601 com offset.
- **openspec/changes/fix-schedule-publish-draft-post-500/specs/post-edit-form/spec.md** — delta ADDED com requisito/cenário: editar post rascunho, ativar agendamento, guardar → sucesso (sem 500).

## Dependencies and risks

- **Nenhum** conhecido. Fix localizado em um único método da API. Com `AdjustToUniversal`, strings ISO 8601 com offset (ex.: `2025-02-14T10:00:00-03:00`) continuam a ser convertidas para UTC corretamente.

## Success criteria

- O autor pode editar um post em rascunho, ativar "Agendar publicação", preencher data/hora e guardar; a resposta é 200 e o post fica com `scheduled_publish_at` definido e `published === false`.
- Não ocorre 500 no PUT /bff/posts/{id} neste fluxo.
- `openspec validate fix-schedule-publish-draft-post-500 --strict` passa.
