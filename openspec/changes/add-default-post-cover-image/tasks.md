# Tasks: Imagem de capa padrão para posts sem capa

## 1. Definição e uso da imagem padrão

- [x] 1.1 Definir URL da imagem de capa padrão (ex.: `/placeholder.svg` ou imagem temática em `public/`) e expor como constante reutilizável (ex.: em `src/lib/constants.ts` ou no próprio componente de post).
- [x] 1.2 Em FeaturedPost, PostCard, PostPage e StoryIndex: quando `post.cover_image` for nulo ou string vazia, usar a URL padrão para o `src` da imagem, mantendo o mesmo layout (sempre exibir o bloco de capa).

## 2. Validação

- [x] 2.1 Build do frontend; verificar visualmente que posts sem capa exibem a imagem padrão na página inicial, lista, post único e índice.
