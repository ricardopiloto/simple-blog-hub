# Design: Filtro por data e auto-complete (Artigos e Área do autor)

## 1. Filtro por data

### 1.1 Comportamento

- **Por defeito**: Nenhum filtro de data aplicado; a lista mostra todos os itens (paginação na página de Artigos; lista completa na Área do autor).
- **Campo de data**: Ao lado do campo de pesquisa, um controlo (ex.: input read-only ou botão) que, ao ser clicado, abre um **calendário** (date picker).
- **Modos**: O calendário deve permitir:
  - **Uma data**: utilizador escolhe um único dia; filtrar itens cuja data de publicação seja nesse dia.
  - **Intervalo (range)**: utilizador escolhe data inicial e data final; filtrar itens cuja data de publicação esteja entre as duas (inclusive).
- **Data de referência**: Usar **data de publicação** (`published_at`). Se `published_at` for nula (rascunho), pode usar-se `created_at` para a Área do autor; na página de Artigos apenas posts publicados são listados, portanto `published_at` existe.

### 1.2 Página de Artigos (/posts)

- A listagem é **paginação no servidor** via `GET /bff/posts?page=1&pageSize=6&search=...`.
- Para evitar filtrar apenas a página atual no cliente, o **backend** deve suportar filtro por data:
  - **API**: Adicionar parâmetros opcionais `fromDate` e `toDate` (formato ISO 8601 date, ex.: `yyyy-MM-dd`) ao endpoint de listagem paginada. Filtrar posts onde a data de publicação (ex.: `PublishedAt`) está no intervalo `[fromDate, toDate]` (inclusive). Se só `fromDate` for enviado, considerar até ao fim dos dados; se só `toDate`, desde o início; se ambos, intervalo fechado.
  - **BFF**: Repassar `fromDate` e `toDate` do query string para a API.
  - **Frontend**: Enviar `fromDate` e `toDate` quando o utilizador tiver selecionado uma data ou range; resetar para página 1 quando o filtro de data mudar.

### 1.3 Área do autor (Publicações)

- A lista já está toda em memória (client-side). O filtro de data pode ser aplicado **no cliente**: após os filtros existentes (estado, story type, texto), filtrar por `published_at` (ou `created_at` se não publicado) dentro do intervalo escolhido. Não é necessário alterar a API para esta página.

### 1.4 UI do calendário

- Usar um componente de date picker que suporte **single date** e **date range** (ex.: biblioteca existente no projeto como shadcn/ui Calendar/Popover, ou React Day Picker). Colocação: ao lado do campo de pesquisa, de forma consistente em ambas as páginas.

---

## 2. Auto-complete no campo de pesquisa

### 2.1 Comportamento

- Enquanto o utilizador digita no campo de pesquisa, mostrar um **dropdown** (lista) de **sugestões** que coincidam com o texto atual (substring, case-insensitive).
- Sugestões podem ser: **nomes de autores** e **títulos de posts** que contenham o texto digitado.
- Ao selecionar uma sugestão, o texto do campo é preenchido com esse valor (ou o filtro é aplicado com esse valor), e a lista é atualizada conforme o filtro já existente.
- O utilizador pode ignorar as sugestões e continuar a digitar; o filtro continua a ser aplicado pelo texto (com debounce na página de Artigos).

### 2.2 Área do autor

- A lista completa de posts já está carregada. As sugestões podem ser **calculadas no cliente**:
  - Extrair autores únicos (nome) e títulos dos posts da lista (após outros filtros opcional, ou da lista completa).
  - Para o texto atual `q`, filtrar: autores cujo nome contenha `q` e títulos que contenham `q`; mostrar num dropdown (ex.: até N itens, sem duplicados).
  - Atualizar as sugestões sempre que `q` mudar (com debounce leve opcional para evitar flicker).

### 2.3 Página de Artigos

- Os dados disponíveis no cliente são apenas a **página atual** da API (ex.: 6 itens). Duas abordagens:
  - **Opção A — Endpoint de sugestões**: Novo endpoint, ex.: `GET /bff/posts/search-suggestions?q=Do` que devolve uma lista de sugestões (ex.: `{ authors: string[], titles: string[] }` ou lista flat) com autores e títulos que coincidam com `q`. A API precisaria de um endpoint que, sem paginação, devolva apenas nomes/títulos distintos que coincidam com o termo. **Prós**: sugestões ricas. **Contras**: novo endpoint e lógica na API.
  - **Opção B — Reutilizar a pesquisa paginada**: Ao digitar "Do", chamar a API com `search=Do&page=1&pageSize=6` (ou um pageSize maior só para sugestões, ex.: 20). Dos itens devolvidos, extrair autores e títulos e mostrar como sugestões. **Prós**: sem alterações na API. **Contras**: sugestões limitadas ao que aparece na primeira página de resultados.
- **Recomendação**: Implementar primeiro **Opção B** (sem novo endpoint); se for necessário melhorar as sugestões mais tarde, adicionar Opção A. O spec pode exigir "sugestões que coincidam com o texto" sem fixar a origem (lista carregada vs. endpoint).

---

## 3. Resumo de alterações técnicas

| Área              | Filtro data                    | Auto-complete                          |
|-------------------|--------------------------------|----------------------------------------|
| **Posts (/posts)**| API/BFF: fromDate, toDate      | Sugestões da 1.ª página de search (B)  |
| **Área do autor** | Client-side por published_at  | Sugestões da lista em memória          |

- **Componentes**: Considerar um componente reutilizável para o date range picker e, se útil, para o campo de pesquisa com auto-complete (dropdown de sugestões), para manter consistência entre as duas páginas.
