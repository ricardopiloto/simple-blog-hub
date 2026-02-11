# Unir dashboard e publicações numa única página (área do autor)

## Why

Em vez de duas páginas (dashboard em `/area-autor` e lista em `/area-autor/publicacoes`), **uma única página** em `/area-autor` com a **visão geral do blog** no topo e a **listagem de publicações** em baixo melhora a estética e a experiência: o autor vê os indicadores e a lista no mesmo ecrã, sem mudar de rota. Alinha com o layout desejado: | Visão geral do blog | seguido de | Publicações | na mesma página.

## What Changes

1. **Página única em /area-autor**  
   A rota **`/area-autor`** passa a exibir **uma só página** com duas secções verticais:
   - **Secção superior — "Visão geral do blog":** os cinco indicadores do dashboard (total de posts, publicados, planejados, total de visualizações, autores), no mesmo formato de cards já implementado.
   - **Secção inferior — "Publicações":** a lista de posts com filtro por autor/título/data, scroll quando há mais de 10 itens, botão "Novo post" e ações editar/excluir. Ou seja, o conteúdo que hoje está em `/area-autor/publicacoes` passa a estar **na mesma página**, abaixo do dashboard.

2. **Rotas**  
   - **`/area-autor`** → página única (dashboard + lista). Não há navegação para outra rota para ver as publicações.
   - **`/area-autor/publicacoes`** → pode ser **removida** ou mantida como **redirect** para `/area-autor` (para compatibilidade com bookmarks ou links antigos).
   - `/area-autor/posts/novo`, `/area-autor/posts/:id/editar`, `/area-autor/contas` mantêm-se. Login e header continuam a apontar para `/area-autor`.

3. **Backend**  
   Sem alterações: o endpoint de stats do dashboard (API e BFF) continua a ser usado; a lista de posts continua a usar o endpoint existente da área do autor.

4. **Frontend**  
   - Unir num único componente de página (ou composição) a parte do dashboard e a parte da lista. Pode reutilizar os componentes/blocos já existentes (cards de stats + lista com filtro e scroll).
   - Remover a dependência da rota `/area-autor/publicacoes` para ver a lista; opcionalmente remover o componente de página separado da lista ou manter apenas como parte da página única.
   - Links internos que apontavam para `/area-autor/publicacoes` (ex.: "Publicações" no dashboard) deixam de ser necessários como navegação para outra página; a secção "Publicações" pode ser identificada por um id/âncora para scroll suave se desejado, ou simplesmente ficar em baixo no fluxo natural.

5. **Spec author-area-dashboard**  
   - **MODIFIED:** O dashboard e a lista de publicações SHALL estar na **mesma página** em `/area-autor`: secção "Visão geral do blog" no topo, secção "Publicações" (lista de posts, filtro, scroll, Novo post, editar/excluir) abaixo. Não é obrigatória uma página separada para Publicações.
   - **REMOVED** (ou reformulado): Requisito que exige uma rota `/area-autor/publicacoes` separada e link do dashboard para essa rota.
   - O requisito de scroll e filtro na lista continua a aplicar-se à **secção** Publicações (na mesma página).

## Goals

- Uma única página em `/area-autor` com "Visão geral do blog" em cima e "Publicações" em baixo.
- Mesma funcionalidade (stats, lista, filtro, scroll, Novo post, editar/excluir) sem mudança de rota para ver a lista.
- Spec atualizado para refletir a página única; validação OpenSpec em modo strict passa.

## Out of scope

- Alterar o backend (API/BFF) ou as métricas do dashboard.
- Alterar permissões ou regras de edição/exclusão.

## Success criteria

- Em `/area-autor` o utilizador vê primeiro os cinco indicadores e, ao descer, a secção Publicações com a lista de posts.
- Não é necessário ir a `/area-autor/publicacoes` para ver a lista (rota pode ser redirect para `/area-autor` ou removida).
- `openspec validate merge-dashboard-publications-single-page --strict` passa.
