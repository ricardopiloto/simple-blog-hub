# branding — delta for add-github-link-to-footer-and-docs

## ADDED Requirements

### Requirement: Rodapé exibe link para o repositório GitHub do projeto

O **rodapé** da aplicação **deve** (SHALL) exibir um link clicável para o **repositório do projeto no GitHub** (URL canónica: https://github.com/ricardopiloto/simple-blog-hub). O link **deve** abrir numa nova aba (`target="_blank"`) e **deve** usar `rel="noopener noreferrer"`. O texto ou etiqueta do link **deve** ser acessível (ex.: "Código no GitHub", "GitHub" ou ícone com texto alternativo). O objetivo é permitir que visitantes e desenvolvedores acedam ao código fonte do projeto a partir do próprio site.

#### Scenario: Utilizador vê e clica no link do repositório no rodapé

- **Dado** que o utilizador está em qualquer página do site com rodapé visível
- **Quando** visualiza o rodapé
- **Então** existe um link visível para o repositório do projeto (ex.: "Código no GitHub" ou ícone + texto)
- **E** ao clicar no link, o repositório GitHub abre numa nova aba
- **E** o link aponta para o URL canónico do projeto (https://github.com/ricardopiloto/simple-blog-hub)
