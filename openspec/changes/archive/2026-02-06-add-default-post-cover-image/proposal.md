# Change: Imagem de capa padrão para posts sem capa

## Why

Quando o autor não informa uma imagem de capa para o post, a interface deixa de exibir o bloco de imagem na página inicial, na listagem, no post individual e no índice. Isso quebra a estética e a consistência visual. Usar uma imagem padrão mantém o layout uniforme e a experiência do leitor.

## What Changes

- Definir uma URL de imagem de capa padrão (ex.: asset estático no frontend, como `/placeholder.svg` ou uma imagem temática do blog).
- Nos componentes que exibem a capa do post (FeaturedPost, PostCard, PostPage, StoryIndex), quando `post.cover_image` for nulo ou vazio, usar essa imagem padrão em vez de omitir o bloco de imagem.
- Nenhuma alteração no backend ou no modelo de dados; a lógica é apenas no frontend ao renderizar.

## Impact

- Affected specs: nova capacidade **post-cover-display** (comportamento de exibição da capa).
- Affected code: `src/components/blog/FeaturedPost.tsx`, `src/components/blog/PostCard.tsx`, `src/pages/PostPage.tsx`, `src/pages/StoryIndex.tsx`; opcionalmente um helper ou constante compartilhada para a URL padrão.
