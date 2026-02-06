# story-index (delta)

## ADDED Requirements

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

O sistema **deve** (SHALL) permitir **editar a ordem** do Índice (reordenar itens e persistir) **apenas** para usuários **autenticados**. Usuários não autenticados **devem** ver apenas a lista (ordenada, paginada e filtrada), sem controles de edição.

#### Scenario: Visitante não autenticado só visualiza

- **Dado** que o visitante **não** está autenticado
- **Quando** acessa a página do Índice
- **Então** deve ver a lista de posts ordenados, com paginação e filtro
- **E** **não** deve ver campo editável para alterar o número da ordem de um item
- **E** **não** deve ver botões "Salvar ordem" ou "Cancelar" de reordenação
- **E** **não** deve ver controle de arrastar (drag) para reordenar

#### Scenario: Usuário autenticado pode alterar a ordem manualmente

- **Dado** que o usuário **está** autenticado
- **Quando** acessa a página do Índice
- **Então** deve ver controles para **editar a ordem** (ex.: campo numérico por item para definir a posição desejada, e/ou arrastar)
- **E** ao alterar o número de um item (ex.: de posição 21 para 2), o sistema deve **reordenar os demais** itens de forma consistente (ex.: itens que estavam em 2–20 passam a 3–21)
- **E** deve haver ação "Salvar ordem" que **persiste** a nova ordem no backend (ex.: atualização de `story_order` dos posts afetados via API)
- **E** deve haver ação "Cancelar" que descarta as alterações locais e restaura a ordem anterior

#### Scenario: Ordem persistida após salvar

- **Dado** que o usuário autenticado alterou a ordem do índice e clicou em "Salvar ordem"
- **Quando** a persistência for concluída com sucesso
- **Então** o backend deve ter atualizado o `story_order` dos posts afetados
- **E** a lista exibida (e futuras carregamentos) deve refletir a nova ordem
