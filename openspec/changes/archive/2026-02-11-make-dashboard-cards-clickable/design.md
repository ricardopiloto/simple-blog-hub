# Design: Cards clicáveis no dashboard da área do autor

## Decisões

### Filtro por estado (client-side)

A lista na secção "Publicações" já é filtrada por texto (autor, título, data). Será adicionado um **filtro por estado** aplicado antes do filtro de texto:

- **Todos** — não restringe por estado; mostra todos os posts (comportamento atual quando não há seleção).
- **Publicados** — `post.published === true` (alinhado com `published_count` do dashboard).
- **Planejados** — `post.scheduled_publish_at != null && post.scheduled_publish_at !== ''` (alinhado com `scheduled_count`).
- **Rascunho** — `post.published === false` (alinhado com `draft_count`).

Ordem de aplicação: (1) filtro por estado; (2) filtro de texto. Assim o utilizador pode clicar em "Rascunho" e depois refinar por título no campo de pesquisa.

### Interação por card

| Card           | Ação ao clicar                         | Elemento recomendado |
|----------------|----------------------------------------|----------------------|
| Total de posts | Opcional: limpar filtro (statusFilter = todos) | `<button>` ou div não clicável |
| Publicados     | Definir statusFilter = publicados      | `<button>` |
| Planejados     | Definir statusFilter = planejados      | `<button>` |
| Rascunho       | Definir statusFilter = rascunho        | `<button>` |
| Visualizações  | Nenhuma                                | `<div>` (não clicável) |
| Autores        | Navegar para /area-autor/contas        | `<Link>` |

### Scroll opcional

Ao clicar em Publicados, Planejados ou Rascunho, a implementação pode fazer scroll suave até à secção "Publicações" (ex.: `ref` no container da secção e `scrollIntoView({ behavior: 'smooth' })`) para que o utilizador veja imediatamente a lista filtrada. Não é obrigatório na proposta; pode ser incluído como melhoria na mesma tarefa.

### Acessibilidade

- Botões com texto/label claro (ex.: "Ver apenas publicados", "Ver apenas rascunhos", "Ir para Contas").
- Card Visualizações sem role de botão para não sugerir ação.
