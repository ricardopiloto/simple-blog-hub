# post-reading Specification

## Purpose

Define o comportamento da página de leitura de um artigo (post) na face pública do blog: exibição do conteúdo e da descrição do autor no final da página.
## Requirements
### Requirement: Página do artigo exibe a descrição do autor após o conteúdo

A página de leitura de um artigo (`/post/:slug`) SHALL exibir, no final da página e depois do texto do artigo, a descrição do autor — a mesma frase breve que o autor pode configurar na tela de Contas (perfil). A descrição SHALL be presented in a dedicated section (e.g. author name, avatar if present, and description text). The API/BFF SHALL include the `author.bio` field in the post response when served for public reading. If the author has no description (`bio` null or empty), the section MAY be omitted.

#### Scenario: Leitor vê a descrição do autor no final do artigo

- **Dado** um post publicado cujo autor tem descrição configurada na tela de Contas
- **Quando** um utilizador abre a página do artigo (por slug)
- **Então** após o conteúdo do artigo é exibida uma secção com o nome do autor e o texto da descrição (e avatar se existir)
- **E** o texto exibido é o mesmo configurado no perfil do autor em Contas

#### Scenario: Artigo sem descrição do autor não mostra secção vazia

- **Dado** um post cujo autor não tem descrição configurada (`author.bio` nulo ou vazio)
- **Quando** um utilizador abre a página do artigo
- **Então** não é exibida uma secção de descrição do autor (ou a secção é omitida)

#### Scenario: Resposta pública do post inclui author.bio

- **Quando** o cliente solicita um post por slug para leitura pública
- **Então** a resposta inclui o objeto do autor com pelo menos `name` e `bio` (e opcionalmente `avatar`)

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

