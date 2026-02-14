# project-docs — delta for ensure-version-footer-updated-on-release

## ADDED Requirements

### Requirement: Versão no rodapé atualizada ao preparar uma release (SHALL)

Ao preparar uma **release versionada** (tag, ex.: v2.1, v2.2), o repositório **deve** (SHALL) garantir que a **versão exibida no rodapé** do site corresponda a essa release. Para isso, o campo **`version`** em **`frontend/package.json`** **deve** ser atualizado para o valor da release (ex.: `"2.1.0"`) **antes** do build do frontend para produção. A versão é injetada em build pelo Vite (a partir de `npm_package_version` ou `VITE_APP_VERSION`) e exibida no componente Footer; se o campo não for atualizado, o rodapé continuará a mostrar a versão anterior. O **README** (na secção de links para CHANGELOG ou de versionamento) **deve** referir explicitamente que, ao preparar uma release, se deve atualizar o campo `version` em `frontend/package.json` antes do build.

#### Scenario: Release v2.1 preparada com versão correta no rodapé

- **Dado** que a equipa prepara uma release com tag v2.1
- **Quando** o campo `version` em `frontend/package.json` é atualizado para `"2.1.0"` e o frontend é construído (`npm run build`)
- **Então** o rodapé do site exibe "Versão 2.1.0" (ou equivalente) após o deploy
- **E** o README menciona que ao preparar uma release se deve atualizar esse campo antes do build
