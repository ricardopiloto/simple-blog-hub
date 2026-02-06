# story-index (delta)

## ADDED Requirements

### Requirement: Dois modos de reordenação na edição da ordem do índice

O sistema **deve** (SHALL) oferecer ao utilizador autenticado **duas maneiras** de alterar a ordem do Índice da História quando "Editar ordem" estiver ativo: (1) **editar o número da ordem** no campo numérico de cada card; (2) **arrastar o card** (drag-and-drop) para a nova posição. Ambas as ações devem atualizar a mesma lista em memória e reatribuir as posições (story_order 1..N). As ações "Salvar ordem" e "Cancelar" aplicam-se independentemente do método usado para reordenar.

#### Scenario: Reordenar alterando o número no input

- **Dado** que o utilizador está autenticado e clicou em "Editar ordem"
- **Quando** o utilizador altera o número da ordem de um item no campo numérico do card (ex.: de 5 para 2)
- **Então** a lista em memória deve ser reordenada de forma consistente (o item move-se para a posição indicada, os demais ajustam-se)
- **E** o estado de edição reflete a nova ordem até "Salvar ordem" ou "Cancelar"

#### Scenario: Reordenar arrastando o card

- **Dado** que o utilizador está autenticado e clicou em "Editar ordem"
- **Quando** o utilizador arrasta um card e solta-o numa nova posição na lista
- **Então** a lista em memória deve ser reordenada conforme a posição onde o card foi solto (story_order 1..N reatribuídos)
- **E** os números da ordem nos cards (e nos inputs) devem atualizar para refletir a nova ordem
- **E** "Salvar ordem" deve persistir essa ordem no backend; "Cancelar" deve descartar as alterações

#### Scenario: Ambos os métodos partilham o mesmo estado de edição

- **Dado** que o utilizador está em modo "Editar ordem"
- **Quando** o utilizador reordena primeiro pelo input numérico e depois arrasta outro card (ou o contrário)
- **Então** todas as alterações refletem-se na mesma lista em edição (`editingOrder`)
- **E** um único "Salvar ordem" persiste a ordem resultante; "Cancelar" descarta todas as alterações feitas por qualquer método

## MODIFIED Requirements

### Requirement: Apenas autenticados podem editar a ordem do índice

**Delta:** O sistema **deve** (SHALL) oferecer **duas formas** de editar a ordem: (1) campo numérico por item para definir a posição desejada, (2) arrastar o card para a nova posição. Ambas **devem** (SHALL) estar visíveis e ativas apenas quando o utilizador está autenticado e em modo "Editar ordem".

#### Scenario: Utilizador autenticado pode reordenar por arrastar

- **Dado** que o utilizador está autenticado e clicou em "Editar ordem"
- **Quando** o utilizador visualiza a lista de cards
- **Então** cada card deve ser **arrastável** (drag-and-drop) para uma nova posição
- **E** ao soltar o card numa nova posição, a ordem exibida e os números da ordem devem atualizar de imediato na interface
