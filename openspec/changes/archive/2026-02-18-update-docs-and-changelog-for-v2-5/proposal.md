# Proposal: Atualizar documentação e CHANGELOG para a versão 2.5

## Summary

Adicionar a **versão 2.5** ao projeto: nova secção **## [2.5]** no topo de **docs/changelog/CHANGELOG.md** (acima de [2.4.1]), com as changes OpenSpec aplicadas desde a 2.4.1; atualizar **frontend/package.json** (`version` para **2.5**); e incluir a tag **v2.5** na lista de exemplos de tags no **README** (secção 4). As changes a listar na secção [2.5] são: **add-rounded-corners-post-cover-images** (imagens de capa dos posts com bordas arredondadas em todos os contextos) e **count-views-only-for-published-posts** (contagem de visualizações apenas para posts publicados; rascunhos não incrementam o contador; dashboard "Total de visualizações" soma só publicados).

## Why

- **Objetivo:** Manter o CHANGELOG e a documentação alinhados com as alterações aplicadas após a 2.4.1 (bordas arredondadas nas capas, visualizações só para publicados) e expor a versão **2.5** para que o rodapé e os releases reflitam o estado atual.
- **Conformidade:** O spec project-docs exige que cada release versionada tenha secção no CHANGELOG e que a versão no frontend (package.json) seja atualizada ao preparar uma release.

## What Changes

- **docs/changelog/CHANGELOG.md:** Inserir secção **## [2.5]** no topo (acima de `## [2.4.1]`), com bullets para: (1) add-rounded-corners-post-cover-images — descrição breve; (2) count-views-only-for-published-posts — descrição breve; (3) Documentação e versão: CHANGELOG [2.5]; versão no frontend 2.5; README secção 4 com tag v2.5.
- **frontend/package.json:** Alterar o campo `version` de `"2.4.1"` para `"2.5"`.
- **README.md:** Na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags, incluir **v2.5** (ex.: … `v2.4.1`, `v2.5`).

## Goals

- O ficheiro **docs/changelog/CHANGELOG.md** contém a secção **## [2.5]** no topo, com as alterações desta release e o item de documentação e versão.
- O **frontend/package.json** tem `version` **2.5** para que o rodapé exiba a versão correta após o build.
- O **README** secção 4 inclui a tag **v2.5** na lista de exemplos de tags de release.

## Scope

- **In scope:** CHANGELOG [2.5], package.json 2.5, README secção 4; spec delta em project-docs.
- **Out of scope:** Guia de atualização 2.4.1 → 2.5 em docs/local (opcional); alterações de código além da versão no package.json.

## Affected code and docs

- **docs/changelog/CHANGELOG.md** — nova secção [2.5] no topo.
- **frontend/package.json** — campo `version`: 2.4.1 → 2.5.
- **README.md** — secção 4: incluir v2.5 na lista de tags.
- **openspec/changes/update-docs-and-changelog-for-v2-5/specs/project-docs/spec.md** — delta que exige a secção [2.5] e a versão 2.5.

## Dependencies and risks

- **Dependências:** Nenhuma. As changes add-rounded-corners-post-cover-images e count-views-only-for-published-posts estão aplicadas.
- **Riscos:** Nenhum.

## Success criteria

- Ao abrir **docs/changelog/CHANGELOG.md**, a secção **## [2.5]** aparece no topo e lista as duas changes com descrição breve e o item de documentação e versão.
- O **frontend/package.json** tem `"version": "2.5"`.
- O **README** secção 4 inclui **v2.5** na lista de exemplos de tags.
- `openspec validate update-docs-and-changelog-for-v2-5 --strict` passa.
