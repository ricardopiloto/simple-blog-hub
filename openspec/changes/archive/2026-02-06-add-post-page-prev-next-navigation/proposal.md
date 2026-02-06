# Change: Navegação anterior/próximo no final da página do post

## Why

Na página de leitura de um artigo (`/post/:slug`), o leitor vê o conteúdo e a descrição do autor no final. Não existe forma de avançar ou recuar na narrativa sem voltar ao Índice ou à lista de artigos. O comportamento desejado é: **ao final da página do post**, exibir duas opções de navegação — **à esquerda**, link para o **post anterior** na ordem da história, e **à direita**, link para o **próximo post** — usando a mesma ordenação definida pelos autores no Índice (`story_order`), considerando apenas posts publicados.

## What Changes

- **Frontend**: Na página do artigo (`PostPage.tsx`), após o conteúdo e a secção de descrição do autor, adicionar uma secção de navegação com dois links:
  - **Esquerda**: "Post anterior" (ou equivalente) que leva ao post imediatamente anterior na ordem narrativa (menor `story_order`). Exibido apenas quando existir um post anterior (ou seja, o artigo atual não é o primeiro na ordem).
  - **Direita**: "Próximo post" (ou equivalente) que leva ao post imediatamente seguinte na ordem narrativa (maior `story_order`). Exibido apenas quando existir um próximo (o artigo atual não é o último).
- **Dados**: A ordem usada é a dos posts **publicados** ordenados por `story_order`, já exposta pelo BFF em **GET /bff/posts?order=story**. O frontend utiliza o hook existente `usePostsByStoryOrder()` para obter essa lista, localiza o post atual pelo `slug` e deriva o anterior (índice - 1) e o próximo (índice + 1). Nenhum endpoint novo é necessário.
- **Comportamento**: Se o post atual não estiver na lista (ex.: rascunho acessado por link direto), a secção de navegação pode ser omitida. Se for o primeiro da lista, só o link "Próximo post" é exibido; se for o último, só "Post anterior".
- **Spec**: Capability **post-reading**: ADDED requirement que a página do artigo exiba, no final, links para o post anterior e para o próximo post na ordem narrativa (story_order dos autores), considerando apenas publicados.

## Impact

- Affected specs: **post-reading** (ADDED requirement).
- Affected code: `src/pages/PostPage.tsx` (nova secção de navegação; uso de `usePostsByStoryOrder()` para obter lista e calcular prev/next). Nenhuma alteração na API ou no BFF.
