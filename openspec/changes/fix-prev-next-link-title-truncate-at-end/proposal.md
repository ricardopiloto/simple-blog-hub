# Proposal: Truncar título nos links anterior/próximo pelo final

## Summary

Na página do artigo (`/post/:slug`), a navegação **Post anterior** e **Próximo post** exibe o título do post adjacente. Quando o título é longo, o texto é truncado para caber no espaço. Atualmente, dependendo do layout (em especial no link "Próximo post", alinhado à direita), a parte cortada pode ser o **início** do título, deixando o leitor sem ver o começo do nome do artigo. A proposta é **garantir** que o truncamento corte sempre o **final** do título (reticências no fim), mantendo o início visível em ambos os links.

## Goals

- **Consistência**: Nos links "Post anterior" e "Próximo post", quando o título não cabe no espaço disponível, o sistema SHALL truncar pelo **final** do título (ex.: "Um título muito longo que..." em vez de "...ongo que não cabe").
- **Acessibilidade**: O atributo `title` (tooltip) pode continuar a exibir o título completo no hover, para o utilizador poder ver o texto integral.
- **Sem mudança de comportamento geral**: Manter truncamento quando necessário; apenas garantir que seja pelo final.

## Scope

- **In scope**: (1) **Frontend** em `PostPage.tsx`: ajustar o markup dos links anterior/próximo de forma que o **título** esteja num elemento que trunca com `text-overflow: ellipsis` pelo final (ex.: envolver o título num `<span>` com `truncate` e `min-w-0` para que o flex não impeça o truncamento correto; ícones seta mantêm-se visíveis). (2) **Spec delta**: requisito em post-reading que exija truncamento pelo final do título na navegação anterior/próximo.
- **Out of scope**: Alterar a ordem narrativa, a visibilidade dos links ou o texto "Post anterior" / "Próximo post"; alterar outras páginas.

## Affected code and docs

- **frontend/src/pages/PostPage.tsx**: Na secção de navegação prev/next, envolver `prevPost.title` e `nextPost.title` em elementos que truncam pelo final (e.g. `<span className="truncate min-w-0">` ou equivalente) para que a ellipsis apareça no fim do título; manter ícones sempre visíveis.
- **openspec/changes/fix-prev-next-link-title-truncate-at-end/specs/post-reading/spec.md**: ADDED requirement (e cenário) para truncamento pelo final do título nos links anterior/próximo.

## Dependencies and risks

- **Nenhum**: Alteração localizada de CSS/markup na página do artigo.

## Success criteria

- Em viewports onde o título do post anterior ou próximo não cabe, o texto visível termina com reticências ("...") e o início do título permanece visível.
- O link "Próximo post" (alinhado à direita) não corta o início do título; corta o final.
- Spec delta e `openspec validate fix-prev-next-link-title-truncate-at-end --strict` passam.
