# post-cover-display — delta for post-page-cover-transparent-bg-and-comments

## MODIFIED Requirements

### Requirement: Na página do artigo a capa é exibida com object-contain para caber sem cortar

Na **página do artigo** (single post page, vista de leitura), a imagem de capa **deve** (SHALL) ser exibida com **object-fit: contain** (ou classe equivalente, ex.: `object-contain`) dentro de um contentor com aspect ratio 16:9, de forma que imagens **fora do padrão 16:9** sejam **redimensionadas** (escala) para **caber inteiramente** no contentor, **sem cortar** partes da imagem. O contentor **deve** ter **fundo transparente** nas faixas (letterboxing ou pillarboxing) quando a imagem não preenche todo o 16:9, em vez de fundo neutro (ex.: bg-muted). Em listas, cards e índice da história mantém-se object-cover para consistência visual dos blocos.

#### Scenario: Imagem não 16:9 na página do artigo aparece inteira

- **Dado** que um post tem uma imagem de capa com proporção diferente de 16:9 (ex.: 4:3 ou 1:1)
- **Quando** o utilizador abre a página do artigo (post detail)
- **Então** a capa é exibida com object-contain dentro do contentor 16:9
- **E** a imagem completa é visível (redimensionada para caber, sem corte)
- **E** qualquer espaço vazio (faixas) tem **fundo transparente**

#### Scenario: Imagem 16:9 na página do artigo preenche o contentor

- **Dado** que um post tem uma imagem de capa em proporção 16:9
- **Quando** o utilizador abre a página do artigo
- **Então** a capa preenche o contentor 16:9 (object-contain com imagem 16:9 não gera faixas visíveis)
- **E** o aspecto é o de uma capa preenchida, sem faixas
