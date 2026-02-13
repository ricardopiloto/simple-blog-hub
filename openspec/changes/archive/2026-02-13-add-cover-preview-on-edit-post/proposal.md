# Proposal: Mostrar preview da imagem de capa apenas em Editar post

## Summary

No formulário de **Editar post**, o autor pode alterar a URL da imagem de capa ou enviar um ficheiro, mas atualmente **não vê** uma pré-visualização da imagem — apenas o campo de texto com a URL. Isto torna difícil confirmar visualmente se a capa está correta antes de guardar. Este change adiciona um **preview** da imagem de capa no formulário, exibido **somente quando o utilizador está em "Editar post"** (rota de edição de um post existente), e não no formulário "Novo post". Quando existir uma URL de capa (carregada do post ou definida após upload/paste), o sistema exibe uma miniatura ou imagem de preview (ex.: proporção 16:9, tamanho limitado) na secção da imagem de capa, de forma que o autor veja como a capa ficará. No "Novo post" o preview **não** é exibido (conforme pedido: "somente quando o usuário entrar em Editar post").

## Goals

- **Editar post**: Na página de edição de um post (ex.: `/area-autor/posts/:id/editar`), quando há uma URL de imagem de capa (do post carregado ou definida pelo utilizador após upload ou colagem), o sistema **DEVE** exibir um **preview** visual dessa imagem (ex.: `<img>` com a URL, dimensões máximas e aspect ratio adequado) na secção "URL da imagem de capa", para que o autor confira a capa antes de guardar.
- **Novo post**: Na página "Novo post", o preview da imagem de capa **NÃO** deve ser exibido (apenas o campo URL e o upload continuam como hoje).

## Scope

- **In scope**: (1) **Frontend — PostEdit.tsx**: Quando `!isNew` (editar post) e o estado `coverImage` (ou o equivalente) tiver um valor não vazio, renderizar um elemento de preview (ex.: `<img>`) que exiba a imagem dessa URL, posicionado na secção da imagem de capa (ex.: acima ou abaixo do campo URL e do input de upload). A URL pode ser absoluta (https://...) ou relativa (ex.: /images/posts/xxx.jpg); no caso relativo, o frontend deve resolver para o origin ou para `VITE_BFF_URL` conforme o padrão do projeto. Tratar falha de carregamento da imagem (ex.: não mostrar nada ou placeholder) sem quebrar o layout. (2) **Spec post-edit-form**: Novo requisito ADDED com cenário: preview da capa apenas em Editar post.
- **Out of scope**: Alterar o fluxo de upload ou a API; adicionar preview no "Novo post"; alterar a exibição da capa nas páginas públicas (já existente).

## Affected code and docs

- **frontend/src/pages/PostEdit.tsx**: Condicionalmente (quando `!isNew` e `coverImage` não vazio) renderizar um bloco de preview com `<img src={...}>` (ou URL resolvida para relativos), com classes de tamanho/aspect ratio (ex.: max-height, object-cover 16:9) para não dominar o formulário.
- **openspec/changes/add-cover-preview-on-edit-post/specs/post-edit-form/spec.md**: ADDED requirement e cenário.

## Dependencies and risks

- **Nenhum**: Alteração apenas no frontend, na página de edição; sem mudanças de API ou de dados. URLs relativas (ex.: /images/posts/...) devem ser resolvidas para o mesmo origin em produção (o frontend é servido no mesmo domínio), ou usando a base URL configurada (VITE_BFF_URL ou window.location.origin) conforme o projeto.

## Success criteria

- Em "Editar post", quando o post tem `cover_image` ou o utilizador cola/upload uma URL de capa, é exibido um preview visual da imagem na secção da capa.
- Em "Novo post", não é exibido preview (comportamento inalterado).
- `openspec validate add-cover-preview-on-edit-post --strict` passa.
