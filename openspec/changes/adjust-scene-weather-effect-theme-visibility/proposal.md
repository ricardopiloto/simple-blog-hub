# Proposal: Diferenciação de cores dos efeitos chuva/neve por tema (visibilidade no modo claro)

## Summary

Os efeitos visuais de **chuva** e **neve** na página do artigo usam atualmente a cor de primeiro plano do tema (`bg-foreground`) e opacidade fixa. No **modo escuro** a visualização já é adequada; no **modo claro** a chuva e a neve ficam pouco visíveis. Este change ajusta o componente **SceneWeatherEffect** para **diferenciar por tema**: (1) **Modo escuro** — mantém o comportamento atual (cor e opacidade existentes); (2) **Modo claro** — utiliza cor e/ou opacidade que garantam **melhor visualização** das partículas (ex.: cor mais escura que contraste com o fundo claro, ou opacidade ligeiramente superior), para que a chuva e a neve sejam facilmente visíveis sem deixar de ser discretas.

## Why

- **Experiência:** No tema claro, partículas com `bg-foreground` e opacidade baixa podem confundir-se com o fundo, prejudicando a leitura da “atmosfera” da cena.
- **Consistência:** O tema claro e o tema escuro devem oferecer uma experiência equivalente: efeito visível mas discreto em ambos.

## What Changes

- **frontend/src/components/blog/SceneWeatherEffect.tsx:** Passar a consumir o **tema ativo** (ex.: via `useTheme()` do ThemeContext). Consoante o tema: **dark** — manter as classes atuais (`bg-foreground`) e opacidade (ex.: 0.2); **light** — aplicar uma classe de cor que contraste com fundo claro (ex.: `bg-slate-600` ou `bg-neutral-600`) e, se necessário, opacidade ligeiramente maior (ex.: 0.35–0.4) para chuva e neve mais visíveis. O efeito continua discreto e não bloqueia a interação (pointer-events-none mantido).
- **Spec post-reading:** Atualizar o requisito do efeito de clima para indicar que o efeito SHALL ter **diferenciação por tema** (claro vs. escuro) de forma a garantir boa visualização em ambos os modos; no modo escuro mantém-se o atual; no modo claro as partículas devem ser claramente visíveis.

## Goals

- Modo escuro: comportamento e aparência atuais mantidos.
- Modo claro: chuva e neve mais fáceis de ver (cor e/ou opacidade ajustadas).
- Efeito continua discreto e não intrusivo em ambos os temas.

## Scope

- **In scope:** Alteração apenas em SceneWeatherEffect.tsx (uso do tema e classes/estilos condicionais); delta no spec post-reading.
- **Out of scope:** Alterar deteção de chuva/neve, controlo no header, animações ou número de partículas; suporte a tema “system” além do valor efetivo (light/dark) já aplicado no DOM.

## Affected code and docs

- **frontend/src/components/blog/SceneWeatherEffect.tsx** — importar useTheme; aplicar classes ou opacidade consoante theme === 'light' | 'dark'.
- **openspec/changes/adjust-scene-weather-effect-theme-visibility/specs/post-reading/spec.md** — delta MODIFIED no requisito do efeito de clima.

## Success criteria

- Com tema escuro ativo, o efeito de chuva/neve mantém a aparência atual.
- Com tema claro ativo, a chuva e a neve são claramente mais visíveis (cor mais escura e/ou opacidade maior).
- `openspec validate adjust-scene-weather-effect-theme-visibility --strict` passa.
