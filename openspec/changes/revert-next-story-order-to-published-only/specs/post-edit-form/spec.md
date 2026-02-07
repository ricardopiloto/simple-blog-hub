# post-edit-form — delta for revert-next-story-order-to-published-only

## MODIFIED Requirements

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
