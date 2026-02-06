# Design: Paginação, filtro e reordenação no Índice

## Contexto

A página `/indice` (StoryIndex) hoje exibe a lista de posts ordenados por `story_order`, com cards que incluem número, thumbnail, título, resumo e link. Há arraste (Reorder) e botões "Salvar Ordem" / "Cancelar", mas a persistência da ordem no backend não está implementada no fluxo atual (apenas estado local). É necessário introduzir paginação (6 por página), filtro em tempo real, cards compactos (título + imagem) e garantir que apenas autenticados editem a ordem, com persistência.

## Decisões

### Paginação e filtro (client-side)

- Os posts do índice são carregados uma vez (ex.: `fetchPosts('story')`). A **filtragem** é feita no cliente sobre essa lista: por substring no título ou por número da ordem (ex.: "2" pode coincidir com posição 2 ou 12, 21, etc., conforme definição de UX).
- A **paginação** aplica-se sobre a lista **já filtrada**, com 6 itens por página. Não é necessário novo endpoint de paginação no servidor para o índice, pois a lista pública por `story_order` é tipicamente pequena.

### Reordenação manual

- O usuário autenticado pode **alterar o número** exibido no card (ex.: de 21 para 2). A interpretação é: "este item deve passar a ter posição 2 na história".
- **Algoritmo de reordenação**: Dada a lista atual L (ordenada por `story_order`) e uma alteração "item A passa a ter posição N":
  - Remover A da lista.
  - Inserir A na nova posição N (1-based). Os itens que estavam em posições N, N+1, … deslocam-se uma posição para baixo.
  - Reatribuir `story_order` 1, 2, 3, … conforme a nova ordem.
- A reordenação pode ser feita em memória até o usuário clicar "Salvar ordem"; então o frontend envia as novas ordens ao backend.

### Persistência da ordem

- **Opção A**: Para cada post cujo `story_order` mudou, chamar `PUT /bff/posts/{id}` com payload contendo `story_order`. N requisições para N posts alterados. A API já suporta atualização de post (incluindo `story_order`) com autenticação.
- **Opção B**: Novo endpoint `PUT /api/posts/story-order` (e BFF) recebendo um array `[{ id, story_order }, ...]` e atualizando todos em uma transação. Reduz round-trips e garante consistência em lote.
- Recomendação inicial: **Opção A** (múltiplos PUT) para manter o change enxuto; Opção B pode ser um refinamento posterior se a quantidade de posts tornar N PUTs incômodo.

### Gate de autenticação

- Na página do índice, usar `useAuth().isAuthenticated`. Se **não** autenticado: exibir apenas a lista (cards título + imagem), paginação e filtro; sem campo editável de número, sem drag handle, sem "Salvar ordem".
- Se autenticado: exibir os mesmos cards mas com controle de número editável (e/ou drag, conforme UX) e botões "Salvar ordem" / "Cancelar"; ao salvar, chamar a API para persistir as novas ordens.

### Cards compactos

- Remover `excerpt` do card. Manter: número da ordem (ou campo editável quando autenticado), imagem de capa (thumbnail), título. Link para o post (ex.: "Ler" ou clique). Reduzir padding/tamanho do card para caber 6 por página de forma confortável (ex.: grid 2x3 ou lista mais compacta).
