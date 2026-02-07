# post-edit-form — delta for add-cover-size-guidance-and-framing

## ADDED Requirements

### Requirement: Orientação de tamanho da imagem de capa para não cortar

No formulário de **novo post** e de **edição de post**, junto ao campo "URL da imagem de capa" (e à opção de upload), o sistema **deve** (SHALL) exibir um texto de ajuda que informe ao autor a **proporção recomendada** (16:9) e **dimensões sugeridas** em pixels (ex.: 1200×675) para que a imagem não seja cortada na visualização. O objetivo é que o autor possa preparar ou escolher imagens nessa proporção e assim evitar que partes importantes sejam recortadas quando a capa for exibida com aspect ratio fixo (16:9) nas páginas do blog.

#### Scenario: Autor vê orientação de tamanho ao editar a capa

- **Dado** que o utilizador está no formulário de novo post ou de edição de post
- **Quando** o utilizador visualiza a secção da imagem de capa (campo URL e/ou upload)
- **Então** é exibido texto de ajuda com a proporção recomendada (16:9) e exemplo de dimensões (ex.: 1200×675 px) para não cortar a imagem
- **E** o texto está em português e visível próximo ao campo ou à opção de upload

#### Scenario: Orientação não bloqueia URL ou upload

- **Dado** que o autor vê a orientação de tamanho no formulário
- **Quando** o autor cola uma URL ou envia um ficheiro com dimensões diferentes da recomendada
- **Então** o sistema aceita e guarda a imagem normalmente
- **E** a orientação é apenas informativa, não validada
