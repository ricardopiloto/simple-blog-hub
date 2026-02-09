# Tasks: add-story-index-universe-toggle

## 1. Frontend – estado e derivação de tipos

- [x] 1.1 Em `frontend/src/pages/StoryIndex.tsx`, adicionar estado `selectedUniverse: 'velho_mundo' | 'idade_das_trevas'` com valor inicial `'velho_mundo'`.
- [x] 1.2 A partir da lista `posts` (do hook `usePostsByStoryOrder`), derivar `hasVelhoMundo` e `hasIdadeDasTrevas` (ex.: `posts.some(p => p.story_type === 'velho_mundo')` e idem para `idade_das_trevas`). Definir `showUniverseToggle = hasVelhoMundo && hasIdadeDasTrevas`.

## 2. Frontend – filtragem por universo

- [x] 2.1 Antes de aplicar o filtro por texto (número/título), filtrar a lista por `story_type`: quando `showUniverseToggle` é verdadeiro, manter apenas posts com `story_type === selectedUniverse`; quando falso, manter apenas posts do tipo que existir (um único tipo) ou toda a lista se ambos existirem mas se decidir não filtrar nesse caso. Garantir que a ordenação por `story_order` e a paginação (6 por página) aplicam-se sobre a lista já filtrada por universo (e depois por texto).

## 3. Frontend – UI do toggle

- [x] 3.1 Ao lado do campo de filtro (Input "Filtrar por número da ordem ou título..."), adicionar um toggle de duas opções: "Velho Mundo" e "Idade das Trevas" (ex.: `ToggleGroup` com dois `ToggleGroupItem` ou componente equivalente). O toggle só é renderizado quando `showUniverseToggle` é verdadeiro. Valor controlado por `selectedUniverse`; ao alterar, atualizar estado e resetar página para 1.
- [x] 3.2 Garantir que o valor por defeito é "Velho Mundo" (estado inicial e quando há apenas esse tipo, a lista mostra só "Velho Mundo"; quando há apenas "Idade das Trevas", a lista mostra só esse tipo sem necessidade de toggle).

## 4. Frontend – modo "Editar ordem"

- [x] 4.1 Definir comportamento no modo "Editar ordem": o toggle de universo pode ser ocultado ou desativado enquanto o utilizador está a editar a ordem, e a lista em edição continua a ser a lista completa do índice (todos os tipos), para que a reordenação e "Salvar ordem" não dependam do universo selecionado. Documentar na spec ou implementar: ao entrar em "Editar ordem", ignorar ou esconder o toggle e trabalhar sobre a lista completa.

## 5. Spec delta

- [x] 5.1 Em `openspec/changes/add-story-index-universe-toggle/specs/story-index/spec.md`, ADDED requirement: na página Índice da História, ao lado do filtro por número/título, o sistema deve exibir um toggle que permite ao leitor escolher o universo "Velho Mundo" ou "Idade das Trevas"; por defeito "Velho Mundo" está selecionado; o toggle só é exibido quando existem posts de ambos os tipos no índice; quando existe apenas um tipo, a lista mostra apenas os posts desse tipo sem exibir o toggle (ou exibindo-o de forma adequada). Incluir cenários: ambos os tipos → toggle visível e funcional; apenas um tipo → lista filtrada, toggle não exibido ou único; paginação e filtro por texto aplicam-se à lista filtrada por universo.

## 6. Validação

- [x] 6.1 Executar `openspec validate add-story-index-universe-toggle --strict` e corrigir falhas.
