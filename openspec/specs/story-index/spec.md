# story-index Specification

## Purpose
TBD - created by archiving change add-index-pagination-filter-reorder. Update Purpose after archive.
## Requirements
### Requirement: Índice da História paginado e filtrável

O sistema **deve** (SHALL) exibir na página **Índice da História** (`/indice`) a lista de posts ordenados por ordem narrativa (`story_order`), com **paginação** de 6 itens por página e **filtro em tempo real** por número da ordem ou título. Os cards **devem** ser compactos, exibindo apenas **título** e **imagem** (capa), sem resumo (excerpt).

#### Scenario: Lista paginada com 6 itens por página

- **Dado** que existem posts publicados ordenados por `story_order`
- **Quando** o usuário acessa a página do Índice
- **Então** o sistema deve exibir no máximo **6 itens por página**, respeitando a ordem narrativa
- **E** deve haver controles de navegação entre páginas (ex.: anterior, próxima, ou números de página)
- **E** cada item exibido deve mostrar o número da ordem, a imagem de capa e o título (sem resumo)

#### Scenario: Filtro em tempo real por número ou título

- **Dado** que o usuário está na página do Índice
- **Quando** o usuário digita no campo de filtro (ex.: um número ou parte do título)
- **Então** a lista exibida deve ser filtrada **em tempo real** (sem submeter formulário), considerando:
  - correspondência por **número na ordem** (ex.: "2" pode coincidir com posição 2, 12, 21, etc., conforme regra de negócio)
  - correspondência por **título** (substring no título do post)
- **E** a paginação deve aplicar-se sobre a **lista filtrada** (6 itens por página do resultado filtrado)

#### Scenario: Cards compactos sem resumo

- **Dado** que o usuário visualiza a página do Índice
- **Então** cada card de item **não** deve exibir o resumo (excerpt)
- **E** cada card deve exibir apenas: número da ordem (ou controle editável se autenticado), imagem de capa e título
- **E** deve haver forma de acessar o post (ex.: link "Ler" ou clique no card)

### Requirement: Apenas autenticados podem editar a ordem do índice

**Delta:** O sistema **deve** (SHALL) oferecer **duas formas** de editar a ordem: (1) campo numérico por item para definir a posição desejada, (2) arrastar o card para a nova posição. Ambas **devem** (SHALL) estar visíveis e ativas apenas quando o utilizador está autenticado e em modo "Editar ordem".

#### Scenario: Utilizador autenticado pode reordenar por arrastar

- **Dado** que o utilizador está autenticado e clicou em "Editar ordem"
- **Quando** o utilizador visualiza a lista de cards
- **Então** cada card deve ser **arrastável** (drag-and-drop) para uma nova posição
- **E** ao soltar o card numa nova posição, a ordem exibida e os números da ordem devem atualizar de imediato na interface

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

