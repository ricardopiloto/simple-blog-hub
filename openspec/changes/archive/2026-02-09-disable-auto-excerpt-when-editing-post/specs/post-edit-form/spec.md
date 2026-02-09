# post-edit-form — delta for disable-auto-excerpt-when-editing-post

## MODIFIED Requirements

### Requirement: Excerpt auto-filled from first 32 characters of content

In the **new post** form, the Excerpt (Resumo) field SHALL be filled automatically with the first 32 characters of the text entered in the Content (Conteúdo) field, and SHALL be updated as the user types or edits the content (trimmed). In the **edit post** form, the Excerpt field SHALL **not** be updated automatically when the user changes the Content field; the Excerpt SHALL be set once from the saved post when the form loads and SHALL only change if the author edits the Excerpt field manually.

#### Scenario: Novo post — excerpt atualiza ao digitar no Conteúdo

- **Quando** o utilizador está no formulário **Novo post** e digita ou edita o campo Conteúdo
- **Então** o campo Resumo é preenchido (e atualizado) com os primeiros 32 caracteres do conteúdo (após trim)

#### Scenario: Editar post — excerpt NÃO atualiza ao digitar no Conteúdo

- **Dado** que o utilizador abriu o formulário **Editar post** e o Resumo foi carregado do post (ex.: "Primeiros trinta e dois caracteres do artigo...")
- **Quando** o utilizador altera o texto do campo Conteúdo
- **Então** o campo Resumo **não** é alterado automaticamente
- **E** o Resumo só muda se o utilizador editar o campo Resumo diretamente

#### Scenario: Editar post — autor pode editar o Resumo manualmente

- **Dado** que o utilizador está a editar um post
- **Quando** o utilizador altera o texto no campo Resumo (Input do Resumo)
- **Então** o valor do Resumo é atualizado conforme a edição manual
- **E** ao guardar, o excerpt enviado é o valor atual do campo Resumo
