# Change: Remover favicon do Lovable e usar ícone do dado

## Why

O arquivo `public/favicon.ico` ainda é o ícone em forma de coração do Lovable. Remover esse favicon e usar o ícone de d20 já usado no logo (game-icons.net, Delapouite, CC BY 3.0) como favicon da página, alinhando a aba do navegador à identidade do 1noDado RPG.

## What Changes

- **index.html**: Adicionar `<link rel="icon" href="/dice-icon.svg" type="image/svg+xml">` no `<head>` para que o favicon seja o ícone do dado (já existente em `public/dice-icon.svg`).
- **public/favicon.ico**: Remover o arquivo (ícone do Lovable). Navegadores que suportam favicon SVG usarão o dice-icon.svg; quem solicitar apenas `/favicon.ico` deixará de receber o coração (pode aparecer ícone padrão do browser até que se adicione um favicon.ico alternativo no futuro, se desejado).

## Impact

- Affected specs: branding (favicon alinhado ao logo do blog).
- Affected code: `index.html`, remoção de `public/favicon.ico`.
