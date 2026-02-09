# project-docs — delta for add-changelog-1-9-sitemap-fix

## ADDED Requirements

### Requirement: CHANGELOG inclui secção [1.9] com fix do sitemap XML

O ficheiro **CHANGELOG.md** na raiz **deve** (SHALL) conter a secção **## [1.9]** que descreve as alterações dessa versão, incluindo a change **fix-sitemap-xml-declaration-validation**: correção da declaração XML do sitemap (resposta GET /sitemap.xml sem BOM, primeira linha no formato `<?xml version="1.0" encoding="UTF-8" ?>` com espaço antes de `?>`) para que validadores externos (ex.: xml-sitemaps.com) aceitem o documento. A lista de tags de release na frase introdutória do changelog **deve** incluir **v1.9**.

#### Scenario: Leitor consulta o CHANGELOG e vê a versão 1.9

- **Quando** um utilizador abre o CHANGELOG.md
- **Então** encontra a secção **## [1.9]** acima de [1.8]
- **E** vê a entrada para fix-sitemap-xml-declaration-validation (correção do sitemap para validação externa)
- **E** a frase introdutória menciona v1.9 nas tags de release
