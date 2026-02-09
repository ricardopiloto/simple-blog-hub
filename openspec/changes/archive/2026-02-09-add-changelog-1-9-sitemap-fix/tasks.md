# Tasks: add-changelog-1-9-sitemap-fix

## 1. Atualizar CHANGELOG.md

- [x] 1.1 Em `CHANGELOG.md`, na frase introdutória (primeira linha após o título), adicionar **v1.9** ao exemplo de tags (ex.: "v1.3, v1.4, v1.5, v1.6, v1.7, v1.8, v1.9").
- [x] 1.2 Inserir uma nova secção **## [1.9]** imediatamente após a frase introdutória e antes de **## [1.8]**, com uma entrada para **fix-sitemap-xml-declaration-validation**: correção da declaração XML do sitemap (resposta sem BOM, primeira linha `<?xml version="1.0" encoding="UTF-8" ?>` com espaço antes de `?>`) para validadores externos (ex.: xml-sitemaps.com).

## 2. Spec delta project-docs (opcional)

- [x] 2.1 Em `openspec/changes/add-changelog-1-9-sitemap-fix/specs/project-docs/spec.md`, ADDED requirement: o CHANGELOG **deve** incluir a secção **## [1.9]** com a change fix-sitemap-xml-declaration-validation (correção do sitemap XML para validação externa). Incluir cenário: leitor abre o CHANGELOG e vê a secção [1.9] com a entrada do fix do sitemap.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-changelog-1-9-sitemap-fix --strict` e corrigir falhas.
