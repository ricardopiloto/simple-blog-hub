# Proposal: Atualizar documentação e CHANGELOG para a versão 2.5.2

## Summary

Adicionar a **versão 2.5.2** ao projeto: nova secção **## [2.5.2]** no topo de **docs/changelog/CHANGELOG.md** (acima de [2.5.1]), com as changes OpenSpec aplicadas desde a 2.5.1; atualizar **frontend/package.json** (`version` para **2.5.2**); e incluir a tag **v2.5.2** na lista de exemplos de tags no **README** (secção 4). As changes a listar na secção [2.5.2] são: **notify-session-expired-and-redirect-to-home** (modal "Sessão expirada" ao receber 401; redirecionamento para a página inicial quando na área do autor) e **move-story-type-error-below-form-buttons** (alerta de História obrigatório movido para abaixo dos botões no formulário Novo post/Editar post; borda vermelha no toggle mantida).

## Why

- **Objetivo:** Manter o CHANGELOG e a documentação alinhados com as alterações aplicadas após a 2.5.1 (notificação de sessão expirada e reposicionamento do erro de História) e expor a versão **2.5.2** para que o rodapé e os releases reflitam o estado atual.
- **Conformidade:** O spec project-docs exige que cada release versionada tenha secção no CHANGELOG e que a versão no frontend (package.json) seja atualizada ao preparar uma release.

## What Changes

- **docs/changelog/CHANGELOG.md:** Inserir secção **## [2.5.2]** no topo (acima de `## [2.5.1]`), com bullets para: (1) notify-session-expired-and-redirect-to-home — descrição breve; (2) move-story-type-error-below-form-buttons — descrição breve; (3) Documentação e versão: CHANGELOG [2.5.2]; versão no frontend 2.5.2; README secção 4 com tag v2.5.2.
- **frontend/package.json:** Alterar o campo `version` de `"2.5.1"` para `"2.5.2"`.
- **README.md:** Na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags, incluir **v2.5.2** (ex.: … `v2.5.1`, `v2.5.2`).

## Goals

- O ficheiro **docs/changelog/CHANGELOG.md** contém a secção **## [2.5.2]** no topo, com as alterações desta release e o item de documentação e versão.
- O **frontend/package.json** tem `version` **2.5.2** para que o rodapé exiba a versão correta após o build.
- O **README** secção 4 inclui a tag **v2.5.2** na lista de exemplos de tags de release.

## Scope

- **In scope:** CHANGELOG [2.5.2], package.json 2.5.2, README secção 4; spec delta em project-docs.
- **Out of scope:** Alterações de código além da versão no package.json.

## Affected code and docs

- **docs/changelog/CHANGELOG.md** — nova secção [2.5.2] no topo.
- **frontend/package.json** — campo `version`: 2.5.1 → 2.5.2.
- **README.md** — secção 4: incluir v2.5.2 na lista de tags.
- **openspec/changes/update-docs-and-changelog-for-v2-5-2/specs/project-docs/spec.md** — delta que exige a secção [2.5.2] e a versão 2.5.2.

## Dependencies and risks

- **Dependências:** Nenhuma. As changes notify-session-expired-and-redirect-to-home e move-story-type-error-below-form-buttons estão aplicadas.
- **Riscos:** Nenhum.

## Success criteria

- Ao abrir **docs/changelog/CHANGELOG.md**, a secção **## [2.5.2]** aparece no topo e lista as duas changes com descrição breve e o item de documentação e versão.
- O **frontend/package.json** tem `"version": "2.5.2"`.
- O **README** secção 4 inclui **v2.5.2** na lista de exemplos de tags.
- `openspec validate update-docs-and-changelog-for-v2-5-2 --strict` passa.
