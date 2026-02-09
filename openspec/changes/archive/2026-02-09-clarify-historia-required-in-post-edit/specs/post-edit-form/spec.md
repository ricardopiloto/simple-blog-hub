# post-edit-form — delta for clarify-historia-required-in-post-edit

## ADDED Requirements

### Requirement: Campo História exibe indicador visível de obrigatoriedade

No formulário de **Novo post** e de **Editar post**, o campo **"História"** (toggle Velho Mundo / Idade das Trevas) **deve** (SHALL) exibir de forma **visível** que é **obrigatório** — por exemplo, através de asterisco (*) no label ou do texto "(obrigatório)" junto ao label, de modo a que o autor perceba à primeira vista que deve escolher uma das opções antes de guardar. A validação no submit e a mensagem de erro quando nenhuma opção está selecionada mantêm-se; esta exigência refere-se apenas à **indicação visual** da obrigatoriedade.

#### Scenario: Autor vê que o campo História é obrigatório

- **Dado** que o utilizador abre o formulário "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** o label ou a área do campo "História" mostra uma indicação clara de que o campo é obrigatório (ex.: "História *" ou "História (obrigatório)")
- **E** o autor identifica sem ambiguidade que deve escolher "Velho Mundo" ou "Idade das Trevas" antes de poder guardar o post
