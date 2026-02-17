# project-docs — delta for update-docs-and-changelog-for-v2-4-1

## ADDED Requirements

### Requirement: CHANGELOG e versão atualizados para a release v2.4.1 (SHALL)

Para a **release versionada v2.4.1**, o ficheiro **docs/changelog/CHANGELOG.md** **deve** (SHALL) conter a secção **## [2.4.1]** **no topo** (acima de [2.4]) que descreve as alterações dessa versão: (1) **remove-personagens-menu-link** — remoção do item "Personagens" do menu; título/logo do site redireciona para https://1nodado.com.br; (2) **adjust-scene-weather-effect-theme-visibility** — efeito chuva/neve com diferenciação por tema (melhor visibilidade no modo claro); (3) item de **documentação e versão** (CHANGELOG [2.4.1], versão no frontend 2.4.1, README secção 4 com tag v2.4.1). O **frontend/package.json** **deve** ter o campo `version` definido como **"2.4.1"**. O **README** (secção 4, Links para CHANGELOG) **deve** incluir **v2.4.1** na lista de exemplos de tags de release.

#### Scenario: Leitor consulta o CHANGELOG para a v2.4.1

- **GIVEN** the release v2.4.1 has been prepared (change update-docs-and-changelog-for-v2-4-1)
- **WHEN** a user opens docs/changelog/CHANGELOG.md
- **THEN** the section **## [2.4.1]** is at the top (above [2.4])
- **AND** it lists remove-personagens-menu-link and adjust-scene-weather-effect-theme-visibility with brief descriptions
- **AND** it includes the documentation and version item (package.json 2.4.1, README with tag v2.4.1)
