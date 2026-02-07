# post-reading — delta for fix-prev-next-link-title-truncate-at-end

## ADDED Requirements

### Requirement: Títulos truncados nos links anterior/próximo cortam pelo final

Na secção de navegação **Post anterior** e **Próximo post** no final da página do artigo (`/post/:slug`), quando o título do post adjacente é longo e não cabe no espaço disponível, o sistema **deve** (SHALL) truncar o texto pelo **final** do título, exibindo reticências no fim (ex.: "Um título muito longo que..."). O **início** do título **deve** permanecer sempre visível, em ambos os links (anterior à esquerda e próximo à direita). Os ícones ou etiquetas ("Post anterior", "Próximo post") **devem** permanecer visíveis; apenas o título do artigo adjacente pode ser truncado. Opcionalmente, o título completo pode ser mostrado em tooltip (atributo `title`) ao passar o rato.

#### Scenario: Título longo no link "Post anterior" mostra início e reticências no fim

- **Dado** que o post anterior na ordem narrativa tem um título muito longo (ex.: "As Aventuras Incríveis do Herói na Terra dos Dragões")
- **Quando** o utilizador visualiza a página do artigo e a secção de navegação anterior/próximo
- **Então** no link "Post anterior" é exibido o início do título seguido de reticências (ex.: "As Aventuras Incríveis do He...")
- **E** não é exibido apenas o final do título com reticências no início

#### Scenario: Título longo no link "Próximo post" mostra início e reticências no fim

- **Dado** que o próximo post na ordem narrativa tem um título muito longo
- **Quando** o utilizador visualiza a secção de navegação (link "Próximo post" à direita)
- **Então** no link "Próximo post" é exibido o início do título seguido de reticências no fim
- **E** o ícone ou seta do próximo post permanece visível à direita do título truncado
