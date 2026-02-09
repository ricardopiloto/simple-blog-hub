# post-edit-form — delta for add-post-story-type-velho-mundo-idade-das-trevas

## ADDED Requirements

### Requirement: Seleção obrigatória do tipo de história (Velho Mundo ou Idade das Trevas)

No formulário de **Novo post** e de **Editar post**, o sistema **deve** (SHALL) incluir um campo **obrigatório** que permite ao autor indicar a que história o post pertence: **"Velho Mundo"** ou **"Idade das Trevas"**. Este campo **deve** aparecer **antes** do campo "Título". **Não** deve existir valor pré-definido: em novo post, nenhuma das duas opções vem selecionada; o utilizador **deve** escolher explicitamente uma delas. O sistema **deve** impedir o envio (criar ou atualizar) enquanto nenhuma opção estiver selecionada (validação no frontend e na API). O valor **deve** ser persistido e devolvido nas respostas; ao editar um post, o valor guardado **deve** ser exibido no formulário e pode ser alterado.

#### Scenario: Novo post — sem seleção não permite guardar

- **Dado** que o utilizador abre o formulário "Novo post"
- **Quando** o utilizador preenche título e conteúdo mas **não** seleciona nenhuma das opções (Velho Mundo / Idade das Trevas)
- **Então** o sistema impede o envio (ex.: validação no submit ou campo obrigatório)
- **E** o utilizador é informado que deve selecionar a história (ex.: mensagem ou indicação no campo)

#### Scenario: Novo post — com seleção guarda o valor

- **Dado** que o utilizador abre o formulário "Novo post" e seleciona "Velho Mundo" (ou "Idade das Trevas")
- **Quando** o utilizador preenche os demais campos e submete o formulário
- **Então** o post é criado com o valor de história selecionado persistido
- **E** em edições futuras desse post, o valor guardado é exibido no formulário

#### Scenario: Editar post — valor guardado é exibido e pode ser alterado

- **Dado** que um post existente tem tipo de história "Idade das Trevas"
- **Quando** o utilizador abre o formulário "Editar post" para esse post
- **Então** o campo de tipo de história mostra "Idade das Trevas" selecionado
- **E** o utilizador pode alterar para "Velho Mundo" (ou manter) e, ao guardar, o novo valor é persistido

#### Scenario: Campo aparece antes do Título

- **Dado** que o utilizador abre "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** o campo de seleção da história (Velho Mundo / Idade das Trevas) aparece como **primeiro** campo do formulário, imediatamente **antes** do campo "Título"
