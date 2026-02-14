# Proposal: Garantir atualização da versão no rodapé ao preparar uma release

## Summary

A versão do site exibida no **rodapé** (footer) vem do campo `version` do `frontend/package.json`, injetada em build pelo Vite como `__APP_VERSION__`. Se esse valor não for atualizado ao preparar uma release (ex.: v2.1), o rodapé continuará a mostrar a versão anterior e os utilizadores/operadores podem ficar com dúvidas sobre qual versão está em produção. Este change **formaliza no spec** que, ao preparar uma release versionada, a equipa **deve** atualizar o campo `version` em `frontend/package.json` (e, se necessário, documentar esse passo nos guias de release) para que o rodapé exiba a versão correta após o build.

## Why

- **Problema**: É fácil esquecer de atualizar a versão no `package.json` ao cortar uma release; o rodapé é a referência visível da versão em produção.
- **Objetivo**: Que a versão mostrada no rodapé corresponda à release (tag) que foi deployada; formalizar no spec e na documentação o passo de atualizar `frontend/package.json` antes do build de release.

## What Changes

- **Spec project-docs**: Novo requisito ADDED: ao preparar uma **release versionada** (tag, ex.: v2.1), o repositório **deve** garantir que a **versão exibida no rodapé** do site reflita essa release; para isso, o campo **`version`** em **`frontend/package.json`** **deve** ser atualizado antes do build do frontend para a release. O README (ou a secção de links para CHANGELOG) **deve** referir explicitamente que, ao preparar uma release, se deve atualizar esse valor antes do build.
- **README**: Confirmar ou reforçar na secção 4 (Links para CHANGELOG) a frase que já indica atualizar o valor antes do build; garantir que está clara e visível.

## Goals

- **Rodapé com versão correta**: Após uma release (ex.: tag v2.1), o rodapé do site **deve** exibir essa versão (ex.: "Versão 2.1.0") quando o frontend for construído com o código dessa release.
- **Processo documentado**: O spec project-docs **deve** exigir que, ao preparar uma release, o campo `version` em `frontend/package.json` seja atualizado; o README **deve** mencionar esse passo.

## Scope

- **In scope**: (1) **Spec project-docs**: requisito ADDED — ao preparar uma release versionada, atualizar `version` em `frontend/package.json` para que o rodapé exiba a versão correta; README deve referir esse passo na secção de CHANGELOG/release. (2) **README**: na secção 4 (Links para CHANGELOG), garantir que a frase sobre atualizar o valor antes do build está presente e clara (ex.: "ao preparar uma release, atualizar o campo `version` em `frontend/package.json` antes do build").
- **Out of scope**: Alterar o código do Footer ou do Vite (já exibem e injetam a versão); automatizar o bump de versão (ex.: script ou CI); alterar outras partes do CHANGELOG.

## Affected code and docs

- **openspec/changes/ensure-version-footer-updated-on-release/specs/project-docs/spec.md**: Delta ADDED com um requisito que exige a atualização de `frontend/package.json` version ao preparar uma release e que o README refira esse passo.
- **README.md**: Secção 4 — confirmar ou ajustar o texto para mencionar explicitamente "atualizar o campo `version` em `frontend/package.json` antes do build" ao preparar uma release.

## Dependencies and risks

- **Nenhum**: Apenas documentação e spec; sem impacto em runtime.

## Success criteria

- O spec project-docs inclui um requisito que exige a atualização do campo `version` em `frontend/package.json` ao preparar uma release, para que o rodapé exiba a versão correta.
- O README (secção de CHANGELOG/release) menciona claramente a atualização desse campo antes do build.
- `openspec validate ensure-version-footer-updated-on-release --strict` passa.
