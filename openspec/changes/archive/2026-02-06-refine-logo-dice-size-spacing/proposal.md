# Change: Aumentar ainda mais o dado do logo e aproximar o texto do ícone

## Why

Melhorar a presença visual do ícone do d20 no logo e deixar o texto "noDado RPG" um pouco mais próximo do dado, para que o conjunto seja percebido como uma única marca.

## What Changes

- **Tamanho do ícone (mais um passo)**  
  - Header: `DiceIcon` de `h-7 w-7` para `h-8 w-8` (32px).  
  - Footer (marca): de `h-6 w-6` para `h-7 w-7` (28px).  
  - Footer (copyright): de `h-5 w-5` para `h-6 w-6` (24px).

- **Espaçamento ícone–texto**  
  - Header: no link do logo, alterar `gap-2` para `gap-1.5` entre ícone e texto.  
  - Footer (marca): no link da marca, alterar `gap-2` para `gap-1.5`.  
  - Footer (copyright): no span que envolve ícone + "noDado RPG", alterar `gap-1.5` para `gap-1`.

## Impact

- Affected specs: branding (tamanho e espaçamento do logo).
- Affected code: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` (classes do DiceIcon e do gap nos containers do logo).
