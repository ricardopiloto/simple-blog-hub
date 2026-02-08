# home-page — delta for hide-newsletter-section-until-implemented

## ADDED Requirements

### Requirement: Secção "Fique por Dentro" não exibida até newsletter implementada

A secção **"Fique por Dentro"** (título, texto "Acompanhe as novidades e não perca nenhum artigo.", campo de e-mail e botão "Inscrever") **não deve** (SHALL NOT) ser exibida na **página inicial** (`/`) até que a funcionalidade de newsletter (inscrição e notificação por e-mail) esteja implementada. O frontend **deve** omitir a renderização dessa secção para que o utilizador não veja um formulário sem funcionalidade. Quando a change de newsletter (ex.: add-newsletter-subscribe-and-notify) for aplicada, a secção **deve** voltar a ser exibida com o formulário ligado ao backend.

#### Scenario: Página inicial não mostra secção "Fique por Dentro"

- **Dado** que o utilizador acede à página inicial (`/`)
- **Quando** a página é renderizada
- **Então** a secção com o título "Fique por dentro", o texto de acompanhamento e o botão "Inscrever" **não** é exibida
- **E** o utilizador vê apenas o Destaque, Artigos recentes e demais conteúdos da página inicial
