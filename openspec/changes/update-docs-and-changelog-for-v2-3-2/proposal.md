# Proposal: Atualizar documentação do projeto e gerar nova versão no CHANGELOG (v2.4)

## Summary

Atualizar **toda a documentação do projeto** relevante à release e adicionar uma **nova versão** no ficheiro **docs/changelog/CHANGELOG.md**: secção **## [2.4]** no topo (acima de [2.3.2]), com a lista das changes OpenSpec incluídas nesta release e com o item de documentação e versão. Inclui: atualizar o **frontend/package.json** (campo `version` para **2.4**); atualizar o **README** (secção 4 — Links para CHANGELOG) para incluir a tag **v2.4** na lista de exemplos de tags; e, quando aplicável, rever referências a versão em **openspec/project.md** ou **docs/README.md** para manter consistência. As changes a listar na secção [2.4] são: **fix-schedule-publish-draft-post-500**, **upgrade-bff-imagesharp-remediate-ghsa-2cmq**, **add-markdown-preview-tab-post-edit** (com o ajuste de tamanho e scroll da área Preview), **increase-upload-max-width-to-2200**.

## Why

- **Objetivo:** Manter o CHANGELOG e a documentação alinhados com as alterações já aplicadas no código (correção do 500 ao agendar rascunho, atualização do ImageSharp no BFF, aba Preview no formulário de post) e expor uma **nova versão** (2.4) para que o rodapé e os releases reflitam o estado atual.
- **Conformidade:** O spec project-docs exige que cada release versionada tenha secção correspondente no CHANGELOG com as changes incluídas e que a versão no frontend (package.json) seja atualizada ao preparar uma release.

## What Changes

- **docs/changelog/CHANGELOG.md:** Inserir secção **## [2.4]** no topo do ficheiro (acima de `## [2.3.2]`), com bullets para: (1) fix-schedule-publish-draft-post-500 — descrição breve; (2) upgrade-bff-imagesharp-remediate-ghsa-2cmq — descrição breve; (3) add-markdown-preview-tab-post-edit — descrição breve (incluindo ajuste de tamanho e scroll no Preview); (4) increase-upload-max-width-to-2200 — descrição breve; (5) Documentação e versão: CHANGELOG com secção [2.4]; versão no frontend (package.json) definida como 2.4; README secção 4 com tag v2.4.
- **frontend/package.json:** Alterar o campo `version` para `"2.4"`.
- **README.md:** Na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags, adicionar **v2.4** (ex.: `v1.9`, `v1.10`, `v2.0`, `v2.1`, `v2.2`, `v2.3`, `v2.3.1`, `v2.4`).
- **Documentação adicional (opcional):** Se existirem referências explícitas à “última versão” ou à versão 2.3.2 em openspec/project.md ou docs/README.md, atualizar para 2.4 onde fizer sentido.

## Goals

- O ficheiro **docs/changelog/CHANGELOG.md** contém a secção **## [2.4]** no topo, com as alterações desta release e o item de documentação e versão.
- O **frontend/package.json** tem `version` **2.4** para que o rodapé exiba a versão correta após o build.
- O **README** secção 4 inclui a tag **v2.4** na lista de exemplos de tags de release.
- A documentação do projeto está consistente com a nova versão.

## Scope

- **In scope:** CHANGELOG [2.4], package.json 2.4, README secção 4; eventual atualização pontual de project.md ou docs/README.md quando referirem a versão atual.
- **Out of scope:** Novos guias de atualização (ex.: atualizar-2-3-1-para-2-3-2) salvo se for requisito explícito do projeto; alterações de código além da versão no package.json.

## Affected code and docs

- **docs/changelog/CHANGELOG.md** — nova secção [2.4] no topo.
- **frontend/package.json** — campo `version`: 2.3.1 → 2.4.
- **README.md** — secção 4: adicionar v2.4 à lista de tags.
- **openspec/changes/update-docs-and-changelog-for-v2-3-2/specs/project-docs/spec.md** — delta que exige a secção [2.4] e a versão 2.4 (ou referência ao requisito existente de CHANGELOG por release).

## Dependencies and risks

- **Dependências:** Nenhuma. As changes fix-schedule-publish-draft-post-500, upgrade-bff-imagesharp-remediate-ghsa-2cmq, add-markdown-preview-tab-post-edit e increase-upload-max-width-to-2200 estão aplicadas.
- **Riscos:** Nenhum. Apenas documentação e versão.

## Success criteria

- Ao abrir **docs/changelog/CHANGELOG.md**, a secção **## [2.4]** aparece no topo e lista as quatro changes com descrição breve e o item de documentação e versão.
- O **frontend/package.json** tem `"version": "2.4"`.
- O **README** secção 4 inclui **v2.4** na lista de exemplos de tags.
- `openspec validate update-docs-and-changelog-for-v2-3-2 --strict` passa.
