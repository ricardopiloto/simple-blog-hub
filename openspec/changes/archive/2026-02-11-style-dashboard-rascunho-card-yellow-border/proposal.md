# Borda amarela no card Rascunho do dashboard

## Why

O card **Rascunho** no dashboard da área do autor deve ter um **destaque visual** (borda fina em amarelo) para diferenciá-lo dos demais indicadores e chamar a atenção para o número de posts em rascunho.

## What Changes

1. **Frontend (UI)**  
   No componente que exibe os indicadores do dashboard (ex.: `AreaAutorDashboard.tsx` ou a secção "Visão geral do blog"), o **card que exibe o indicador "Rascunho"** (draft_count) SHALL ter uma **borda fina em amarelo**. Implementação via classe CSS (ex.: Tailwind `border-2 border-yellow-500` ou equivalente que produza borda fina amarela), aplicada apenas a esse card, mantendo o restante do layout e das cores dos outros cards inalterados.

2. **Spec (opcional)**  
   No spec author-area-dashboard, pode ser adicionado um requisito ou nota de que o card Rascunho tem borda amarela fina para distinção visual.

## Goals

- O card "Rascunho" no dashboard da área do autor exibe borda fina amarela.
- Os outros cards mantêm o estilo atual (sem borda amarela).
- Validação OpenSpec passa.

## Out of scope

- Alterar outros estilos do dashboard ou do tema global.
- Alterar backend ou dados.

## Success criteria

- Visualmente, o card Rascunho tem borda fina amarela; os demais cards não.
- `openspec validate style-dashboard-rascunho-card-yellow-border --strict` passa (se houver spec delta).
