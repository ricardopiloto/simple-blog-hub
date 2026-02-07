# Proposal: Orientação de tamanho e enquadramento da imagem de capa do post

## Summary

Ajustar a experiência da **imagem de capa** do post em dois eixos: (1) **Texto no formulário** — informar ao autor o tamanho ou proporção ideal para que a imagem não seja cortada na visualização; (2) **Enquadramento na exibição** — garantir que a capa seja exibida de forma consistente e correta dentro dos limites visuais atuais (proporção fixa, object-fit e posicionamento definidos).

## Goals

- **Orientação no formulário**: Junto ao campo de URL/upload da imagem de capa, exibir um texto que indique a proporção recomendada (ex.: 16:9) e, opcionalmente, dimensões em pixels (ex.: 1200×675) para que o autor possa preparar a imagem e evitar que partes importantes sejam cortadas.
- **Enquadramento consistente**: A capa deve ser exibida com proporção fixa (16:9 onde o layout já a usa — página do post, cards da lista, índice da história), com `object-fit: cover` e `object-position: center` para que o enquadramento seja previsível e a imagem fique corretamente disposta dentro do limite de visualização.

## Scope

- **In scope**: (1) **Frontend – formulário (PostEdit)**: Adicionar texto de ajuda próximo ao campo "URL da imagem de capa" (e ao upload) com a proporção recomendada (16:9) e, se desejado, dimensões sugeridas (ex.: 1200×675 px) para não cortar a imagem. (2) **Frontend – exibição**: Garantir que todos os locais que exibem a capa com proporção 16:9 (página do post, PostCard, StoryIndex) usem `object-cover` e `object-position: center` (ou equivalente) para enquadramento consistente; documentar no spec que a proporção de exibição é 16:9 nesses contextos. O bloco de destaque na página inicial usa 4/3 — pode manter-se; o importante é que o comportamento seja explícito e estável. (3) **Spec deltas**: post-edit-form (ADDED – orientação de tamanho/proporção); post-cover-display (MODIFIED – enquadramento e proporção de exibição).
- **Out of scope**: Redimensionamento ou crop automático no upload; alterar a proporção do bloco de destaque (4/3) para 16:9; suporte a múltiplas proporções por contexto.

## Affected code and docs

- **frontend/src/pages/PostEdit.tsx**: Inserir texto de ajuda (ex.: "Proporção recomendada 16:9 (ex.: 1200×675 px) para não cortar a imagem na visualização.") junto ao label/campo da imagem de capa.
- **frontend/src/pages/PostPage.tsx**, **frontend/src/components/blog/PostCard.tsx**, **frontend/src/pages/StoryIndex.tsx**: Confirmar ou adicionar `object-center` (ou classe equivalente) nas imagens de capa que usam `object-cover` e aspect 16:9.
- **openspec/changes/add-cover-size-guidance-and-framing/specs/post-edit-form/spec.md**: ADDED – requisito de orientação de tamanho/proporção no formulário.
- **openspec/changes/add-cover-size-guidance-and-framing/specs/post-cover-display/spec.md**: MODIFIED – requisito de enquadramento e proporção de exibição.

## Dependencies and risks

- Nenhuma dependência de backend ou migração. Alterações apenas no frontend e nos specs.
- Risco baixo: texto novo e pequenos ajustes de CSS (object-position) se ainda não estiver explícito.

## Success criteria

- No formulário de novo/editar post, o autor vê texto claro com a proporção recomendada (16:9) e dimensões sugeridas para a imagem de capa.
- Na página do post, em cards de lista e no índice da história, a capa é exibida com proporção 16:9, object-cover e posicionamento central, de forma consistente.
- `openspec validate add-cover-size-guidance-and-framing --strict` passa.
