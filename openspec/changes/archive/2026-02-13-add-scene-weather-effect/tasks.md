# Tasks: add-scene-weather-effect

Lista ordenada de itens de trabalho.

## 1. Preferência do utilizador (ativar/desativar efeitos)

- [x] 1.1 Criar contexto (ex.: `frontend/src/contexts/SceneEffectsContext.tsx`) que expõe `sceneEffectsEnabled: boolean` e `toggleSceneEffects: () => void`. Ler/gravar preferência em localStorage (ex.: chave `scene-effects-enabled`, valores `"true"` | `"false"`). Valor por defeito: **true** (efeitos ativados). Envolver a app com o provider (ex.: em App.tsx, ao nível do ThemeProvider).

- [x] 1.2 No Header (`frontend/src/components/layout/Header.tsx`), adicionar um botão ao lado do botão de tema (light/dark), com o **mesmo estilo** (Button variant="ghost" size="icon"). Ícone que indique estado (efeitos ativados vs desativados; ex.: CloudRain ou CloudOff do Lucide). Ao clicar, chamar `toggleSceneEffects`. Incluir o botão tanto na área desktop como no bloco mobile (ao lado do botão de tema).

## 2. Deteção de clima no texto do post

- [x] 2.1 Criar função (ex.: em `frontend/src/lib/sceneWeather.ts`) que recebe o HTML do conteúdo do post, extrai texto plano (strip tags), normaliza (ex.: lowercase) e procura por palavras-chave de **chuva** e **neve**. Retornar `'rain' | 'snow' | null`; se ambos presentes, retornar `'snow'` (prioridade neve).

- [x] 2.2 Alargar as listas de palavras em `sceneWeather.ts` para incluir **sinónimos** e **conjugações verbais**: chuva (chuva, chuvas, chuvoso, chovendo, chove, choveu, chovia, chover, etc.) e neve (neve, neves, nevando, neva, nevou, nevasca, nevar, etc.), além de equivalentes em inglês (rain, rains, raining, rained, snowy, snow, snowing, snowed), de forma a identificar qualquer variação de chuva ou neve no texto.

## 3. Componente de efeito visual

- [x] 3.1 Criar componente `SceneWeatherEffect` (ex.: `frontend/src/components/blog/SceneWeatherEffect.tsx`) que recebe `type: 'rain' | 'snow'` e opcionalmente `opacity`. Renderizar overlay com `pointer-events: none` e `aria-hidden="true"`, com efeito discreto (chuva: gotas em queda; neve: flocos). Usar CSS e/ou canvas; opacidade baixa (ex.: 0.15–0.25) por defeito.

## 4. Integração na página do artigo

- [x] 4.1 Em `PostPage.tsx`, após o post estar disponível e o conteúdo renderizado, chamar a função de deteção com `post.content`. **Só se** `sceneEffectsEnabled` for true **e** o resultado for `'rain'` ou `'snow'`, renderizar `<SceneWeatherEffect type={result} />` na área do article (ex.: como overlay sobre o container do conteúdo), sem bloquear interação.

## 5. Spec e validação

- [x] 5.1 Confirmar que o spec delta em `openspec/changes/add-scene-weather-effect/specs/post-reading/spec.md` está completo (dois requisitos ADDED e cenários, incluindo utilizador desativou efeitos e controlo no header).
- [x] 5.2 Executar `openspec validate add-scene-weather-effect --strict` e corrigir até passar.
