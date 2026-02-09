# Índice da História: seleção de universo (Velho Mundo / Idade das Trevas)

## Summary

Ajustar a tela **Índice da História** (`/indice`) para permitir ao leitor escolher qual **universo** deseja ler: **"Velho Mundo"** ou **"Idade das Trevas"**. A opção é apresentada como um **toggle** ao lado do filtro (um lado para cada universo). Por defeito, fica selecionado **"Velho Mundo"**. A aplicação **valida** se existem posts de ambos os tipos na lista do índice: se existirem os dois, mostra o toggle para o leitor escolher; se existir apenas um tipo, mostra somente os posts desse tipo (sem exibir o toggle ou exibindo-o de forma inerte/única opção).

## Goals

1. **Toggle ao lado do filtro**: Na página Índice da História, ao lado do campo de filtro (por número ou título), adicionar um controlo em forma de **toggle** em que um lado corresponde a "Velho Mundo" e o outro a "Idade das Trevas". O leitor escolhe um dos lados para filtrar a lista exibida por `story_type`.
2. **Valor por defeito**: A seleção inicial deve ser **"Velho Mundo"** (primeira página e lista mostram apenas posts com `story_type === 'velho_mundo'` até que o leitor mude).
3. **Comportamento condicional**: A aplicação deve verificar se há posts de **ambos** os tipos na lista do índice (posts que fazem parte da ordem da história e publicados).  
   - **Se houver os dois tipos**: o toggle é exibido e o leitor pode alternar entre "Velho Mundo" e "Idade das Trevas"; a lista (e paginação/filtro) aplicam-se aos posts do tipo selecionado.  
   - **Se houver apenas um tipo**: a aplicação mostra somente os posts desse único tipo; o toggle pode não ser exibido ou ser exibido com uma única opção ativa (conforme decisão de implementação), de forma a não confundir o leitor.
4. **Consistência com dados existentes**: A lista do índice já é obtida com `order=story` e cada post tem `story_type`; a filtragem por universo é feita no frontend (ou via parâmetro de query se se optar por suporte no BFF/API) sobre essa lista. Nenhuma alteração obrigatória na API/BFF se a lista já trouxer `story_type` em cada item.

## Out of scope

- Alterar a ordem narrativa (`story_order`) ou a lógica de "Editar ordem" por universo (a reordenação continua global; filtro por universo é apenas para leitura).
- Adicionar novos valores de universo além de "Velho Mundo" e "Idade das Trevas".
- Alterar a posição ou o comportamento do filtro por número/título (apenas adicionar o toggle ao lado).

## Success criteria

- Na página Índice da História, ao lado do filtro, existe um toggle com "Velho Mundo" e "Idade das Trevas"; por defeito "Velho Mundo" está selecionado.
- Quando há posts de ambos os tipos no índice, o toggle é visível e funcional; ao alternar, a lista (e paginação/filtro) atualizam para o universo selecionado.
- Quando há posts de apenas um tipo, a lista mostra apenas esse tipo; o toggle não é exibido ou é exibido de forma a refletir que só existe um universo (sem opção inútil).
- A paginação e o filtro por número/título continuam a aplicar-se sobre a lista já filtrada por universo.
- `openspec validate add-story-index-universe-toggle --strict` passa.
