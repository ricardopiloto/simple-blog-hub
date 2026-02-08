# post-edit-form — delta for clarify-empty-schedule-means-immediate-publish

## ADDED Requirements

### Requirement: UI indica que agendamento vazio significa publicação imediata

No formulário de **novo post** e de **edição de post**, na secção **"Agendar publicação"** (calendário e campo de hora), o sistema **deve** (SHALL) exibir um **texto visível** que informe ao autor que **deixar a data e a hora de agendamento vazios** significa que o post será **publicado imediatamente** ao guardar (ao clicar em "Criar post" ou "Salvar"), de acordo com o estado do checkbox "Publicado". O texto **deve** estar junto aos controlos de data/hora (ex.: na descrição da secção ou logo abaixo do label "Agendar publicação"), para que o autor não fique em dúvida sobre o comportamento quando não preenche o agendamento. Exemplo de redação: "Deixe vazio para publicação imediata."

#### Scenario: Autor vê indicação de publicação imediata ao abrir o formulário

- **Dado** que o autor abre a página "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** na secção "Agendar publicação" (com calendário e campo de hora) o autor **vê** um texto que indica que deixar a data e a hora vazios resulta em publicação imediata ao guardar (ex.: "Deixe vazio para publicação imediata")
- **E** esse texto está visível sem necessidade de interação adicional (ex.: não está apenas em tooltip oculto)
