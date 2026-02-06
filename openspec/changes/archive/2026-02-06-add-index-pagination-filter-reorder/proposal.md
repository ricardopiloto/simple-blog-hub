# Change: Índice da História com paginação, filtro e reordenação por autenticados

## Why

Melhorar a página **Índice da História** (`/indice`): exibir os itens em cards menores (apenas título e imagem, sem resumo), com **paginação** (6 itens por página) e **filtro em tempo real** (por número da ordem ou título). Permitir que **apenas usuários autenticados** editem a ordem (manual, alterando o número do card); o sistema deve reordenar os demais itens e persistir. Visitantes não autenticados apenas visualizam a lista, sem controles de edição.

## What Changes

- **Paginação**: Lista do índice paginada por **quantidade de registros**, com **6 itens por página**. Respeitar a ordem narrativa (`story_order`). Controles de navegação entre páginas (ex.: anterior/próxima, ou números de página).
- **Filtro**: Campo de texto onde o usuário digita para filtrar em **tempo real** (sem submeter formulário). A pesquisa deve considerar:
  - **Número na ordem** (ex.: digitar "2" ou "21" mostra itens cuja posição contém o valor ou coincide);
  - **Título do post** (ex.: substring no título).
  A filtragem é feita em tela, sobre a lista já carregada (client-side), de forma dinâmica enquanto o usuário digita. A paginação aplica-se sobre os itens **filtrados** (6 por página).
- **Cards menores**: Reduzir o tamanho do card de cada item no índice. **Remover o resumo** (excerpt); exibir apenas **título** e **imagem** (capa). Manter link para o post (ex.: "Ler" ou clique no card).
- **Reordenação (apenas autenticados)**:
  - **Usuários autenticados**: Podem **editar a ordem** do índice. O usuário pode alterar manualmente o **número da ordem** de um item (ex.: item que está na posição 21 pode ser alterado para 2). O sistema deve **reordenar os demais** itens de forma que a nova ordem seja consistente (ex.: ao mover o 21 para 2, os que estavam 2–20 passam a ser 3–21). Após confirmar (ex.: botão "Salvar ordem"), o sistema deve **persistir** a nova ordem no backend (ex.: atualizar `story_order` de cada post afetado via API).
  - **Usuários não autenticados**: Podem **apenas visualizar** a lista (ordenada, paginada e filtrada). Não veem controles de edição (sem campo editável de número, sem arrastar, sem "Salvar ordem").
- **Backend**: Garantir que a alteração de `story_order` seja persistida. Se já existir `PUT /api/posts/{id}` (e BFF) aceitando `story_order`, usar chamadas individuais para cada post cujo ordem mudou; ou expor um endpoint de reordenação em lote (ex.: `PUT /api/posts/story-order` com array de `{ id, story_order }`) para reduzir requisições. A API/BFF já exigem autenticação para escrita.

## Impact

- Affected specs: nova capability **story-index** (paginação, filtro, layout de cards, reordenação por autenticados) ou extensão de **post-permissions** / conteúdo público.
- Affected code: `src/pages/StoryIndex.tsx` (paginação, filtro, cards sem resumo, gate de autenticação para reordenar, lógica de reordenação manual e persistência); possivelmente `src/hooks/usePosts.ts` (persistência da ordem no backend); opcionalmente API/BFF com endpoint de reordenação em lote; README/project.md.
