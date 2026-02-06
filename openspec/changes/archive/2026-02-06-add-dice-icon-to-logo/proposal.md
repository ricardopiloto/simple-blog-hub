# Change: Usar ícone de dado (game-icons.net) no logo do blog "[ícone]noDado RPG"

## Why

Reforçar a identidade do 1noDado RPG exibindo o nome do blog como ícone de d20 + "noDado RPG". O ícone "Dice 20 faces 1" ([game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html), por Delapouite, CC BY 3.0) será usado no header e no footer no lugar do "1" textual, resultando em "[ícone]noDado RPG".

## What Changes

- **Asset do ícone**: Incluir o SVG do ícone no projeto (ex.: `public/dice-icon.svg` ou `src/assets/dice-icon.svg`). Fonte: [Dice 20 faces 1](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html) — Delapouite, CC BY 3.0. Usar variante que funcione com tema claro/escuro (ex.: traço preto em fundo transparente para colorir com `currentColor`).
- **Header e Footer**: Exibir o logo como ícone + texto "noDado RPG" (sem o "1" antes). O ícone deve aparecer à esquerda do texto, alinhado visualmente, no link da marca do Header e na área de marca e no copyright do Footer. Tamanho do ícone proporcional ao texto (ex.: mesma altura da linha do título).
- **Atribuição**: Incluir atribuição do ícone (autor e licença CC BY 3.0), por exemplo no rodapé do site ou no README (link para game-icons.net e autor Delapouite).
- **Documentação**: Mencionar em `openspec/project.md` que o logo do blog usa o ícone de d20 (game-icons.net) e o texto "noDado RPG".

## Impact

- Affected specs: capacidade `branding` (logo com ícone).
- Affected code: novo asset (SVG), `Header.tsx`, `Footer.tsx`, possivelmente componente reutilizável de Logo; `openspec/project.md`; atribuição no footer ou README. Build e testes do frontend permanecem válidos.
