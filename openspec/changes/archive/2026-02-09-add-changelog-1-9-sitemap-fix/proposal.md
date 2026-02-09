# Adicionar secção [1.9] ao CHANGELOG com a correção do sitemap

## Summary

Atualizar o **CHANGELOG.md** com uma nova secção **## [1.9]** que descreva a change **fix-sitemap-xml-declaration-validation** (correção da declaração XML do sitemap para passar em validadores externos: sem BOM, declaração com espaço antes de `?>`). Atualizar também a frase introdutória do changelog para incluir **v1.9** na lista de tags de release.

## Goals

1. **CHANGELOG.md:** Inserir no topo das versões (acima de [1.8]) a secção **## [1.9]** com uma entrada para **fix-sitemap-xml-declaration-validation**: descrição breve (resposta GET /sitemap.xml sem BOM, primeira linha com declaração `<?xml version="1.0" encoding="UTF-8" ?>` com espaço antes de `?>`, válida em validadores como xml-sitemaps.com).
2. **Frase introdutória:** Na primeira linha do CHANGELOG (ex.: "Os releases são versionados por tag (ex.: v1.3, … v1.8)"), adicionar **v1.9** ao exemplo.

## Out of scope

- Alterar código ou documentação além do CHANGELOG.
- Criar tag Git v1.9 ou guias de atualização 1.8→1.9 (podem ser feitos à parte).

## Success criteria

- O CHANGELOG contém a secção **## [1.9]** acima de [1.8] com a entrada para fix-sitemap-xml-declaration-validation.
- A frase introdutória do changelog menciona v1.9.
- `openspec validate add-changelog-1-9-sitemap-fix --strict` passa.
