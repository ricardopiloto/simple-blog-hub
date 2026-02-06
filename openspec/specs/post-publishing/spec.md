# post-publishing Specification

## Purpose
TBD - created by archiving change validate-post-publishing-flow. Update Purpose after archive.
## Requirements
### Requirement: Listas públicas mostram apenas posts publicados

As listas de posts usadas na **página inicial** e no **Índice da História** **devem** (SHALL) conter apenas posts com `published === true`. A API **deve** filtrar por `Published == true` quando o cliente pede a lista pública de posts (ex.: `GET /api/posts` sem `forAuthorArea` nem `editable`). O BFF **deve** pedir à API a lista de posts publicados para esses fins. Posts guardados como rascunho (`published === false`) **não** devem aparecer nessas listas.

#### Scenario: Página inicial só mostra posts publicados

- **Dado** que existem posts com `published: true` e posts com `published: false`
- **Quando** o utilizador acede à página inicial (lista por data)
- **Então** apenas os posts publicados **devem** ser exibidos
- **E** os posts em rascunho **não** devem aparecer nessa lista

#### Scenario: Índice da História só mostra posts publicados

- **Dado** que existem posts com `published: true` e posts com `published: false`
- **Quando** o utilizador acede à página do Índice (`/indice`)
- **Então** apenas os posts publicados **devem** ser exibidos (ordenados por `story_order`)
- **E** os posts em rascunho **não** devem aparecer no índice

### Requirement: Criar e atualizar post persistem o campo Publicado

A API **deve** (SHALL) persistir o campo **Publicado** (`Published`) ao criar (POST) e ao atualizar (PUT) um post, com base no valor enviado no body do pedido. O formulário de criar/editar post no frontend **deve** enviar o campo `published` no payload e a API **deve** gravar esse valor no modelo `Post`.

#### Scenario: Novo post criado como publicado aparece nas listas públicas

- **Quando** o utilizador autenticado cria um novo post com "Publicado" marcado e guarda
- **Então** a API persiste o post com `Published == true`
- **E** o post **deve** aparecer na página inicial e no Índice após recarregar ou invalidar as queries

#### Scenario: Post atualizado para rascunho deixa de aparecer nas listas públicas

- **Quando** o utilizador edita um post publicado e desmarca "Publicado" e guarda
- **Então** a API persiste `Published == false`
- **E** o post **não** deve aparecer na página inicial nem no Índice (apenas na Área do autor)

### Requirement: Formulário de novo post com Publicado por defeito; edição reflete valor atual

O formulário de **novo** post **deve** (SHALL) definir o valor inicial do campo "Publicado" como **true**, para que um post recém-criado apareça na página inicial e no índice salvo o utilizador desmarcar explicitamente. Ao **editar** um post existente, o valor exibido **deve** (SHALL) ser o valor atual do post (`post.published`).

#### Scenario: Novo post com Publicado por defeito marcado

- **Quando** o utilizador abre o formulário de **novo** post (criar)
- **Então** o campo "Publicado" **deve** estar marcado por defeito
- **E** ao guardar sem alterar, o post é criado como publicado e aparece nas listas públicas

