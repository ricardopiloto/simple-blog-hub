# Tasks: Navegação anterior/próximo no final da página do post

## 1. Frontend – dados e lógica

- [x] 1.1 Em `PostPage.tsx`, além de `usePost(slug)`, usar o hook `usePostsByStoryOrder()` para obter a lista de posts publicados ordenados por `story_order` (GET /bff/posts?order=story).
- [x] 1.2 Calcular o índice do post atual na lista (por `slug` ou `id`). Se o post atual não estiver na lista (ex.: rascunho), não exibir a secção de navegação.
- [x] 1.3 Derivar `prevPost = list[index - 1]` e `nextPost = list[index + 1]` (quando existirem).

## 2. Frontend – UI

- [x] 2.1 Após a secção de descrição do autor (e antes do fecho do `container-blog`), adicionar uma secção de navegação (ex.: barra horizontal ou dois blocos lado a lado) com:
  - À esquerda: link "Post anterior" (ou "← Post anterior") que navega para `/post/{prevPost.slug}`, exibido apenas quando `prevPost` existir.
  - À direita: link "Próximo post" (ou "Próximo post →") que navega para `/post/{nextPost.slug}`, exibido apenas quando `nextPost` existir.
- [x] 2.2 Opcionalmente exibir o título do post anterior/próximo nos links para melhor contexto. Manter acessibilidade (texto claro, uso de `Link` do React Router).

## 3. Validação

- [x] 3.1 Build do frontend. Testar manualmente: abrir um post que seja o primeiro na ordem → só "Próximo post" visível; abrir um post no meio → "Post anterior" e "Próximo post" visíveis; abrir o último → só "Post anterior" visível; clicar em cada link e confirmar que navega para o artigo correto pela ordem do Índice.
- [x] 3.2 Confirmar que a ordem usada coincide com a do Índice da História (posts publicados por `story_order`).
