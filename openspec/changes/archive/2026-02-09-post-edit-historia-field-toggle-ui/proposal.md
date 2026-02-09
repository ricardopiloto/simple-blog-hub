# Campo "História" como toggle no formulário Novo post / Editar post

## Summary

Ajustar o campo **"História"** no formulário de **Novo post** e de **Editar post** para que seja apresentado como um **toggle** em vez do controlo atual (select): um lado do toggle corresponde a **"Velho Mundo"** e o outro a **"Idade das Trevas"**. A posição (antes do Título), a obrigatoriedade (sem valor pré-definido; o utilizador deve escolher) e a validação mantêm-se; apenas o **tipo de controlo** muda para um toggle de duas opções.

## Goals

1. **Substituir o select por um toggle**: O campo "História" deixa de ser um dropdown (Select) e passa a ser um **toggle** com dois lados — um para "Velho Mundo" e outro para "Idade das Trevas". O autor escolhe clicando num dos lados.
2. **Comportamento inalterado**: Continua a ser o primeiro campo do formulário (antes do Título); em **novo post** nenhuma opção vem pré-selecionada; o envio sem seleção continua a ser impedido (validação no frontend e na API); ao editar, o valor guardado é exibido no toggle e pode ser alterado.
3. **Implementação**: Usar um controlo de toggle de duas opções (ex.: `ToggleGroup` com `type="single"` e dois itens, ou componente equivalente) na página `PostEdit.tsx`, mantendo o estado `storyType`, a validação e o payload `story_type`.

## Out of scope

- Alterar a API, o BFF ou o modelo de dados (o campo `story_type` e os valores `velho_mundo` / `idade_das_trevas` permanecem iguais).
- Alterar a ordem ou a presença de outros campos do formulário.
- Adicionar mais opções além de "Velho Mundo" e "Idade das Trevas".

## Success criteria

- No formulário Novo post e Editar post, o campo "História" é exibido como um **toggle** com dois lados: "Velho Mundo" e "Idade das Trevas".
- Em novo post, nenhum lado vem selecionado por defeito; o utilizador deve escolher um antes de guardar.
- Ao editar um post, o toggle mostra o valor guardado (um dos dois lados selecionado) e o autor pode alterar.
- A validação e a persistência de `story_type` continuam a funcionar como hoje.
- `openspec validate post-edit-historia-field-toggle-ui --strict` passa.
