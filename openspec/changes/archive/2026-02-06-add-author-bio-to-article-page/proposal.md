# Change: Exibir descrição do autor no final da página do artigo

## Why

Na página de leitura de um artigo (`/post/:slug`), o leitor vê o título, a data, o autor (nome e avatar no topo) e o conteúdo. Falta exibir de forma explícita a **descrição do autor** (a mesma frase breve que o autor configura na tela de Contas, ex.: «Sonhador e amante de contos e RPG») **no final da página**, depois do texto do artigo, para dar contexto e identidade ao autor.

## What Changes

- **Backend**: A resposta pública do post (GET por slug) já inclui o autor com `name`, `avatar` e `bio`. Nenhuma alteração obrigatória na API/BFF; garantir que o DTO do post inclui `author.bio` na resposta de leitura pública.
- **Frontend**: Na página do artigo (`PostPage`), **depois** do bloco de conteúdo (HTML do artigo), exibir uma secção **Descrição do autor** com o nome do autor, avatar (se houver) e o texto da descrição (`author.bio`). Essa descrição é a mesma configurável em Contas (perfil). Se o autor não tiver descrição (`bio` vazio ou nulo), a secção não é exibida ou é omitida de forma elegante.
- **Spec**: Nova capability **post-reading**: requisito de que a página do artigo exiba a descrição do autor no final, após o conteúdo.

## Impact

- Affected specs: **post-reading** (new capability, ADDED).
- Affected code: `src/pages/PostPage.tsx` (garantir secção de autor com bio após o conteúdo); opcionalmente `openspec/project.md` e README (mencionar que a página do artigo mostra a descrição do autor no final). Backend já expõe `author.bio` no DTO do post.
