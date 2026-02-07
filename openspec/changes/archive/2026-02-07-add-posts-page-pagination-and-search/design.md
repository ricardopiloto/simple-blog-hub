# Design: Paginação e pesquisa na página Artigos

## Contexto

A página **Artigos** (`/posts`) mostra hoje todos os posts publicados numa única lista (ordenados por data de criação). Não há paginação nem filtro. O utilizador pediu 6 posts por página e filtro dinâmico por título, autor e data.

## Decisão: resposta paginada opcional

- **Sem paginação** (comportamento atual): GET /api/posts?published=true&order=date continua a devolver um **array** de PostDto. A página inicial e outros consumidores não são alterados.
- **Com paginação**: Quando o cliente envia `page` e `pageSize` (ex.: page=1, pageSize=6), a API devolve um objeto **{ items: PostDto[], total: number }**. O BFF repassa os parâmetros e devolve a mesma estrutura. O frontend da página Artigos usa apenas este modo.

Assim evitamos quebrar quem já consome o array.

## Decisão: filtro "search" único

Um único parâmetro **search** (ou **q**): string opcional. A API filtra os posts publicados onde:
- **Título** contém o texto (case-insensitive), ou
- **Nome do autor** (Author.Name) contém o texto (case-insensitive), ou
- **Data** formatada contém o texto — por exemplo, formatar `PublishedAt ?? CreatedAt` como string (ISO ou cultura, ex.: "2025-02-06" ou "6 fev 2025") e verificar se contém a query. Assim o leitor pode pesquisar "2025", "fev", "06", etc.

A filtragem aplica-se **antes** da ordenação e da paginação: primeiro filtra, depois ordena, depois Skip/Take.

## Decisão: 6 itens por página

Fixar **pageSize = 6** na página Artigos (como no Índice da História). O parâmetro `pageSize` pode ser configurável na API (ex.: max 50) para outros usos futuros; a UI usa 6.

## Fluxo no frontend

1. Estado: `page` (1-based), `search` (string), e opcionalmente `total` para desabilitar "próxima" ou mostrar "Página X de Y".
2. Input de pesquisa: valor controlado por `search`; **debounce** (ex.: 300–400 ms) antes de chamar a API, e resetar para página 1 quando o texto muda.
3. Chamada: GET com `order=date`, `page`, `pageSize=6`, `search` (se não vazio). Resposta: `{ items, total }`.
4. Render: mostrar `items` na grelha; mostrar controles: "Anterior", "Próxima" e/ou números de página; exibir "Página X de Y" quando total > 0.

## Parâmetros da API (resumo)

| Parâmetro  | Obrigatório | Descrição |
|------------|-------------|-----------|
| published  | não         | true (default) para lista pública |
| order      | não         | date (default) ou story |
| page       | não         | Se presente, resposta é { items, total }; 1-based |
| pageSize   | não         | Quando page presente, número de itens por página (ex.: 6) |
| search     | não         | Filtra por título, autor ou data (substring na string formatada) |

Quando `page` está presente, `pageSize` é obrigatório (ou default 6) e a resposta é sempre `{ items, total }`.
