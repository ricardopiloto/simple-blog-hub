# Ordenação configurável e filtro por linha da história na secção Publicações (área do autor)

## Why

Na secção "Publicações" da página `/area-autor`, a lista de posts hoje segue a ordem devolvida pela API e só pode ser refinada pelo filtro de texto (autor, título, data). Permitir **ordenação configurável** (por data ou por ordem da história, ascendente/descendente) e um **filtro por linha da história** (Velho Mundo, Idade das Trevas ou ambos) melhora a organização e a descoberta dos artigos pelo autor, alinhando a UX com as linhas narrativas já existentes no domínio (`story_type`, `story_order`).

## What Changes

1. **Ordenação da lista**
   - A lista na secção Publicações SHALL ser ordenada por **defeito em ordem decrescente por data** (do mais novo para o mais antigo). Critério de data: usar `created_at` ou `updated_at` conforme decisão de implementação (recomenda-se `created_at` para "mais novo" = último criado).
   - O utilizador SHALL poder **escolher como ordenar**:
     - **Por data**: ascendente (mais antigo primeiro) ou descendente (mais novo primeiro).
     - **Por ordem da história (Story Order)**: ascendente (menor `story_order` primeiro) ou descendente (maior `story_order` primeiro).
   - O controlo de ordenação SHALL estar no **lado oposto** à caixa de texto do filtro: por exemplo, filtro à esquerda e selector de ordenação à direita (numa mesma linha ou barra de ferramentas acima da lista).

2. **Filtro por linha da história**
   - Ao lado do filtro de texto (campo de pesquisa), SHALL existir um **toggle ou selector** que permite ao utilizador escolher:
     - **Todos** — mostrar todos os posts (sem filtrar por `story_type`).
     - **Velho Mundo** — mostrar apenas posts com `story_type === 'velho_mundo'`.
     - **Idade das Trevas** — mostrar apenas posts com `story_type === 'idade_das_trevas'`.
   - "Ambos" equivale a **Todos** (mostrar todos). O filtro por `story_type` aplica-se em conjunto com o filtro de texto e com o filtro por estado (dos cards clicáveis, se implementado); ordem de aplicação: estado → story_type → texto → ordenação.

3. **Layout**
   - Na zona acima da lista (secção Publicações): **caixa de texto do filtro** e **toggle/selector de linha da história** de um lado (ex.: esquerda); **selector de ordenação** do outro lado (ex.: direita). Em mobile pode empilhar ou colapsar; em desktop manter "filtro + story type" de um lado e "ordenar por" do outro.
   - A ordenação aplica-se à lista **já filtrada** (por estado, story_type e texto).

4. **Backend**
   - Sem alterações. A lista continua a ser obtida pelo endpoint existente (ex.: GET /bff/posts/author-area); filtragem por `story_type` e ordenação são feitas no **cliente** sobre os dados já carregados. O tipo `Post` já inclui `story_type` e `story_order`.

## Goals

- Ordenação por defeito: decrescente por data (mais novo primeiro).
- Utilizador pode selecionar: ordenar por data (asc/desc) ou por ordem da história (asc/desc).
- Controlo de ordenação no lado oposto ao campo de filtro de texto.
- Toggle/selector de linha da história ao lado do filtro de texto: Todos | Velho Mundo | Idade das Trevas.
- Tudo aplicado no cliente; sem novos endpoints.

## Non-Goals

- Não alterar a API nem o BFF para suportar ordenação ou filtro por story_type no servidor (pode ser evolução futura).
- Não alterar o Índice da História (/indice); apenas a secção Publicações em /area-autor.

## Success Criteria

- Em /area-autor, a lista de Publicações aparece por defeito ordenada do mais novo ao mais antigo (por data).
- O utilizador pode mudar para ordenação por data ascendente ou por story_order ascendente/descendente e a lista atualiza imediatamente.
- O utilizador pode restringir a lista a "Velho Mundo" ou "Idade das Trevas" e ver apenas os posts desse `story_type`.
- O selector de ordenação está do lado oposto ao filtro de texto; o toggle de linha da história está ao lado do filtro de texto.
