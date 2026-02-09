# Tasks: add-app-version-in-footer

## 1. Build – expor versão

- [x] 1.1 Em `frontend/vite.config.ts`, injetar a versão da aplicação em tempo de build: ler o `version` do `package.json` do frontend (e opcionalmente permitir override por `VITE_APP_VERSION`) e definir uma constante global (ex.: `__APP_VERSION__`) via `define`, de forma a que o código do frontend possa usar essa constante.
- [x] 1.2 Se usar `__APP_VERSION__`, declarar o tipo em `frontend/src/vite-env.d.ts` (ou no ficheiro de declarações de ambiente existente): `declare const __APP_VERSION__: string;` para que o TypeScript reconheça a variável.

## 2. Frontend – rodapé

- [x] 2.1 Em `frontend/src/components/layout/Footer.tsx`, adicionar a exibição da versão atual: usar a constante injetada (ou `import.meta.env.VITE_APP_VERSION` com fallback). Exibir em texto discreto (ex.: "Versão X.Y" ou "vX.Y") numa linha do rodapé (ex.: abaixo do copyright ou junto ao link do GitHub). Se a versão for "0.0.0" ou indefinida, exibir "Versão dev" ou omitir a linha, conforme decisão de implementação.
- [x] 2.2 Garantir que o estilo (ex.: `text-xs text-muted-foreground`) mantém o rodapé legível e a versão não domina visualmente.

## 3. Fonte única (package.json)

- [x] 3.1 Documentar no README ou em comentário que a versão exibida no rodapé vem do `package.json` do frontend (e/ou de `VITE_APP_VERSION` à build) e que, ao preparar uma release, se deve atualizar o `version` no `package.json` antes do build para que o rodapé mostre a versão correta. Opcional: alinhar o valor com as tags de release (ex.: 1.7.0 para a release v1.7).

## 4. Spec delta

- [x] 4.1 Em `openspec/changes/add-app-version-in-footer/specs/branding/spec.md` (ou nova spec se preferir), ADDED requirement: o rodapé deve exibir a versão atual da aplicação (ex.: "Versão 1.7" ou "v1.7"), obtida em tempo de build a partir de uma única fonte (ex.: package.json ou variável de ambiente). A versão deve atualizar-se automaticamente quando se faz um novo build com a fonte atualizada. Incluir cenário: utilizador vê o rodapé e identifica a versão exibida; após release e build com versão atualizada, o rodapé mostra a nova versão.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-app-version-in-footer --strict` e corrigir falhas.
