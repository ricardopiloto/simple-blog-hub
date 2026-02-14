# project-docs — delta for update-docs-and-changelog-for-v2-2

## ADDED Requirements

### Requirement: CHANGELOG e versão atualizados para a release v2.2 (SHALL)

Para a **release versionada v2.2**, o ficheiro **docs/changelog/CHANGELOG.md** **deve** (SHALL) conter a secção **## [2.2]** que descreve as alterações dessa versão: add-scene-weather-effect (efeito de clima chuva/neve na leitura e controlo no header), ensure-version-footer-updated-on-release (formalização da atualização do campo version no package.json ao preparar uma release), e a atualização da documentação/versão para 2.2.0. O **frontend/package.json** **deve** ter o campo `version` definido como **"2.2.0"** para que o rodapé exiba a versão correta após o build. O **README** (secção 4, Links para CHANGELOG) **deve** incluir **v2.2** na lista de tags de release (ex.: v2.0, v2.1, v2.2).

#### Scenario: Leitor consulta o CHANGELOG para a v2.2

- **Quando** um utilizador abre docs/changelog/CHANGELOG.md
- **Então** existe a secção **## [2.2]** com as changes add-scene-weather-effect e ensure-version-footer-updated-on-release e a linha de documentação/versão
- **E** o package.json do frontend tem version "2.2.0"
- **E** o README secção 4 menciona v2.2 nas tags de release
