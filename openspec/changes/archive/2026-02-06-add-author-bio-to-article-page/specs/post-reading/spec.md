# post-reading (delta)

## Purpose

Define o comportamento da página de leitura de um artigo (post) na face pública do blog: conteúdo, autor e exibição da descrição do autor no final da página.

## ADDED Requirements

### Requirement: Página do artigo exibe a descrição do autor após o conteúdo

A página de leitura de um artigo (`/post/:slug`) **deve** (SHALL) exibir, **no final da página e depois do texto do artigo**, a **descrição do autor** — a mesma frase breve que o autor pode configurar na tela de Contas (perfil), por exemplo «Sonhador e amante de contos e RPG». A descrição **deve** ser apresentada em secção dedicada (ex.: nome do autor, avatar se existir, e texto da descrição). A API/BFF **devem** incluir o campo `author.bio` na resposta do post quando servido para leitura pública. Se o autor não tiver descrição configurada (`bio` nulo ou vazio), a secção **pode** ser omitida para não exibir bloco vazio.

#### Scenario: Leitor vê a descrição do autor no final do artigo

- **Dado** um post publicado cujo autor tem descrição configurada na tela de Contas (campo "Descrição do autor")
- **Quando** um utilizador abre a página do artigo (por slug)
- **Então** após o conteúdo do artigo é exibida uma secção com o nome do autor e o texto da descrição (e avatar se existir)
- **E** o texto exibido é o mesmo configurado no perfil do autor em Contas

#### Scenario: Artigo sem descrição do autor não mostra secção vazia

- **Dado** um post cujo autor não tem descrição configurada (`author.bio` nulo ou vazio)
- **Quando** um utilizador abre a página do artigo
- **Então** não é exibida uma secção de descrição do autor (ou a secção é omitida de forma que não fique um bloco vazio)

#### Scenario: Resposta pública do post inclui author.bio

- **Quando** o cliente solicita um post por slug para leitura pública (GET /bff/posts/{slug} ou equivalente)
- **Então** a resposta inclui o objeto do autor com pelo menos `name` e `bio` (e opcionalmente `avatar`), de forma que o frontend possa exibir a descrição do autor no final da página
