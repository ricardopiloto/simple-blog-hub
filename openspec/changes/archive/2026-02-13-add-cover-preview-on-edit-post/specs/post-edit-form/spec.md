# post-edit-form Specification (delta: add-cover-preview-on-edit-post)

## Purpose
Spec delta for change add-cover-preview-on-edit-post. Base spec: openspec/specs/post-edit-form/spec.md

## ADDED Requirements

### Requirement: Preview da imagem de capa apenas em Editar post (SHALL)

No formulário de **Editar post** (rota de edição de um post existente, ex.: `/area-autor/posts/:id/editar`), quando existir uma **URL de imagem de capa** — seja a carregada do post (`cover_image`) ou a definida pelo utilizador após colar URL ou fazer upload de ficheiro — o sistema **DEVE** (SHALL) exibir um **preview visual** dessa imagem na secção "URL da imagem de capa", de forma que o autor possa ver como a capa ficará antes de guardar. O preview **DEVE** ser uma imagem renderizada (ex.: elemento `<img>`) com a URL atual da capa, com dimensões e proporção adequadas (ex.: aspect ratio 16:9, tamanho limitado). No formulário **Novo post** o preview da imagem de capa **NÃO** deve ser exibido; apenas o campo URL e o upload permanecem, sem bloco de preview.

#### Scenario: Autor vê preview da capa ao editar post

- **Dado** que o utilizador está na página **Editar post** (post existente com ou sem capa)
- **Quando** existe uma URL de imagem de capa no formulário (carregada do post ou definida após upload/colagem)
- **Então** é exibido um preview visual da imagem (miniatura ou imagem com proporção adequada) na secção da imagem de capa
- **E** o autor pode confirmar visualmente a capa antes de guardar

#### Scenario: Novo post não exibe preview da capa

- **Dado** que o utilizador está na página **Novo post**
- **Quando** o utilizador preenche o campo URL da imagem de capa ou faz upload
- **Então** o formulário **não** exibe um bloco de preview da imagem de capa (apenas o campo e o upload, como hoje)
- **E** o comportamento em Novo post permanece inalterado em relação ao preview
