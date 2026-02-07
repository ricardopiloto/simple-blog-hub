# post-edit-form Specification

## Purpose
TBD - created by archiving change fix-post-excerpt-first-32-chars. Update Purpose after archive.
## Requirements
### Requirement: Excerpt auto-filled from first 32 characters of content

In the post creation and edit form, the Excerpt (Resumo) field SHALL be filled automatically with the first 32 characters of the text entered in the Content (Conteúdo) field. When the user types or edits the content, the excerpt SHALL be updated so that it always reflects the first 32 characters of the current content (trimmed if applicable), so that the summary stays in sync with the content and is not limited to a single character.

#### Scenario: Excerpt updates as content is typed

- **WHEN** the user types or edits the Content field
- **THEN** the Excerpt field is set to the first 32 characters of the content (after trim), and updates as the content changes

#### Scenario: Content shorter than 32 characters

- **WHEN** the content has fewer than 32 characters
- **THEN** the excerpt contains the full content (trimmed)

### Requirement: Novo post tem ordem inicial sugerida a partir do último artigo publicado

No fluxo de **criação** de um novo artigo (quando o utilizador clica em "Novo post"), o sistema **deve** (SHALL) obter do backend a **próxima ordem narrativa sugerida**: o maior `story_order` entre os posts **publicados** (Published == true) + 1, ou 1 se não existir nenhum post publicado. O campo **Ordem** no formulário **deve** ser pré-preenchido com esse valor, permanecendo **editável** pelo utilizador. A API **deve** expor um endpoint (ex.: GET /api/posts/next-story-order) que retorna esse valor; o BFF **deve** expor o mesmo para o frontend autenticado; o frontend **deve** chamar esse endpoint ao abrir o formulário de novo post e definir o estado inicial do campo com o valor retornado. Assim, "Novo Post" obtém sempre **último publicado + 1** (ex.: se o último publicado tem ordem 6, o próximo sugerido é 7). Rascunhos **não** entram no cálculo.

#### Scenario: Novo post com zero artigos publicados mostra ordem 1

- **Dado** que não existe nenhum post publicado
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **1**
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Novo post após posts publicados mostra último publicado + 1

- **Dado** que existem posts publicados e o maior `story_order` entre eles é N (ex.: 6)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **N + 1** (ex.: 7)
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Rascunhos não afetam o próximo sugerido

- **Dado** que o maior `story_order` entre posts **publicados** é 3, e existe um rascunho com `story_order` 30
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **4** (3 + 1), e não 31
- **E** o utilizador pode alterar o valor antes de guardar

### Requirement: Warning when story order is far ahead of suggested sequence

When the author enters a **story_order** value (in the new or edit post form) that is **more than a defined threshold** (e.g. 5) above the **suggested next** (the value returned by GET next-story-order, i.e. max over posts with IncludeInStoryOrder + 1), the frontend SHALL display a **warning** (e.g. inline message) so the author is aware that the order is far ahead of the current sequence. Example message: "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X." The author MAY still save the form (override); the warning is advisory to avoid accidental large gaps. For the edit form, the frontend SHALL use the same suggested-next value (e.g. by calling next-story-order when the form loads or when the order field is edited) so that the warning can be shown if the user types a value far above that.

#### Scenario: Author sees warning when typing order far ahead

- **GIVEN** the suggested next story order is 6 (max existing is 5)
- **WHEN** the author opens "Novo post" or edits the Ordem field and enters a value greater than 11 (e.g. 30), i.e. more than threshold (5) above 6
- **THEN** the frontend SHALL show a warning (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é 6.")
- **AND** the author can still save with the value 30 if they intend to (no block)
- **AND** if they correct to 6 or another value within threshold, the warning is hidden

### Requirement: Autor pode excluir o post da ordem da história

O formulário de **novo post** e de **edição de post** **deve** (SHALL) incluir uma opção (ex.: checkbox) que permite ao autor indicar se o artigo **faz parte da ordem da história** (incluído no Índice da História e na sequência anterior/próximo na página do artigo). Por defeito, esta opção **deve** estar **marcada** (o post faz parte da ordem). Quando o autor **desmarca** esta opção, o post **não** deve aparecer no menu "Índice da História" nem nos links anterior/próximo da página do artigo, mas continua publicado e visível na página inicial e na lista de artigos. A API **deve** persistir este valor (ex.: `include_in_story_order`) e **deve** utilizá-lo para filtrar a lista quando `order=story` e para calcular a próxima ordem sugerida (apenas entre posts que fazem parte da história).

#### Scenario: Novo post com "faz parte da ordem" marcado (default)

- **Dado** que o utilizador abre o formulário "Novo post"
- **Quando** o formulário é exibido
- **Então** a opção "Faz parte da ordem da história" (ou equivalente) está **marcada** por defeito
- **E** ao guardar, o post é criado com `include_in_story_order` verdadeiro e aparece no Índice da História

#### Scenario: Autor desmarca "faz parte da ordem da história"

- **Dado** que o utilizador está a editar um post (ou a criar um novo) e desmarca a opção "Faz parte da ordem da história"
- **Quando** o utilizador guarda o post
- **Então** o post é persistido com `include_in_story_order` falso
- **E** o post **não** aparece na página Índice da História
- **E** na página do artigo desse post, os links "anterior" e "próximo" (na sequência da história) não incluem este post; se for o post atual, pode não haver anterior/próximo na sequência

#### Scenario: Autor volta a marcar "faz parte da ordem"

- **Dado** que um post estava excluído da ordem da história (checkbox desmarcado)
- **Quando** o utilizador edita o post e marca novamente "Faz parte da ordem da história" e guarda
- **Então** o post passa a aparecer no Índice da História na posição definida por `story_order`
- **E** os links anterior/próximo na página do artigo passam a considerar este post na sequência

