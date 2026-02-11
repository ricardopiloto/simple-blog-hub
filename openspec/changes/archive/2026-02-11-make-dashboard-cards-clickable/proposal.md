# Tornar os cards do dashboard da área do autor clicáveis

## Why

Os indicadores do dashboard (total de posts, publicados, planejados, rascunho, visualizações, autores) são hoje apenas informativos. Torná-los **clicáveis** permite ao utilizador ir rapidamente à lista filtrada pelo estado correspondente ou à gestão de contas, melhorando a descoberta e o fluxo de trabalho na área do autor.

## What Changes

1. **Cards clicáveis com ações distintas**
   - **Publicados** — ao clicar, a secção "Publicações" é filtrada para mostrar **apenas posts publicados** (critério alinhado com o backend: `published === true`). O campo de pesquisa continua utilizável em conjunto com este filtro.
   - **Planejados** — ao clicar, a lista é filtrada para mostrar **apenas posts com data de agendamento** (`scheduled_publish_at` preenchido), alinhado com a métrica do dashboard.
   - **Rascunho** — ao clicar, a lista é filtrada para mostrar **apenas posts em rascunho** (`published === false`), alinhado com a métrica do dashboard.
   - **Visualizações** — por agora **sem ação** ao clicar (mantém-se apenas informativo).
   - **Autores** — ao clicar, o utilizador é **redirecionado para a rota Contas** (`/area-autor/contas`).
   - **Total de posts** — opcional: ao clicar, pode limpar o filtro por estado e mostrar todos os posts na lista; ou permanecer não clicável. A implementação pode escolher uma das opções.

2. **Comportamento da lista**
   - A secção "Publicações" já tem um filtro de texto (autor, título, data). Deve existir um **filtro por estado** (todos / publicados / planejados / rascunho) aplicado em conjunto: primeiro por estado (quando definido pelo clique no card), depois pelo texto. Clicar num card define o estado; o utilizador pode continuar a refinar com o campo de pesquisa.
   - Opcionalmente, ao clicar num card que aplica filtro (Publicados, Planejados, Rascunho), a página pode fazer scroll suave até à secção "Publicações" para que o resultado seja imediatamente visível.

3. **UX**
   - Os cards afetados devem parecer **clicáveis** (cursor pointer, hover quando aplicável). O card "Visualizações" pode manter o mesmo estilo visual dos restantes, mas sem ação de clique (ou com feedback visual que não executa ação).
   - Acessibilidade: uso de `<button>` ou `<Link>` conforme o caso, com texto/label adequado (ex.: "Filtrar por publicados", "Ir para Contas").

4. **Backend**
   - Sem alterações. A lista de posts da área do autor continua a ser obtida pelo endpoint existente; a filtragem por estado (publicado / planejado / rascunho) é feita no **cliente** com os dados já carregados, de forma consistente com as definições usadas no dashboard (API: `Published`, `ScheduledPublishAt != null`, `!Published` para draft).

## Goals

- Publicados, Planejados e Rascunho: ao clicar, filtrar a lista da secção Publicações pelo estado correspondente.
- Autores: ao clicar, navegar para `/area-autor/contas`.
- Visualizações: sem ação ao clicar (por agora).
- Total de posts: opcional (limpar filtro ou não clicável).
- Filtro por estado combinado com o filtro de texto existente; critérios de estado alinhados com as métricas do dashboard.

## Non-Goals

- Não alterar endpoints nem lógica de contagem no backend.
- Não implementar ação para o card "Visualizações" nesta change.
- Não obrigar scroll suave na proposta (pode ser implementado como melhoria opcional).

## Success Criteria

- Utilizador autenticado em `/area-autor` consegue clicar em "Publicados" e ver apenas posts publicados na lista.
- O mesmo para "Planejados" (apenas com `scheduled_publish_at`) e "Rascunho" (apenas não publicados).
- Clicar em "Autores" redireciona para `/area-autor/contas`.
- Clicar em "Visualizações" não altera filtro nem navega.
- O filtro de texto continua a funcionar em conjunto com o filtro por estado.
