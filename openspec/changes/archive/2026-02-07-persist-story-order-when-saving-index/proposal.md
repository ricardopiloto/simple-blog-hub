# Proposal: Persistir coluna StoryOrder ao salvar ordem no Índice da História

## Summary

Garantir e documentar que, **sempre que alguém editar a ordem cronológica da história** na tela do **Índice da História** e acionar **"Salvar ordem"**, o sistema **atualiza a coluna `StoryOrder`** no banco de dados para cada post, refletindo exatamente a ordem designada na tela. O comportamento já está implementado (frontend chama BFF/API, API atualiza `Posts.StoryOrder`); esta change torna-o um **requisito explícito** na spec e opcionalmente verifica/consolida a implementação.

## Goals

- **Requisito explícito**: Na spec do Índice da História, ficar explícito que, ao salvar a ordem (botão "Salvar ordem"), o sistema **deve** persistir a nova ordem atualizando a coluna `StoryOrder` na base de dados para cada post afetado.
- **Rastreabilidade**: Cenário de aceitação que permita verificar que, após "Salvar ordem", os valores de `StoryOrder` no banco refletem a ordem exibida na tela.

## Scope

- **In scope**: (1) **Spec story-index**: Adicionar requisito (ou esclarecer o existente) de que a ação "Salvar ordem" no Índice da História **deve** resultar na atualização da coluna `StoryOrder` na tabela `Posts` para cada post, de acordo com a ordem designada na interface. Incluir cenário que descreva a persistência (ex.: após salvar, os dados vindos da API refletem a nova ordem). (2) **Verificação**: Confirmar que o fluxo atual (frontend → PUT /bff/posts/story-order → API PUT /api/posts/story-order → `SaveChangesAsync` atualizando `post.StoryOrder`) está correto; se houver falha ou gap, corrigir.
- **Out of scope**: Alterar a UI do Índice, a lógica de drag-and-drop ou o formato do endpoint; apenas especificar e garantir a persistência.

## Affected code and docs

- **openspec/changes/persist-story-order-when-saving-index/specs/story-index/spec.md**: Delta com requisito ADDED (ou MODIFIED) que exige a persistência de `StoryOrder` no banco quando o utilizador autenticado salva a ordem no Índice da História.
- **Código**: Nenhuma alteração obrigatória se a implementação já cumprir o requisito; tarefas podem incluir revisão rápida do fluxo (client → BFF → API → DbContext).

## Dependencies and risks

- Nenhuma dependência nova. Risco muito baixo: trata-se de documentar e eventualmente validar um fluxo já existente.

## Success criteria

- A spec do story-index inclui um requisito claro de que "Salvar ordem" no Índice da História resulta na atualização da coluna `StoryOrder` no banco para refletir a ordem da tela.
- Existe pelo menos um cenário que descreve essa persistência.
- `openspec validate persist-story-order-when-saving-index --strict` passa.
