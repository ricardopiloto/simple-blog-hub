# post-edit-form — delta for post-edit-historia-field-toggle-ui

## MODIFIED Requirements

### Requirement: Seleção obrigatória do tipo de história (Velho Mundo ou Idade das Trevas)

No formulário de **Novo post** e de **Editar post**, o sistema **deve** (SHALL) incluir um campo **obrigatório** que permite ao autor indicar a que história o post pertence: **"Velho Mundo"** ou **"Idade das Trevas"**. Este campo **deve** ser apresentado como um **toggle** de duas opções: **um lado** do toggle corresponde a "Velho Mundo" e o **outro lado** a "Idade das Trevas" (o autor escolhe clicando num dos lados). O campo **deve** aparecer **antes** do campo "Título". **Não** deve existir valor pré-definido: em novo post, nenhum dos lados do toggle vem selecionado; o utilizador **deve** escolher explicitamente um deles. O sistema **deve** impedir o envio (criar ou atualizar) enquanto nenhuma opção estiver selecionada (validação no frontend e na API). O valor **deve** ser persistido e devolvido nas respostas; ao editar um post, o valor guardado **deve** ser exibido no toggle (um dos lados selecionado) e pode ser alterado.

#### Scenario: Novo post — sem seleção não permite guardar

- **Dado** que o utilizador abre o formulário "Novo post"
- **Quando** o utilizador preenche título e conteúdo mas **não** seleciona nenhum dos lados do toggle (Velho Mundo / Idade das Trevas)
- **Então** o sistema impede o envio (ex.: validação no submit)
- **E** o utilizador é informado que deve selecionar a história (ex.: mensagem ou indicação no campo)

#### Scenario: Novo post — com seleção guarda o valor

- **Dado** que o utilizador abre o formulário "Novo post" e seleciona um lado do toggle ("Velho Mundo" ou "Idade das Trevas")
- **Quando** o utilizador preenche os demais campos e submete o formulário
- **Então** o post é criado com o valor de história selecionado persistido
- **E** em edições futuras desse post, o valor guardado é exibido no toggle

#### Scenario: Editar post — valor guardado é exibido e pode ser alterado

- **Dado** que um post existente tem tipo de história "Idade das Trevas"
- **Quando** o utilizador abre o formulário "Editar post" para esse post
- **Então** o toggle mostra "Idade das Trevas" selecionado (o lado correspondente ativo)
- **E** o utilizador pode alterar para "Velho Mundo" (ou manter) clicando no outro lado do toggle e, ao guardar, o novo valor é persistido

#### Scenario: Campo aparece antes do Título

- **Dado** que o utilizador abre "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** o toggle da história (Velho Mundo / Idade das Trevas) aparece como **primeiro** campo do formulário, imediatamente **antes** do campo "Título"

#### Scenario: Autor escolhe clicando num dos lados do toggle

- **Dado** que o utilizador está no formulário "Novo post" ou "Editar post"
- **Quando** o utilizador clica no lado "Velho Mundo" do toggle (ou no lado "Idade das Trevas")
- **Então** esse lado fica selecionado e o valor correspondente (`velho_mundo` ou `idade_das_trevas`) é guardado no estado
- **E** ao submeter o formulário, esse valor é enviado no payload `story_type`
