# Proposal: Corrigir erro "Unexpected end of JSON input" ao salvar ordem no Índice da História

## Summary

Ao editar a ordem cronológica no **Índice da História** e clicar em **"Salvar ordem"**, o frontend apresenta o erro **"Failed to execute 'json' on 'Response': Unexpected end of JSON input"**. A causa é que o endpoint PUT /bff/posts/story-order (e a API) devolvem **204 No Content** (resposta sem corpo) em caso de sucesso, enquanto o cliente usa `fetchWithAuth`, que **sempre** chama `res.json()` na resposta. Parsing de corpo vazio lança o erro. A correção consiste em **não tentar parsear JSON** quando a resposta tiver status 204 ou corpo vazio.

## Goals

- **Eliminar o erro**: O fluxo "Salvar ordem" no Índice da História deve concluir com sucesso (toast de confirmação, ordem persistida) sem exceção no cliente.
- **Contrato cliente–servidor**: O cliente deve tratar respostas **204 No Content** (e respostas sem corpo) sem chamar `res.json()`, para suportar endpoints que devolvem apenas status de sucesso sem body.

## Scope

- **In scope**: (1) **Frontend** (`frontend/src/api/client.ts`): Ajustar `fetchWithAuth` (e, se aplicável, `fetchJson`) para que, quando a resposta tiver status **204** ou corpo vazio (ex.: `content-length: 0`), não se chame `res.json()`; retornar `undefined` (ou valor adequado) nesses casos. (2) **Spec** (opcional): Documentar que o cliente trata 204 sem parsear JSON, ou que PUT story-order retorna 204 e o cliente lida corretamente.
- **Out of scope**: Alterar o contrato da API/BFF (continuam a devolver 204); alterar outros fluxos além do cliente de API.

## Affected code and docs

- **frontend/src/api/client.ts**: Função `fetchWithAuth` — após verificar `res.ok`, se `res.status === 204` ou corpo vazio, retornar sem `res.json()`.
- **openspec/changes/fix-story-order-save-204-no-content/**: Proposal, tasks e eventual delta de spec (ex.: story-index ou bff-api-security).

## Dependencies and risks

- Nenhuma dependência. Risco baixo: apenas tratamento de resposta vazia; outros endpoints que devolvem JSON continuam a funcionar.

## Success criteria

- Ao clicar em "Salvar ordem" no Índice da História (com utilizador autenticado), a ordem é guardada e o utilizador vê a mensagem de sucesso, sem erro "Unexpected end of JSON input".
- `openspec validate fix-story-order-save-204-no-content --strict` passa (se houver spec delta).
