# Tasks: Índice – reordenação por arrastar (drag-and-drop)

## 1. Dependências

- [x] 1.1 Adicionar biblioteca de drag-and-drop (ex.: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) ao projeto. Garantir compatibilidade com React 18 e com a estrutura atual dos cards (grid, Framer Motion opcional nos itens).

## 2. Frontend – integração drag-and-drop no Índice

- [x] 2.1 Em `StoryIndex.tsx`, quando `editingOrder` estiver ativo (`isAuthenticated && editingOrder`), envolver a lista de cards (a lista **trabalhada** — `workingList` — ou a fatia paginada que está em edição) num contexto de sortable (DndContext + SortableContext). Definir sensores (pointer e/ou teclado) e handler `onDragEnd`: ao soltar, calcular a nova ordem (reordenar array, reatribuir `story_order` 1..N) e atualizar `editingOrder` com `setEditingOrder`, de forma consistente com `handlePositionChange` / `applyManualReorder`.
- [x] 2.2 Tornar cada card em modo de edição um **SortableItem** (ou equivalente): o card deve ser arrastável (drag handle pode ser o próprio card ou um ícone/handle visível). Ao arrastar, o feedback visual (ex.: overlay ou opacidade) deve indicar que o item está a ser movido; ao soltar, a lista deve refletir a nova posição e os números da ordem devem atualizar (incluindo no input numérico).
- [x] 2.3 Manter o **input numérico** por card em modo de edição; alterar o número deve continuar a reordenar a lista (comportamento atual). Garantir que reordenação por drag e por input partilham o mesmo estado (`editingOrder`) e que "Salvar ordem" persiste e "Cancelar" descarta, independentemente do método usado.
- [x] 2.4 Considerar paginação: em modo de edição, a reordenação por arrastar pode aplicar-se à **lista completa** (workingList) numa única vista ordenável, ou à **página atual** (paginated). Documentar a escolha: se for apenas na página atual, ao mudar de página a ordem já editada nas outras páginas mantém-se em `editingOrder`. Preferência mínima: permitir arrastar dentro da página visível e atualizar `editingOrder` com a nova ordem global (reatribuir índices 1..N na workingList).

## 3. Documentação e validação

- [x] 3.1 Atualizar `openspec/project.md` e/ou README (se aplicável) mencionando que na página Índice o utilizador autenticado pode editar a ordem por **número** ou por **arrastar** os cards.
- [x] 3.2 Build do frontend. Validar manualmente: como utilizador autenticado, clicar "Editar ordem", reordenar um card arrastando-o; confirmar que o número da ordem e a posição visual atualizam; clicar "Salvar ordem" e confirmar persistência; repetir com "Cancelar". Confirmar que editar pelo input numérico continua a funcionar e que ambas as formas refletem no mesmo estado.
