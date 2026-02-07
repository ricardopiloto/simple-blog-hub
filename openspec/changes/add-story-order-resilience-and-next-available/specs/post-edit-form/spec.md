# post-edit-form — delta for add-story-order-resilience-and-next-available

## MODIFIED Requirements

### Requirement: Novo post tem ordem inicial sugerida a partir do último artigo publicado

No fluxo de **criação** de um novo artigo (quando o utilizador clica em "Novo post"), o sistema **deve** (SHALL) obter do backend a **próxima ordem narrativa disponível**: o maior `story_order` entre os posts que **fazem parte da ordem da história** (IncludeInStoryOrder == true), publicados e rascunho, + 1, ou 1 se não existir nenhum. O campo **Ordem** no formulário **deve** ser pré-preenchido com esse valor, permanecendo **editável** pelo utilizador. A API **deve** expor um endpoint (ex.: GET /api/posts/next-story-order) que retorna esse valor; o BFF **deve** expor o mesmo para o frontend autenticado; o frontend **deve** chamar esse endpoint ao abrir o formulário de novo post e definir o estado inicial do campo com o valor retornado. Assim, "Novo Post" **sempre** obtém a próxima posição na sequência da história (Índice da História), evitando que dois artigos na história recebam o mesmo número (ex.: sugerir 31 quando já existe um post na história com ordem 30).

#### Scenario: Novo post com zero artigos mostra ordem 1

- **Dado** que não existe nenhum post (publicado ou rascunho)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **1**
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Novo post após outros posts mostra próxima ordem disponível

- **Dado** que existem posts que fazem parte da ordem da história (IncludeInStoryOrder == true) e o maior `story_order` entre esses é N (ex.: 30)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **N + 1** (ex.: 31)
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Valor editado pelo utilizador é persistido

- **Quando** o utilizador abre "Novo post", recebe a ordem sugerida (ex.: 31), altera para outro valor (ex.: 2) e submete o formulário
- **Então** o post é criado com `story_order` igual ao valor escolhido (2)
- **E** o Índice da história e a API refletem essa ordem

## ADDED Requirements

### Requirement: Warning when story order is far ahead of suggested sequence

When the author enters a **story_order** value (in the new or edit post form) that is **more than a defined threshold** (e.g. 5) above the **suggested next** (the value returned by GET next-story-order, i.e. max over posts with IncludeInStoryOrder + 1), the frontend SHALL display a **warning** (e.g. inline message) so the author is aware that the order is far ahead of the current sequence. Example message: "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X." The author MAY still save the form (override); the warning is advisory to avoid accidental large gaps. For the edit form, the frontend SHALL use the same suggested-next value (e.g. by calling next-story-order when the form loads or when the order field is edited) so that the warning can be shown if the user types a value far above that.

#### Scenario: Author sees warning when typing order far ahead

- **GIVEN** the suggested next story order is 6 (max existing is 5)
- **WHEN** the author opens "Novo post" or edits the Ordem field and enters a value greater than 11 (e.g. 30), i.e. more than threshold (5) above 6
- **THEN** the frontend SHALL show a warning (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é 6.")
- **AND** the author can still save with the value 30 if they intend to (no block)
- **AND** if they correct to 6 or another value within threshold, the warning is hidden
