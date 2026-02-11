# Atualizar documentação do projeto e CHANGELOG para a versão 2.0

## Why

As alterações da **área do autor** (dashboard único com lista, cards clicáveis, ordenação, filtro por linha da história, borda amarela como indicador de filtro, etc.) e pequenas melhorias (campo de pesquisa mais largo) estão implementadas. O projeto deve ser tratado como **versão 2.0** e toda a documentação — CHANGELOG, README, openspec/project.md, versão no frontend — deve ser atualizada para refletir o estado atual e permitir que leitores e operadores saibam o que mudou.

## What Changes

1. **CHANGELOG (docs/changelog/CHANGELOG.md)**
   - Adicionar secção **## [2.0]** no topo (acima de [1.10]) com uma entrada por change OpenSpec que integra a release 2.0, com descrição breve. Incluir as changes aplicadas que afetam a área do autor e a documentação: add-author-dashboard-inicial-v2, add-dashboard-rascunho-metric, merge-dashboard-publications-single-page, style-dashboard-rascunho-card-yellow-border, make-dashboard-cards-clickable, add-author-area-sort-and-story-type-filter, widen-author-area-search-input, indicate-dashboard-card-filter-with-yellow-border; e a própria change update-docs-and-changelog-for-v2 (atualização da documentação e CHANGELOG para v2.0).
   - Atualizar a frase introdutória do CHANGELOG para incluir **v2.0** na lista de tags de release (ex.: v1.9, v1.10, v2.0).

2. **README (raiz)**
   - Secção 4 (Links para CHANGELOG): incluir **v2.0** nos exemplos de tags (ex.: v1.9, v1.10, v2.0).
   - Secção 5 (Funcionalidades existentes no blog): atualizar o bullet da **Área do autor** para descrever o comportamento atual: página única em `/area-autor` com "Visão geral do blog" (dashboard com seis indicadores: total de posts, publicados, planejados, rascunho, visualizações, autores); cards Total, Publicados, Planejados e Rascunho clicáveis (filtram a lista; borda amarela indica o filtro ativo; ao alterar pesquisa/linha da história/ordenação a seleção é desmarcada); card Autores leva a Contas; secção "Publicações" abaixo com lista de posts, pesquisa, filtro por linha da história (Todos / Velho Mundo / Idade das Trevas), ordenação (data ou ordem da história, asc/desc), botão Novo post e ações editar/excluir.
   - Secção 6: opcionalmente referir que quem está na v1.10 e atualiza para v2.0 pode seguir ATUALIZAR-SERVIDOR-DOCKER-CADDY (sem novas variáveis obrigatórias além das já exigidas na v1.10; sem novos scripts de banco para as changes da v2.0).

3. **openspec/project.md**
   - Em **Rotas** e/ou **Páginas** (Domain Context): atualizar a descrição da área do autor para refletir que `/area-autor` é uma **página única** com secção "Visão geral do blog" (dashboard com seis indicadores, cards clicáveis para filtrar ou ir a Contas, borda amarela no card do filtro ativo) e secção "Publicações" (lista com filtro de texto, filtro por linha da história, ordenação configurável, filtro por estado via clique nos cards; desmarcar ao alterar filtros manuais). Manter referências a `/area-autor/contas`, `/area-autor/posts/novo`, `/area-autor/posts/:id/editar` e que `/area-autor/publicacoes` redireciona para `/area-autor`.

4. **Versão no frontend**
   - Atualizar o campo **version** em `frontend/package.json` para **"2.0.0"** (ou "2.0.0") para que o rodapé do site exiba a versão 2.0.

5. **docs/README.md**
   - Opcional: na tabela ou no texto, referir que o CHANGELOG inclui a release **v2.0** (ex.: "histórico de releases versionadas (v1.x, v2.0)").

6. **Guia de atualização v1.10 → v2.0 (opcional)**
   - O repositório **pode** incluir um guia em `docs/deploy/ATUALIZAR-1-10-PARA-2-0.md` destinado a operadores que estão na v1.10 e atualizam para v2.0: pull, rebuild dos contentores (se aplicável), build do frontend; sem novas variáveis de ambiente obrigatórias nem scripts de banco para as funcionalidades da v2.0; referência a ATUALIZAR-SERVIDOR-DOCKER-CADDY. Se não for criado, a secção 6 do README pode indicar que a atualização para v2.0 segue o guia genérico de atualização.

## Goals

- CHANGELOG com secção [2.0] listando as changes da release e frase introdutória com v2.0.
- README e openspec/project.md descrevem a área do autor como está na v2.0 (página única, cards clicáveis, filtros, ordenação, borda amarela como indicador).
- Versão 2.0.0 no frontend (package.json).
- Documentação coerente para quem consulta o projeto como "versão 2.0".

## Non-Goals

- Não alterar código de funcionalidades; apenas documentação e versão.
- Não obrigar guia ATUALIZAR-1-10-PARA-2-0.md se o guia genérico for suficiente (decisão na tarefa).

## Success Criteria

- Leitor que abre o CHANGELOG vê a secção [2.0] no topo com as changes listadas.
- Leitor que abre o README vê a área do autor descrita com dashboard + lista, cards clicáveis, filtros e ordenação.
- openspec/project.md reflete o comportamento atual da área do autor.
- frontend/package.json tem version "2.0.0".
- `openspec validate update-docs-and-changelog-for-v2 --strict` passa.
