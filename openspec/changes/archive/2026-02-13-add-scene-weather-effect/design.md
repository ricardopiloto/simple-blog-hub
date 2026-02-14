# Design: Efeito de clima na leitura (chuva/neve)

## Contexto

O conteúdo do post chega ao frontend como **HTML** (já convertido de Markdown no backend). A deteção deve ser feita no **texto plano** extraído desse HTML (strip tags) para evitar falsos positivos em atributos ou markup. O efeito deve ser **apenas visual**, sem bloquear cliques (pointer-events: none no overlay).

## Deteção

- **Quando**: Após o post estar carregado e o conteúdo renderizado (ou disponível em `post.content`). Pode ser num `useEffect` que observa `post?.content`.
- **Onde**: No cliente (PostPage ou hook/util). Extrair texto: criar um elemento temporário (ou usar API DOM), definir innerHTML com o conteúdo sanitizado, ler `textContent` (ou equivalente) e normalizar (ex.: lowercase, normalizar espaços).
- **Palavras-chave**: A lista **deve** incluir **sinónimos** e **conjugações verbais** de chuva e neve, de forma a identificar **qualquer variação** no texto. Para **chuva**: substantivo e variantes (chuva, chuvas, chuvoso, chuvosa), verbos (chover, chove, chovem, chovia, choviam, choveu, choveram, chovendo, chovido), e equivalentes em inglês (rain, rains, raining, rained, rainy). Para **neve**: substantivo e variantes (neve, neves, nevasca, nevado, nevada), verbos (nevar, neva, nevam, nevava, nevavam, nevou, nevaram, nevando), e equivalentes em inglês (snow, snows, snowing, snowed, snowy). Correspondência por palavra inteira (word boundary) para evitar falsos positivos. Prioridade: **neve** sobre chuva quando ambos presentes.
- **Prioridade**: Se o texto contiver palavras de ambos os tipos, usar uma regra fixa (ex.: **neve tem prioridade** sobre chuva) para exibir apenas um efeito.

## Efeito visual

- **Tipo**: Overlay fixo ou relativo ao article/container do post, com `position: absolute` (ou fixed) e `pointer-events: none`, por cima da área de leitura.
- **Implementação**: CSS (animação de partículas com pseudo-elementos ou divs) ou canvas 2D. Objetivo: **simples e leve** — algumas dezenas de partículas (gotas ou flocos), opacidade baixa (ex.: 0.15–0.25), animação suave.
- **Acessibilidade**: O efeito é decorativo; não deve ser essencial para compreender o conteúdo. Considerar `aria-hidden="true"` no container do efeito.
- **Performance**: Evitar repaints excessivos; usar `will-change` com moderação ou requestAnimationFrame no canvas; desligar animação quando a página não está visível (Page Visibility API) se necessário.

## Preferência do utilizador (ativar/desativar efeitos)

- **Onde**: Preferência **global** (aplica-se a todas as páginas de artigo do blog). Persistida em **localStorage** (ex.: chave `scene-effects-enabled`, valor `"true"` | `"false"`). Valor por defeito: **ativado** (true) para utilizadores que nunca alteraram a opção.
- **Controlo**: Um **botão no header**, ao lado do botão de tema (light/dark), no mesmo estilo (Button variant="ghost" size="icon"). Ícone que indique estado: efeitos ativados (ex.: ícone de nuvem/chuva ou "efeitos on") vs efeitos desativados (ex.: ícone riscado ou "efeitos off"). Ao clicar, alterna o valor e persiste em localStorage.
- **Contexto**: Criar um contexto (ex.: `SceneEffectsContext`) ou um hook que exponha `sceneEffectsEnabled: boolean` e `toggleSceneEffects: () => void`, lendo/gravando em localStorage e fornecendo o estado à árvore (Header e PostPage). O provider deve ficar ao nível do App (como o ThemeProvider).

## Integração em PostPage

- Após renderizar o conteúdo do post, executar a deteção.
- **Só** se `sceneEffectsEnabled` for true **e** o resultado for "rain" ou "snow", renderizar `<SceneWeatherEffect type="rain" />` ou `<SceneWeatherEffect type="snow" />` dentro do article.
- O componente não recebe o conteúdo; apenas o tipo (rain | snow) e opcionalmente uma prop de opacidade.

## Ficheiros sugeridos

- `frontend/src/lib/sceneWeather.ts`: função `detectSceneWeather(htmlContent: string): 'rain' | 'snow' | null`.
- `frontend/src/components/blog/SceneWeatherEffect.tsx`: overlay com efeito de chuva ou neve.
- `frontend/src/contexts/SceneEffectsContext.tsx` (ou nome equivalente): contexto com `sceneEffectsEnabled` e `toggleSceneEffects`, persistência em localStorage.
- `frontend/src/components/layout/Header.tsx`: adicionar botão de toggle de efeitos ao lado do botão de tema (desktop e mobile).

Nenhuma alteração na API ou BFF.
