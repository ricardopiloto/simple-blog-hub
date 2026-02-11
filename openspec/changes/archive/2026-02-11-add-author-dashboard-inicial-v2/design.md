# Design: Dashboard inicial e submenu Publicações (v2.0)

## Decisões

### 1. Definição das métricas

| Métrica | Fonte | Notas |
|--------|--------|--------|
| Total de posts | Count(Posts) | Todos os posts do blog (visíveis na área do autor). |
| Publicados | Count(Posts onde Published = true) | |
| Planejados (agendados) | Count(Posts onde ScheduledPublishAt != null) | Inclui agendados futuros e já publicados por agendamento (campo pode permanecer preenchido conforme implementação atual). |
| Total de visualizações | Sum(Posts.ViewCount) | |
| Autores | Count(Authors) | Número de autores no blog. |

### 2. Onde expor o endpoint

- **API:** Um único endpoint, por exemplo `GET /api/dashboard/stats`, protegido por X-Author-Id, retornando um DTO com os cinco números. Evita múltiplas chamadas e mantém a API interna simples.
- **BFF:** `GET /bff/dashboard/stats` (ou `/bff/posts/dashboard-stats`) com [Authorize]; repassa à API e devolve o JSON ao frontend.

### 3. Rotas no frontend

- **`/area-autor`** → Dashboard (nova página).
- **`/area-autor/publicacoes`** → Lista de posts (conteúdo atual de `AreaAutor.tsx`); pode ser o mesmo componente renomeado ou um wrapper que reutiliza a lista.
- **`/area-autor/contas`**, **`/area-autor/posts/novo`**, **`/area-autor/posts/:id/editar`** → inalterados.
- **`/area-autor/posts`** → Redirect para `/area-autor` (dashboard como entrada única).

### 4. Navegação e header

- Link "Área do autor" no header continua a apontar para `/area-autor` (agora o dashboard).
- No dashboard: link ou card "Publicações" → `/area-autor/publicacoes`.
- Na página Publicações: breadcrumb ou link "Dashboard" / "Área do autor" → `/area-autor` para voltar ao início.

### 5. Reutilização do componente da lista

- O componente que hoje renderiza a lista em `AreaAutor.tsx` (lista, filtro, scroll, botão Novo post, editar/excluir) pode ser extraído ou mantido e usado apenas na rota `/area-autor/publicacoes`. Evita duplicação e mantém o spec de scroll/filtro aplicado a essa página.
