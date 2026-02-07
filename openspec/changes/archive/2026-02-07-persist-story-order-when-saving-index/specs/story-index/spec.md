# story-index — delta for persist-story-order-when-saving-index

## ADDED Requirements

### Requirement: Persistência da ordem no banco ao salvar no Índice da História

Sempre que um utilizador **autenticado** editar a ordem cronológica da história na tela do **Índice da História** (por arrastar cards ou alterar o número da ordem) e acionar **"Salvar ordem"**, o sistema **deve** (SHALL) **atualizar a coluna `StoryOrder`** na base de dados para cada post afetado, de forma que os valores persistidos **reflitam exatamente** a ordem designada na tela. A persistência **deve** ser feita através do endpoint existente (ex.: PUT /api/posts/story-order via BFF), que recebe a lista de pares (id do post, story_order) e grava cada `StoryOrder` na tabela `Posts`. Após a persistência, qualquer nova leitura da lista (ex.: GET posts com order=story) **deve** devolver os posts na nova ordem.

#### Scenario: Salvar ordem atualiza StoryOrder no banco

- **Dado** que o utilizador está autenticado e em modo "Editar ordem" no Índice da História
- **E** alterou a ordem (ex.: arrastou um card ou editou o número da ordem) de forma que o post A passe a ter ordem 1 e o post B ordem 2 (quando antes era o contrário)
- **Quando** o utilizador clica em "Salvar ordem"
- **Então** o sistema envia ao backend a nova ordem (ids e story_order de cada post)
- **E** o backend atualiza a coluna `StoryOrder` na tabela `Posts` para cada post com os valores correspondentes
- **E** uma leitura posterior da lista por ordem da história (ex.: refresh da página ou GET /bff/posts?order=story) exibe os posts na ordem que foi salva

#### Scenario: Cancelar ordem não altera o banco

- **Dado** que o utilizador está em modo "Editar ordem" e alterou a ordem na tela mas **não** clicou em "Salvar ordem"
- **Quando** o utilizador clica em "Cancelar"
- **Então** as alterações em memória são descartadas
- **E** a coluna `StoryOrder` no banco **não** é alterada (permanece a ordem anterior)
