# Proposal: Efeito de clima (chuva/neve) na leitura quando o texto descreve a cena

## Summary

Quando um leitor abre um artigo (`/post/:slug`), após o carregamento da página o sistema **analisa o texto do conteúdo** em busca de palavras que definam o clima da cena — **apenas chuva ou neve**. A deteção **deve** considerar **sinónimos** e **conjugações verbais** (ex.: chuva, choveu, chovendo, chove, neve, nevou, nevando, neva, nevava), de forma a identificar **qualquer variação** de chuva ou neve no texto. Se identificar alguma dessas palavras e o utilizador **não tiver desativado** os efeitos, é exibido um **efeito visual discreto** em tela (chuva ou neve) durante a leitura. O utilizador pode **ativar ou desativar** os efeitos de clima em todo o site através de um **botão no header** (ao lado do botão de tema claro/escuro); a preferência é **persistida** (ex.: localStorage) e aplica-se a **todas as postagens** do blog.

## Why

- **Objetivo**: Reforçar a imersão na leitura quando o texto descreve chuva ou neve, com um efeito visual simples e não intrusivo.
- **Controlo do utilizador**: Quem não quiser o efeito durante a leitura pode desativá-lo de forma global; o botão segue o mesmo estilo do seletor de tema (light/dark) para consistência.

## What Changes

- **Spec post-reading**: (1) Requisito ADDED: na página de leitura, após o conteúdo estar disponível, o frontend analisa o texto em busca de palavras de **chuva** ou **neve** e, **se o utilizador tiver os efeitos ativados**, exibe efeito discreto (chuva ou neve). (2) Requisito ADDED: o sistema **deve** fornecer um **controlo no header** (botão no mesmo estilo do botão de tema light/dark) para o utilizador **ativar ou desativar** os efeitos de clima; a preferência **deve** ser persistida (ex.: localStorage) e **aplica-se a todas as páginas de artigo** do blog (quando desativada, nenhum post exibe efeito).
- **Frontend**: (1) Deteção e efeito em PostPage (como antes), **condicionados à preferência do utilizador**. (2) Contexto ou hook de preferência (ex.: `sceneEffectsEnabled`, persistido em localStorage). (3) Botão no Header ao lado do botão de tema: mesmo estilo (ghost, icon), ícone que indique "efeitos ativados" vs "efeitos desativados"; ao clicar, alterna a preferência e persiste.

## Goals

- Leitor que abre um post cujo texto menciona chuva ou neve vê um efeito visual suave (chuva ou neve) durante a leitura, **desde que não tenha desativado os efeitos**.
- Utilizador pode desativar os efeitos num único lugar; a opção vale para todas as postagens e persiste entre sessões.
- Botão de ativar/desativar efeitos no header, visualmente alinhado ao botão de tema (light/dark).
- Sem alteração de backend: deteção, efeito e preferência apenas no frontend.

## Scope

- **In scope**: (1) Deteção client-side de palavras de chuva/neve e efeito discreto, **respeitando a preferência do utilizador**. (2) **Preferência global** (efeitos ativados/desativados) persistida em localStorage (ou equivalente). (3) **Botão no header** (mesmo estilo do botão de tema) para alternar essa preferência; aplica-se a todas as páginas de artigo. (4) Spec post-reading: requisitos ADDED e cenários (incl. "utilizador desativou efeitos → nenhum post exibe efeito").
- **Out of scope**: Outros climas (sol, vento, etc.); configuração pelo autor; alteração da API/BFF.

## Affected code and docs

- **openspec/changes/add-scene-weather-effect/specs/post-reading/spec.md**: Delta ADDED com dois requisitos (efeito condicionado à preferência; controlo no header + persistência) e cenários.
- **frontend/src/pages/PostPage.tsx**: Integração da deteção e do componente de efeito, **condicionada à preferência** (efeitos ativados/desativados).
- **frontend/src/components/blog/SceneWeatherEffect.tsx**: overlay com efeito de chuva ou neve (CSS e/ou canvas).
- **frontend/src/components/layout/Header.tsx**: botão para ativar/desativar efeitos (mesmo estilo do botão de tema), ao lado do botão de tema.
- **Preferência**: contexto (ex.: `SceneEffectsContext`) ou hook que lê/grava preferência em localStorage (chave ex.: `scene-effects-enabled`); valor por defeito: ativado (true).

## Dependencies and risks

- **Risco**: Efeito em canvas/animation pode ter impacto em dispositivos fracos; mitigação: efeito leve por defeito (poucas partículas, opacidade baixa) e possível desativação futura.
- Nenhuma dependência de backend.

## Success criteria

- Spec post-reading inclui requisitos para (1) efeito de clima condicionado à preferência e (2) controlo no header com persistência.
- Na página de um post cujo texto contém palavra de chuva/neve e efeitos ativados, o leitor vê o efeito discreto correspondente.
- Quando o utilizador desativa os efeitos no header, nenhuma página de artigo exibe efeito (e a preferência persiste ao recarregar).
- Botão no header, ao lado do tema, permite alternar efeitos; estilo consistente com o botão de tema (ghost, icon).
- `openspec validate add-scene-weather-effect --strict` passa.
