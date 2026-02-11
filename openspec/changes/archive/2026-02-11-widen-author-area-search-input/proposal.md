# Alargar o campo de pesquisa da secção Publicações (área do autor)

## Why

O input de pesquisa da secção "Publicações" em `/area-autor` (`#author-area-search`) pode ficar com largura reduzida em certos layouts (ex.: flex), fazendo com que o placeholder "Pesquisar por autor, título ou data" fique truncado ou pouco visível. Garantir uma largura mínima maior melhora a legibilidade e a descoberta da funcionalidade de filtro.

## What Changes

1. **Campo de pesquisa**
   - O input com `id="author-area-search"` (placeholder "Pesquisar por autor, título ou data") na secção Publicações da página `/area-autor` SHALL ter **largura mínima** suficiente para exibir o placeholder completo de forma visível (ex.: `min-w-[20rem]` ou equivalente, ~320px), sem truncar o texto em viewports típicos. A largura máxima pode manter-se (ex.: `max-w-md` ou superior) conforme o layout existente.

2. **Escopo**
   - Apenas o componente de página que renderiza este input (AreaAutorDashboard); sem alterações de backend ou de spec funcional além de requisito de usabilidade (campo com largura adequada ao placeholder).

## Goals

- O placeholder "Pesquisar por autor, título ou data" permanece visível para o utilizador (não truncado).
- O input fica um pouco maior quando necessário, sem quebrar o layout da barra de filtros (flex responsivo).

## Non-Goals

- Não alterar o comportamento do filtro nem o texto do placeholder.
- Não obrigar largura fixa em todos os viewports; apenas garantir mínimo que evite truncagem do placeholder.

## Success Criteria

- Em viewports onde a barra de filtros é exibida (desktop e tablet), o campo de pesquisa mostra o placeholder completo de forma legível.
- A validação `openspec validate widen-author-area-search-input --strict` passa.
