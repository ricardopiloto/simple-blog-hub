# project-docs — delta for update-docs-and-changelog-for-v2-5

## ADDED Requirements

### Requirement: CHANGELOG e versão atualizados para a release v2.5 (SHALL)

Para a **release versionada v2.5**, o ficheiro **docs/changelog/CHANGELOG.md** **deve** (SHALL) conter a secção **## [2.5]** **no topo** (acima de [2.4.1]) que descreve as alterações dessa versão: (1) **add-rounded-corners-post-cover-images** — imagens de capa dos posts com bordas arredondadas em todos os contextos (destaque, lista, índice da história, página do artigo); (2) **count-views-only-for-published-posts** — contagem de visualizações apenas para posts publicados (rascunhos não incrementam; dashboard "Total de visualizações" soma só publicados); (3) item de **documentação e versão** (CHANGELOG [2.5], versão no frontend 2.5, README secção 4 com tag v2.5). O **frontend/package.json** **deve** ter o campo `version` definido como **"2.5"**. O **README** (secção 4, Links para CHANGELOG) **deve** incluir **v2.5** na lista de exemplos de tags de release.

#### Scenario: Leitor consulta o CHANGELOG para a v2.5

- **GIVEN** the release v2.5 has been prepared (change update-docs-and-changelog-for-v2-5)
- **WHEN** a user opens docs/changelog/CHANGELOG.md
- **THEN** the section **## [2.5]** is at the top (above [2.4.1])
- **AND** it lists add-rounded-corners-post-cover-images and count-views-only-for-published-posts with brief descriptions
- **AND** it includes the documentation and version item (package.json 2.5, README with tag v2.5)
