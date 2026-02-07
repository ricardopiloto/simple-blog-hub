# Proposal: Enquadramento da capa na página do artigo — resize para caber quando fora de 16:9

## Summary

Na **página do Artigo/Post** (post detail page), quando a imagem de capa está **fora do padrão 16:9** (ex.: 4:3, 1:1, vertical), ajustar o código para que a imagem **caiba melhor** no espaço disponível: em vez de cortar com `object-cover`, usar **object-contain** de forma que a imagem seja **redimensionada** (escala) para caber inteiramente dentro do contentor 16:9, sem cortar partes. Qualquer espaço restante (letterboxing/pillarboxing) terá um fundo neutro (ex.: `bg-muted`) para um enquadramento visual consistente. Cards (lista, índice, destaque) mantêm `object-cover` para aparência uniforme dos blocos.

## Goals

- **Página do artigo**: Na vista de leitura do post, a capa deve "caber melhor" quando a imagem não é 16:9: mostrar a **imagem completa** redimensionada para caber no contentor (object-contain), em vez de cortar com object-cover.
- **Resize visual**: O "resize" é feito por CSS (object-fit: contain): o browser escala a imagem para caber no contentor 16:9 sem crop; não é obrigatório processar o ficheiro no servidor nesta change.
- **Resto inalterado**: Lista de posts, índice da história e bloco de destaque continuam com object-cover e aspect fixo para manter o layout dos cards consistente.

## Scope

- **In scope**: (1) **Frontend – PostPage.tsx**: Na secção da imagem de capa do artigo, trocar de `object-cover` para **object-contain** e garantir que o contentor tenha um fundo neutro (ex.: `bg-muted` ou `bg-muted/50`) para as faixas de letterboxing/pillarboxing quando a imagem não preenche todo o 16:9. (2) **Spec post-cover-display**: Adicionar ou ajustar requisito que, na página do post (single post page), a capa seja exibida com object-contain (imagem inteira redimensionada para caber no contentor 16:9) e fundo neutro nas faixas.
- **Out of scope**: Processamento de imagem no servidor (gerar versão 16:9 no upload); alterar object-fit em cards ou índice; crop automático no backend.

## Affected code and docs

- **frontend/src/pages/PostPage.tsx**: Na `<img>` (ou contentor) da capa, usar `object-contain` em vez de `object-cover`; no contentor (ex.: div com aspect-[16/9]), adicionar classe de fundo (ex.: `bg-muted`) para as áreas vazias.
- **openspec/changes/post-page-cover-contain-for-non-16-9/specs/post-cover-display/spec.md**: Delta com requisito ADDED ou MODIFIED para a página do artigo (cover com object-contain e fundo neutro).

## Dependencies and risks

- Nenhuma dependência de backend. Risco baixo: apenas alteração de CSS no componente da página do post. Imagens 16:9 continuam a preencher o contentor; imagens não 16:9 passam a mostrar-se por completo com faixas laterais ou superior/inferior.

## Success criteria

- Na página do artigo, imagens de capa não 16:9 aparecem inteiras, redimensionadas para caber no contentor 16:9, com faixas neutras onde houver espaço vazio.
- Imagens 16:9 continuam a preencher o contentor (sem faixas visíveis).
- Cards (lista, índice, destaque) mantêm o comportamento atual (object-cover).
- `openspec validate post-page-cover-contain-for-non-16-9 --strict` passa.
