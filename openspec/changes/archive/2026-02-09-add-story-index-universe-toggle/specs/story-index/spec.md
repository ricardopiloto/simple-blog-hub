# story-index — delta for add-story-index-universe-toggle

## ADDED Requirements

### Requirement: Toggle de universo (Velho Mundo / Idade das Trevas) ao lado do filtro

Na página **Índice da História** (`/indice`), o sistema **deve** (SHALL) permitir ao leitor escolher qual **universo** deseja ler: **"Velho Mundo"** ou **"Idade das Trevas"**. Esta opção **deve** ser apresentada como um **toggle** (um lado para cada universo) **ao lado** do campo de filtro por número da ordem ou título. O valor **por defeito** **deve** ser **"Velho Mundo"**. O sistema **deve** verificar se existem posts de **ambos** os tipos na lista do índice (posts publicados e parte da ordem da história): **quando existem os dois tipos**, o toggle **deve** ser exibido e o leitor pode alternar entre os universos; a lista exibida (e a paginação e o filtro por texto) **devem** aplicar-se aos posts do tipo selecionado. **Quando existe apenas um tipo** de post no índice, o sistema **deve** exibir apenas os posts desse tipo e **não** exibir o toggle (ou exibi-lo de forma a refletir que só há um universo), para não confundir o leitor.

#### Scenario: Existem posts dos dois tipos — toggle visível e funcional

- **Dado** que no Índice da História existem posts com `story_type` "velho_mundo" e posts com "idade_das_trevas"
- **Quando** o leitor acessa a página do Índice
- **Então** ao lado do campo de filtro é exibido um toggle com as opções "Velho Mundo" e "Idade das Trevas"
- **E** por defeito "Velho Mundo" está selecionado e a lista mostra apenas os posts do tipo "Velho Mundo"
- **E** ao selecionar "Idade das Trevas", a lista (e paginação/filtro) atualizam para mostrar apenas os posts desse tipo

#### Scenario: Existe apenas um tipo — lista desse tipo, sem toggle

- **Dado** que no Índice da História existem apenas posts com `story_type` "velho_mundo" (ou apenas "idade_das_trevas")
- **Quando** o leitor acessa a página do Índice
- **Então** a lista exibe apenas os posts desse único tipo
- **E** o toggle **não** é exibido (ou é exibido de forma a indicar que só há um universo), de modo que o leitor não precise escolher

#### Scenario: Paginação e filtro por texto aplicam-se à lista filtrada por universo

- **Dado** que o leitor está no Índice com "Velho Mundo" selecionado e existem vários posts desse tipo
- **Quando** o leitor usa o filtro por número ou título ou navega entre páginas
- **Então** a paginação e o filtro em tempo real aplicam-se **apenas** aos posts do universo selecionado (Velho Mundo)
- **E** ao mudar para "Idade das Trevas", a lista, a paginação e o filtro passam a aplicar-se aos posts desse universo

#### Scenario: Valor por defeito é Velho Mundo

- **Dado** que existem posts de ambos os tipos no Índice
- **Quando** o leitor abre a página do Índice pela primeira vez (ou sem ter alterado o universo)
- **Então** a opção selecionada no toggle é "Velho Mundo"
- **E** a lista exibida contém apenas os posts com `story_type` "velho_mundo"
