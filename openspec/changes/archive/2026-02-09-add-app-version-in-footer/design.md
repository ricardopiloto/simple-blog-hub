# Design: Versão da aplicação no rodapé

## Fonte da versão

- **Opção A (recomendada):** Campo `version` do `package.json` do frontend. No `vite.config.ts`, usar `define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version || require('./package.json').version) }` (ou em ESM ler o package.json e injetar). O npm define `process.env.npm_package_version` quando executa scripts no contexto do projeto. Assim, ao fazer `npm run build`, a versão vem do `package.json`.
- **Opção B:** Variável de ambiente `VITE_APP_VERSION` à build. O Vite expõe variáveis `VITE_*` em `import.meta.env.VITE_APP_VERSION`. No build de release, o pipeline pode definir `VITE_APP_VERSION=1.7` e o Footer usa esse valor; se não estiver definida, fallback para `package.json` ou para "dev".
- **Recomendação:** Usar `package.json` como fonte principal; opcionalmente permitir override com `VITE_APP_VERSION` para que deploys possam injetar a versão sem alterar o repo (ex.: em CI, definir a partir da tag git). Implementação mínima: ler `version` do package.json no vite.config e definir `__APP_VERSION__`; no Footer, exibir `__APP_VERSION__` (ou, se usar env, `import.meta.env.VITE_APP_VERSION` com fallback).

## Formato no rodapé

- Texto discreto, por exemplo: "Versão 1.7" ou "v1.7". Colocação: numa nova linha abaixo do copyright ou junto ao link do GitHub, em `text-xs text-muted-foreground` para não competir com o resto do conteúdo.
- Se a versão for "0.0.0" ou indefinida, exibir "Versão dev" ou não exibir a linha (evitar confusão em desenvolvimento).

## TypeScript

- Se usar `define: { __APP_VERSION__: ... }`, declarar o global em `vite-env.d.ts` (ou equivalente): `declare const __APP_VERSION__: string;` para que o Footer não acuse erro de tipo.

## Manutenção no release

- Ao preparar uma release (ex.: v1.7), o maintainer atualiza o `version` no `frontend/package.json` para "1.7.0" (ou "1.7") e faz o build; o rodapé passa a mostrar essa versão. O CHANGELOG já segue [1.7]; a versão no rodapé fica alinhada com a secção do CHANGELOG.
