# post-reading (delta)

## ADDED Requirements

### Requirement: Página do artigo exibe navegação para post anterior e próximo na ordem narrativa

A página de leitura de um artigo (`/post/:slug`) **deve** (SHALL) exibir **no final da página**, após o conteúdo e a secção de descrição do autor (quando existir), uma **secção de navegação** com duas opções baseadas na **ordem narrativa** definida pelos autores (campo `story_order`), considerando apenas posts **publicados**:

- **À esquerda**: link para o **post anterior** na ordem (post publicado com `story_order` imediatamente inferior). Exibido **apenas** quando existir um post anterior (o artigo atual não é o primeiro na sequência).
- **À direita**: link para o **próximo post** na ordem (post publicado com `story_order` imediatamente superior). Exibido **apenas** quando existir um próximo (o artigo atual não é o último na sequência).

A mesma ordem usada no **Índice da História** (lista de posts publicados ordenados por `story_order`) **deve** ser usada para determinar anterior e próximo. Se o post atual não fizer parte dessa lista (ex.: é um rascunho acessado por link direto), a secção de navegação **pode** ser omitida.

#### Scenario: Leitor no primeiro post vê apenas link para o próximo

- **Dado** um post publicado que é o primeiro na ordem narrativa (menor `story_order` entre publicados)
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página é exibido apenas o link para o **próximo post** (à direita)
- **E** não é exibido link "Post anterior" (ou equivalente à esquerda)

#### Scenario: Leitor no último post vê apenas link para o anterior

- **Dado** um post publicado que é o último na ordem narrativa (maior `story_order` entre publicados)
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página é exibido apenas o link para o **post anterior** (à esquerda)
- **E** não é exibido link "Próximo post" (ou equivalente à direita)

#### Scenario: Leitor no meio da sequência vê anterior e próximo

- **Dado** um post publicado que não é o primeiro nem o último na ordem narrativa
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página são exibidos o link para o **post anterior** (à esquerda) e o link para o **próximo post** (à direita)
- **E** ao clicar em cada link o utilizador é levado ao artigo correto na ordem do Índice da História

#### Scenario: Ordem da navegação coincide com o Índice da História

- **Dado** a lista de posts publicados ordenados por `story_order` (como no Índice)
- **Quando** o utilizador está na página de um desses posts
- **Então** o "post anterior" é o que aparece imediatamente antes na mesma lista
- **E** o "próximo post" é o que aparece imediatamente depois na mesma lista
