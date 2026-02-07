# posts-list — delta for add-posts-page-pagination-and-search

## Purpose

Define o comportamento da página **Artigos** (`/posts`): lista pública de posts publicados com paginação e filtro de pesquisa dinâmico.

## ADDED Requirements

### Requirement: Página Artigos paginada com 6 itens por página

A página **Artigos** (`/posts`) **deve** (SHALL) exibir a lista de posts publicados com **paginação** de **6 itens por página**. Quando o número total de resultados for maior que 6, o sistema **deve** mostrar controles de navegação (ex.: botões "Anterior" e "Próxima", e/ou números de página) e **deve** exibir apenas os 6 itens da página atual. A API **deve** suportar parâmetros `page` e `pageSize` para a lista pública; quando solicitada com paginação, a resposta **deve** ser um objeto com `items` (array de posts da página) e `total` (número total de resultados), de forma a permitir calcular o número de páginas e desabilitar navegação quando aplicável.

#### Scenario: Lista com mais de 6 posts mostra paginação

- **Dado** que existem pelo menos 7 posts publicados
- **Quando** o utilizador acede à página Artigos
- **Então** são exibidos no máximo **6 posts** na primeira página
- **E** existem controles de navegação para aceder às páginas seguintes (ex.: "Próxima", ou números de página)
- **E** ao navegar para a página 2, são exibidos os posts correspondentes (itens 7–12, ou os restantes se forem menos)

#### Scenario: Lista com 6 ou menos posts não exige segunda página

- **Dado** que existem 6 ou menos posts publicados
- **Quando** o utilizador acede à página Artigos
- **Então** todos os posts são exibidos numa única "página"
- **E** os controles de paginação podem estar desativados ou indicar "Página 1 de 1"

### Requirement: Filtro de pesquisa dinâmico por título, autor e data

A página **Artigos** **deve** (SHALL) disponibilizar um **filtro de pesquisa dinâmico**: uma caixa de texto (ou equivalente) em que o leitor pode digitar para filtrar a lista em tempo real. O filtro **deve** considerar:
- **Título** do post (correspondência por substring, case-insensitive);
- **Nome do autor** (correspondência por substring, case-insensitive);
- **Data** (publicação ou criação) — a pesquisa por data **deve** aplicar-se sobre a representação em string da data (ex.: ano "2025", mês "fev", ou dia), de forma que o leitor possa encontrar posts por período.

A lista exibida **deve** atualizar-se conforme o texto da pesquisa (com debounce para evitar excesso de pedidos). A paginação **deve** aplicar-se sobre o **resultado filtrado** (6 itens por página do resultado da pesquisa). Quando o utilizador altera o texto da pesquisa, a navegação **deve** recomeçar na primeira página (ex.: página 1).

#### Scenario: Pesquisa por título

- **Dado** que existem posts publicados com títulos diversos
- **Quando** o leitor digita no campo de pesquisa uma parte do título de um post (ex.: "RPG")
- **Então** a lista é filtrada para mostrar apenas posts cujo título contém esse texto (ex.: "Aventuras de RPG")
- **E** a paginação aplica-se sobre essa lista filtrada (6 por página)

#### Scenario: Pesquisa por autor

- **Quando** o leitor digita no campo de pesquisa o nome (ou parte do nome) do autor
- **Então** a lista é filtrada para mostrar apenas posts desse autor
- **E** a correspondência é por substring no nome do autor (case-insensitive)

#### Scenario: Pesquisa por data

- **Quando** o leitor digita no campo de pesquisa um termo relacionado à data (ex.: "2025", "fev", "06")
- **Então** a lista é filtrada para mostrar apenas posts cuja data de publicação (ou criação) formatada contém esse termo
- **E** a paginação aplica-se sobre o resultado

#### Scenario: Pesquisa vazia mostra toda a lista

- **Quando** o leitor limpa o campo de pesquisa (ou não introduz qualquer texto)
- **Então** a lista exibe todos os posts publicados (respeitando a paginação de 6 por página)
