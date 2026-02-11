# project-docs — delta for update-docs-and-changelog-for-v2

## ADDED Requirements

### Requirement: CHANGELOG e documentação atualizados para a release v2.0 (SHALL)

Para a **release versionada v2.0**, o ficheiro **docs/changelog/CHANGELOG.md** SHALL conter a secção **## [2.0]** no topo (acima de [1.10]) que descreve as alterações dessa versão, com uma entrada por change OpenSpec incluída na release: add-author-dashboard-inicial-v2, add-dashboard-rascunho-metric, merge-dashboard-publications-single-page, style-dashboard-rascunho-card-yellow-border, make-dashboard-cards-clickable, add-author-area-sort-and-story-type-filter, widen-author-area-search-input, indicate-dashboard-card-filter-with-yellow-border, update-docs-and-changelog-for-v2. Cada entrada SHALL ter uma descrição breve. A frase introdutória do CHANGELOG SHALL incluir **v2.0** na lista de tags de release (ex.: v1.9, v1.10, v2.0).

O **README.md** na raiz SHALL refletir o estado da aplicação na v2.0: na secção de links para o CHANGELOG (ex.: secção 4), os exemplos de tags SHALL incluir **v2.0**; na secção de funcionalidades (ex.: secção 5), a descrição da **Área do autor** SHALL corresponder ao comportamento atual: página única em `/area-autor` com dashboard (seis indicadores), cards clicáveis (Total, Publicados, Planejados, Rascunho para filtrar; borda amarela no card ativo; desmarcar ao alterar filtros manuais; Autores → Contas) e secção Publicações (lista, pesquisa, filtro por linha da história, ordenação, Novo post, editar/excluir).

O ficheiro **openspec/project.md** SHALL descrever a área do autor em conformidade com a v2.0: rota `/area-autor` como página única com "Visão geral do blog" e "Publicações"; cards do dashboard clicáveis; filtros e ordenação na secção Publicações.

O projeto frontend SHALL expor a versão **2.0.0** (ex.: campo `version` em `frontend/package.json` definido como `"2.0.0"`) para que o rodapé ou outros elementos que exibam a versão mostrem 2.0.

#### Scenario: Leitor consulta o CHANGELOG e vê a versão 2.0

- **GIVEN** o repositório tem a documentação atualizada para v2.0
- **WHEN** um leitor abre docs/changelog/CHANGELOG.md
- **THEN** encontra a secção **## [2.0]** no topo (acima de [1.10])
- **AND** a secção lista as changes da release 2.0 com descrição breve
- **AND** a frase introdutória menciona v2.0 nas tags de release

#### Scenario: README descreve a Área do autor na v2.0

- **GIVEN** o README foi atualizado para v2.0
- **WHEN** um leitor abre o README e consulta a secção de funcionalidades
- **THEN** a "Área do autor" é descrita como página única em /area-autor com dashboard (seis indicadores), cards clicáveis (filtro por estado, borda amarela no ativo, Autores → Contas) e secção Publicações com lista, pesquisa, filtro por linha da história, ordenação e ações (Novo post, editar/excluir)
- **AND** a secção de links para o CHANGELOG inclui v2.0 nos exemplos de tags

#### Scenario: project.md reflete o comportamento da área do autor v2.0

- **GIVEN** openspec/project.md foi atualizado
- **WHEN** um leitor consulta o Domain Context (Páginas ou Rotas)
- **THEN** a área do autor é descrita como página única em /area-autor com visão geral (dashboard, cards clicáveis) e secção Publicações (filtros, ordenação)
- **AND** não há contradição com o comportamento implementado na v2.0
