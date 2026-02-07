# story-index — delta for add-post-include-in-story-order

## MODIFIED Requirements

### Requirement: Índice da História paginado e filtrável

O sistema **deve** (SHALL) exibir na página **Índice da História** (`/indice`) a lista de posts **que fazem parte da ordem da história** (campo `include_in_story_order` verdadeiro), publicados, ordenados por ordem narrativa (`story_order`), com **paginação** de 6 itens por página e **filtro em tempo real** por número da ordem ou título. Posts publicados que **não** fazem parte da ordem da história (ex.: extras, one-shots) **não** devem aparecer nesta lista, embora continuem visíveis na página inicial e na lista de artigos. Os cards **devem** ser compactos, exibindo apenas **título** e **imagem** (capa), sem resumo (excerpt).

#### Scenario: Apenas posts "na história" aparecem no Índice

- **Dado** que existem posts publicados, sendo alguns com "faz parte da ordem da história" ativo (ex.: posts 1, 2, 3 e 5) e pelo menos um com "faz parte da ordem da história" desativado (ex.: post 4)
- **Quando** o utilizador acessa a página do Índice da História
- **Então** o sistema exibe apenas os posts marcados como parte da ordem (ex.: 1, 2, 3 e 5, na ordem narrativa)
- **E** o post 4 (não parte da história) **não** aparece na lista do Índice
- **E** a paginação e o filtro aplicam-se apenas a essa lista filtrada

#### Scenario: Lista paginada com 6 itens por página

- **Dado** que existem posts publicados ordenados por `story_order` e marcados como parte da ordem da história
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
