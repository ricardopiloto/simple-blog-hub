# Tasks: adjust-scene-weather-effect-theme-visibility

## 1. SceneWeatherEffect com tema

- [x] 1.1 Em `frontend/src/components/blog/SceneWeatherEffect.tsx`, importar `useTheme` do ThemeContext e obter o tema ativo (`light` | `dark`).

## 2. Estilos condicionais por tema

- [x] 2.1 No modo **escuro**: manter as classes atuais das partículas (`bg-foreground`) e a opacidade default (ex.: 0.2). Não alterar comportamento nem aparência.
- [x] 2.2 No modo **claro**: aplicar às partículas (chuva e neve) uma cor que contraste com o fundo claro (ex.: `bg-slate-600` ou `bg-neutral-600`) e, se necessário, opacidade ligeiramente maior (ex.: 0.35–0.4) de forma que a chuva e a neve sejam claramente visíveis, mantendo o efeito discreto.

## 3. Spec delta post-reading

- [x] 3.1 Em `openspec/changes/adjust-scene-weather-effect-theme-visibility/specs/post-reading/spec.md`, adicionar MODIFIED ao requisito "Efeito visual de clima (chuva ou neve) quando o texto do artigo descreve a cena": o efeito SHALL ter **diferenciação por tema** (claro vs. escuro) para garantir boa visualização em ambos: no modo escuro mantém-se a aparência atual; no modo claro as partículas (chuva e neve) SHALL usar cor e/ou opacidade que as tornem claramente visíveis sobre o fundo claro. Adicionar cenário: com tema claro ativo, o utilizador vê o efeito de chuva/neve com boa visibilidade; com tema escuro, o efeito mantém o comportamento atual.

## 4. Validação

- [x] 4.1 Executar `openspec validate adjust-scene-weather-effect-theme-visibility --strict` e corrigir até passar.
