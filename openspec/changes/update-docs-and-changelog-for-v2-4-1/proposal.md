# Proposal: Atualizar documentação e CHANGELOG para a versão 2.4.1

## Summary

Adicionar a **versão 2.4.1** ao projeto: nova secção **## [2.4.1]** no topo de **docs/changelog/CHANGELOG.md** (acima de [2.4]), com as changes OpenSpec aplicadas desde a 2.4; atualizar **frontend/package.json** (`version` para **2.4.1**); e incluir a tag **v2.4.1** na lista de exemplos de tags no **README** (secção 4). As changes a listar na secção [2.4.1] são: **remove-personagens-menu-link** (remoção do item "Personagens" do menu; título/logo do site redireciona para https://1nodado.com.br) e **adjust-scene-weather-effect-theme-visibility** (efeito chuva/neve com melhor visibilidade no tema claro).

## Why

- **Objetivo:** Manter o CHANGELOG e a documentação alinhados com as alterações aplicadas após a 2.4 (header com logo para 1nodado.com.br, efeito de clima por tema) e expor a versão **2.4.1** para que o rodapé e os releases reflitam o estado atual.
- **Conformidade:** O spec project-docs exige que cada release versionada tenha secção no CHANGELOG e que a versão no frontend (package.json) seja atualizada ao preparar uma release.

## What Changes

- **docs/changelog/CHANGELOG.md:** Inserir secção **## [2.4.1]** no topo (acima de `## [2.4]`), com bullets para: (1) remove-personagens-menu-link — descrição breve; (2) adjust-scene-weather-effect-theme-visibility — descrição breve; (3) Documentação e versão: CHANGELOG [2.4.1]; versão no frontend 2.4.1; README secção 4 com tag v2.4.1.
- **frontend/package.json:** Alterar o campo `version` de `"2.4"` para `"2.4.1"`.
- **README.md:** Na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags, incluir **v2.4.1** (ex.: … `v2.4`, `v2.4.1`).

## Goals

- O ficheiro **docs/changelog/CHANGELOG.md** contém a secção **## [2.4.1]** no topo, com as alterações desta release e o item de documentação e versão.
- O **frontend/package.json** tem `version` **2.4.1** para que o rodapé exiba a versão correta após o build.
- O **README** secção 4 inclui a tag **v2.4.1** na lista de exemplos de tags de release.

## Scope

- **In scope:** CHANGELOG [2.4.1], package.json 2.4.1, README secção 4; spec delta em project-docs.
- **Out of scope:** Guia de atualização 2.4 → 2.4.1 em docs/local (opcional); alterações de código além da versão no package.json.

## Affected code and docs

- **docs/changelog/CHANGELOG.md** — nova secção [2.4.1] no topo.
- **frontend/package.json** — campo `version`: 2.4 → 2.4.1.
- **README.md** — secção 4: incluir v2.4.1 na lista de tags.
- **openspec/changes/update-docs-and-changelog-for-v2-4-1/specs/project-docs/spec.md** — delta que exige a secção [2.4.1] e a versão 2.4.1.

## Dependencies and risks

- **Dependências:** Nenhuma. As changes remove-personagens-menu-link e adjust-scene-weather-effect-theme-visibility estão aplicadas.
- **Riscos:** Nenhum.

## Success criteria

- Ao abrir **docs/changelog/CHANGELOG.md**, a secção **## [2.4.1]** aparece no topo e lista as duas changes com descrição breve e o item de documentação e versão.
- O **frontend/package.json** tem `"version": "2.4.1"`.
- O **README** secção 4 inclui **v2.4.1** na lista de exemplos de tags.
- `openspec validate update-docs-and-changelog-for-v2-4-1 --strict` passa.
