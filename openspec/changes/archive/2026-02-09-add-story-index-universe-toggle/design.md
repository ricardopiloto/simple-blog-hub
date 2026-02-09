# Design: Toggle de universo no Índice da História

## Fonte dos dados

- A página Índice da História usa `usePostsByStoryOrder()`, que obtém a lista de posts com `order=story` (publicados, `include_in_story_order` verdadeiro, ordenados por `story_order`). Cada post no payload já inclui o campo `story_type` (`velho_mundo` ou `idade_das_trevas`).
- Não é obrigatório alterar a API ou o BFF: a filtragem por universo pode ser feita **no frontend** sobre a lista já carregada. Opcionalmente, no futuro, pode-se acrescentar um parâmetro de query (ex.: `storyType`) para reduzir payload quando só um universo for necessário.

## Lógica de exibição do toggle

1. **Derivar tipos presentes**: A partir da lista de posts do índice, calcular:
   - `hasVelhoMundo = posts.some(p => p.story_type === 'velho_mundo')`
   - `hasIdadeDasTrevas = posts.some(p => p.story_type === 'idade_das_trevas')`
2. **Quando mostrar o toggle**: Apenas quando **ambos** são verdadeiros (`hasVelhoMundo && hasIdadeDasTrevas`). Caso contrário, não exibir o toggle (ou exibir uma única opção não clicável, conforme preferência de UI).
3. **Quando só um tipo existe**: A lista exibida é filtrada por esse único tipo (ou toda a lista, se já for o único tipo). O utilizador vê apenas os capítulos desse universo sem necessidade de escolher.

## Estado e filtragem

- **Estado**: `selectedUniverse: 'velho_mundo' | 'idade_das_trevas'` com valor inicial `'velho_mundo'`.
- **Ordem de aplicação**: (1) Lista base = posts do índice (order=story). (2) Filtrar por `story_type === selectedUniverse`. (3) Sobre o resultado, aplicar o filtro em tempo real por número/título (existente). (4) Ordenar por `story_order` e paginar (6 por página).
- Quando o toggle não é exibido (apenas um tipo), usar a lista já filtrada por esse único tipo; o estado `selectedUniverse` pode ser definido implicitamente para esse tipo ou ignorado.

## UI do toggle

- **Controlo**: Toggle de duas opções (um lado = "Velho Mundo", outro = "Idade das Trevas"), por exemplo usando `ToggleGroup` (Radix) com `type="single"` e dois `ToggleGroupItem`, ou componente equivalente que apresente claramente as duas escolhas lado a lado.
- **Posição**: Ao lado do campo de filtro (por número ou título), na mesma linha ou imediatamente abaixo/ao lado, conforme layout da página.
- **Acessibilidade**: Labels claros ("Velho Mundo" / "Idade das Trevas"); o estado selecionado deve ser visível e indicado ao leitor (e a leitores de ecrã).

## Edição de ordem (autenticados)

- O modo "Editar ordem" e a persistência de `story_order` continuam a operar sobre a **lista completa** do índice (todos os posts que fazem parte da ordem), não sobre a lista filtrada por universo. Ou seja: ao editar ordem, o utilizador vê e reordena todos os posts do índice; o toggle de universo pode ser ocultado ou desativado durante a edição, conforme decisão de implementação (ex.: esconder toggle em modo edição para evitar confusão).
