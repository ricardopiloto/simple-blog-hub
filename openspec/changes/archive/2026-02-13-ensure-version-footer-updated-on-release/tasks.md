# Tasks: ensure-version-footer-updated-on-release

Lista ordenada de itens de trabalho.

## 1. Spec delta project-docs

- [x] 1.1 Em `openspec/changes/ensure-version-footer-updated-on-release/specs/project-docs/spec.md`, adicionar requisito ADDED: ao preparar uma **release versionada** (tag, ex.: v2.1), o campo **`version`** em **`frontend/package.json`** **DEVE** ser atualizado para refletir essa release, de forma que a **versão exibida no rodapé** do site (injetada em build pelo Vite como `__APP_VERSION__`) corresponda à release deployada. O README **DEVE** referir, na secção de links para CHANGELOG ou na descrição do versionamento, que ao preparar uma release se deve atualizar esse valor antes do build. Cenário: preparação de release v2.1 → atualizar `version` em frontend/package.json para "2.1.0" → após build, o rodapé exibe "Versão 2.1.0".

## 2. README: referência explícita ao atualizar version

- [x] 2.1 Em `README.md`, na secção 4 (Links para CHANGELOG), garantir que a frase que descreve a origem da versão no rodapé inclui explicitamente que **ao preparar uma release** se deve **atualizar o campo `version` em `frontend/package.json`** antes do build (e que a versão exibida vem desse campo ou de `VITE_APP_VERSION`). Ajustar o texto se a redação atual não for suficientemente clara.

## 3. Validação

- [x] 3.1 Executar `openspec validate ensure-version-footer-updated-on-release --strict` e corrigir eventuais falhas.
