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

No fluxo de **criação** de um novo artigo (quando o utilizador clica em "Novo post"), o sistema **deve** (SHALL) obter do backend a **próxima ordem narrativa sugerida**: o maior `story_order` entre os posts **publicados** + 1, ou 1 se não existir nenhum post publicado. O campo **Ordem** no formulário **deve** ser pré-preenchido com esse valor, permanecendo **editável** pelo utilizador. A API **deve** expor um endpoint (ex.: GET /api/posts/next-story-order) que retorna esse valor; o BFF **deve** expor o mesmo para o frontend autenticado; o frontend **deve** chamar esse endpoint ao abrir o formulário de novo post e definir o estado inicial do campo com o valor retornado.

#### Scenario: Novo post com zero artigos publicados mostra ordem 1

- **Dado** que não existe nenhum post publicado (ou todos são rascunho)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **1**
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Novo post após artigos publicados mostra próxima ordem

- **Dado** que existem posts publicados e o maior `story_order` entre eles é N (ex.: 5)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **N + 1** (ex.: 6)
- **E** o utilizador pode alterar o valor antes de guardar (ex.: colocar 2 e o sistema aceita)

#### Scenario: Valor editado pelo utilizador é persistido

- **Quando** o utilizador abre "Novo post", recebe a ordem sugerida (ex.: 6), altera para outro valor (ex.: 2) e submete o formulário
- **Então** o post é criado com `story_order` igual ao valor escolhido (2)
- **E** o Índice da história e a API refletem essa ordem

