# Segregação do tipo de post por história: Velho Mundo / Idade das Trevas

## Summary

Adicionar uma nova funcionalidade que **segrega o tipo de post** por história. O utilizador **deve** escolher obrigatoriamente se o post está relacionado com uma de duas histórias: **"Velho Mundo"** ou **"Idade das Trevas"**. Não há valor pré-definido: o formulário **não** pré-seleciona nenhuma opção; o autor é **obrigado** a selecionar explicitamente antes de guardar. O campo é exibido **antes do campo Título** no formulário de Novo post e de Editar post.

## Goals

1. **Campo obrigatório**: Cada post passa a ter um atributo que indica a que história pertence: "Velho Mundo" ou "Idade das Trevas". Este valor é obrigatório na criação e na edição.
2. **Sem escolha padrão na UI**: No formulário, nenhuma das duas opções vem pré-selecionada. O utilizador tem de escolher uma delas; o envio do formulário sem seleção deve ser impedido (validação no frontend e na API).
3. **Posição no formulário**: O controlo de seleção (ex.: select ou radio group) deve aparecer **antes** do campo "Título" no formulário de Novo post e de Editar post.
4. **Persistência**: A API persiste o valor (ex.: coluna `StoryType` ou equivalente); o BFF repassa o campo nos pedidos e nas respostas; o frontend envia e recebe o valor em create/update e na leitura do post.

## Out of scope

- Filtros na lista de posts ou no Índice da História por tipo de história (pode ser tratado em change futura).
- Alterar a ordem dos campos restantes do formulário para além da inserção do novo campo antes do Título.
- Novos valores além de "Velho Mundo" e "Idade das Trevas" (conjunto fixo por agora).

## Success criteria

- No formulário Novo post e Editar post, existe um campo **antes** do Título onde o autor escolhe obrigatoriamente "Velho Mundo" ou "Idade das Trevas"; não há opção pré-selecionada.
- Não é possível guardar (criar ou atualizar) o post sem ter selecionado uma das duas opções (validação no frontend e na API).
- O valor é persistido na base de dados e devolvido nas respostas da API/BFF; ao editar um post existente, o valor guardado é mostrado no formulário.
- Posts já existentes na base recebem um valor por defeito na migração (ex.: "Velho Mundo") para que a coluna possa ser NOT NULL e o sistema continue a funcionar após o deploy.
- `openspec validate add-post-story-type-velho-mundo-idade-das-trevas --strict` passa.
