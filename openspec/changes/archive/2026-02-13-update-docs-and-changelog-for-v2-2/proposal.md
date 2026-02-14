# Proposal: Documentação e CHANGELOG para a release v2.2

## Summary

A release **v2.2** agrupa as changes **add-scene-weather-effect** e **ensure-version-footer-updated-on-release**. Este change atualiza o CHANGELOG com a secção [2.2], a versão do frontend (package.json) para 2.2.0 e o README (secção 4) para incluir a tag v2.2 na lista de releases.

## Why

- As alterações (efeito de clima na leitura, controlo no header, formalização da versão no rodapé) foram tratadas como continuação da v2.1; definir a **v2.2** como release que as inclui e atualizar documentação e versão em conformidade.

## What Changes

- **CHANGELOG**: Nova secção **## [2.2]** com as entradas add-scene-weather-effect, ensure-version-footer-updated-on-release e linha de documentação/versão (2.2.0). A secção [2.1] permanece com as changes originais da v2.1 (sem mover para [2.2] as duas changes acima).
- **frontend/package.json**: Campo `version` atualizado de `2.1.0` para **`2.2.0`** para que o rodapé exiba "Versão 2.2.0" após o build.
- **README**: Secção 4 (Links para CHANGELOG): lista de tags de exemplo passa a incluir **v2.2** (ex.: v2.0, v2.1, v2.2).

## Goals

- CHANGELOG reflete a release v2.2 com as changes aplicadas (add-scene-weather-effect, ensure-version-footer-updated-on-release).
- Versão do site no rodapé passa a 2.2.0 quando o frontend for construído com este código.
- README menciona v2.2 nas tags de release.

## Scope

- **In scope**: CHANGELOG [2.2], package.json 2.2.0, README secção 4 com v2.2.
- **Out of scope**: Novo guia de atualização (ex.: 2.1→2.2); alterações de código além da versão e documentação.

## Success criteria

- `openspec validate update-docs-and-changelog-for-v2-2 --strict` passa (se existir spec delta).
- CHANGELOG tem secção [2.2] com as entradas descritas.
- package.json tem "version": "2.2.0".
- README secção 4 inclui v2.2 na lista de tags.
