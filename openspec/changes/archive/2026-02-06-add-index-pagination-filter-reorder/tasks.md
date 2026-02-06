# Tasks: Índice com paginação, filtro e reordenação

## 1. Backend – persistência da ordem (se necessário)

- [x] 1.1 Garantir que a API (e BFF) permitam atualizar `story_order` de um post via `PUT /api/posts/{id}` (body com `story_order`). Se já existir, apenas documentar. Caso se opte por endpoint em lote, implementar `PUT /api/posts/story-order` (e BFF) aceitando array de `{ id, story_order }`.

## 2. Frontend – dados e persistência da ordem

- [x] 2.1 Garantir que a página do índice carregue a lista de posts ordenados por `story_order` (ex.: `fetchPosts('story')` ou hook existente). Implementar persistência ao "Salvar ordem": para cada post cujo `story_order` mudou, chamar `updatePost(id, { ...post, story_order })` (ou endpoint em lote), apenas quando o usuário estiver autenticado.

## 3. Frontend – paginação e filtro

- [x] 3.1 Adicionar **paginação**: 6 itens por página sobre a lista (após filtro). Controles de navegação (ex.: anterior, próxima, e/ou números de página). Respeitar a ordem (story_order) da lista filtrada.
- [x] 3.2 Adicionar **filtro**: campo de texto que filtra em **tempo real** (onChange). Critérios: (a) número na ordem (ex.: coincide ou contém o dígito/dígitos digitados); (b) título do post (substring, case-insensitive). Aplicar filtro na lista em memória; a paginação aplica-se sobre a lista filtrada (6 por página).

## 4. Frontend – layout dos cards

- [x] 4.1 Reduzir o tamanho do card do índice: **remover o resumo** (excerpt); exibir apenas **título** e **imagem** (capa), além do número da ordem. Ajustar layout (ex.: grid ou lista compacta) para exibir 6 itens por página de forma legível.

## 5. Frontend – reordenação apenas para autenticados

- [x] 5.1 Quando o usuário **não** estiver autenticado: exibir a lista do índice (ordenada, paginada, filtrada) em modo **somente leitura** — sem campo editável de número, sem arrastar, sem botões "Salvar ordem" / "Cancelar".
- [x] 5.2 Quando o usuário **estiver** autenticado: exibir controles de edição da ordem — permitir alterar manualmente o **número da ordem** de um item (ex.: input numérico no card). Ao alterar (ex.: item da posição 21 para 2), o sistema deve **reordenar os demais** itens na lista (algoritmo: remover item, inserir na nova posição, reatribuir story_order 1..N). Botões "Salvar ordem" (persiste no backend) e "Cancelar" (restaura ordem anterior).
- [x] 5.3 Garantir que a reordenação manual e a persistência usem a mesma lista ordenada por `story_order` e que, após salvar, a lista seja atualizada (ex.: invalidate query ou refresh).

## 6. Documentação e validação

- [x] 6.1 Atualizar README e/ou openspec/project.md descrevendo a página Índice: paginação (6 itens), filtro em tempo real (por ordem ou título), cards com título e imagem; apenas usuários autenticados podem editar a ordem (manual e persistência).
- [x] 6.2 Build do frontend (e backend se alterado). Validar manualmente: filtro, paginação, cards sem resumo; como visitante, não ver controles de edição; como autenticado, alterar ordem, salvar e ver persistência.
