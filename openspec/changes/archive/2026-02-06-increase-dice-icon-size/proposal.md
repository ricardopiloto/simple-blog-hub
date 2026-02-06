# Change: Aumentar o tamanho do ícone do dado no logo

## Why

O ícone do d20 no logo (header e footer) deve ficar um pouco maior para melhor legibilidade e presença visual, mantendo proporção com o texto "noDado RPG".

## What Changes

- **Header**: Aumentar o tamanho do `DiceIcon` no link da marca de `h-6 w-6` para `h-7 w-7` (um passo na escala Tailwind).
- **Footer (marca)**: Aumentar o ícone na área de marca de `h-5 w-5` para `h-6 w-6`.
- **Footer (copyright)**: Aumentar o ícone na linha de copyright de `h-4 w-4` para `h-5 w-5`.

## Impact

- Affected specs: branding (tamanho do ícone no logo).
- Affected code: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` (apenas classes CSS do DiceIcon).
