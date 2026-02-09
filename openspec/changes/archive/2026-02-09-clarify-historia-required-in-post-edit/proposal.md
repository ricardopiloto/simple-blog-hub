# Deixar explícito que o campo "História" é obrigatório no formulário de post

## Summary

No formulário de **Novo post** e de **Editar post**, o campo **"História"** (toggle Velho Mundo / Idade das Trevas) já é obrigatório e validado no submit; no entanto, a interface **não** deixa isso suficientemente claro à primeira vista. Esta change adiciona um **indicador visual de obrigatoriedade** ao campo "História" (ex.: asterisco no label ou texto "(obrigatório)" junto ao label), de forma a que o autor perceba imediatamente que deve escolher uma das opções antes de guardar.

## Goals

1. **Indicador de obrigatoriedade**: O label ou a área do campo "História" deve exibir de forma visível que o campo é obrigatório — por exemplo, asterisco (*) ao lado de "História" (alinhado com outros campos obrigatórios do formulário que usem asterisco) ou o texto "(obrigatório)" junto ao label.
2. **Consistência**: Se outros campos obrigatórios do mesmo formulário (ex.: Título, Slug) já tiverem asterisco no label, o campo História deve usar o mesmo padrão. Caso contrário, adoptar um padrão claro (ex.: "História *" ou "História (obrigatório)").
3. **Sem alterar comportamento**: A validação no submit e a mensagem de erro quando nenhuma opção está selecionada mantêm-se; apenas se melhora a **indicação visual** de que o campo é obrigatório.

## Out of scope

- Alterar a API, o BFF ou a lógica de validação.
- Tornar o campo opcional.
- Adicionar outros indicadores de obrigatoriedade noutros formulários (apenas o campo História no Novo post / Editar post).

## Success criteria

- No formulário Novo post e Editar post, o campo "História" exibe de forma clara que é obrigatório (ex.: label "História *" ou "História (obrigatório)" ou equivalente visível).
- O autor identifica à primeira vista que deve escolher Velho Mundo ou Idade das Trevas antes de guardar.
- `openspec validate clarify-historia-required-in-post-edit --strict` passa.
