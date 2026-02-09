# branding — delta for add-version-next-to-github-in-footer

## ADDED Requirements

### Requirement: Versão no rodapé exibida ao lado do link "Código no GitHub"

A **versão da aplicação** exibida no rodapé (conforme o requisito "Rodapé exibe a versão atual da aplicação") **deve** (SHALL) ser apresentada **na mesma linha** (ou no mesmo bloco visual) que o link para o repositório GitHub ("Código no GitHub"). O rodapé **deve** usar um único parágrafo (ou linha) que contenha o link para o GitHub e, em seguida, o texto da versão (ex.: "Versão 1.8" ou "Versão dev"), com um **separador opcional** (ex.: " · ") entre o link e a versão para legibilidade. O objetivo é agrupar a referência ao repositório e a versão no mesmo contexto visual.

#### Scenario: Utilizador vê link do GitHub e versão na mesma linha no rodapé

- **Dado** que o utilizador está em qualquer página do site com rodapé visível
- **Quando** visualiza a zona inferior do rodapé (copyright e links)
- **Então** o link "Código no GitHub" e o texto da versão (ex.: "Versão 1.8") aparecem no **mesmo parágrafo ou linha**
- **E** existe um separador legível entre o link e a versão (ex.: " · ")
- **E** o link continua a abrir numa nova aba e a versão reflete o valor de build (`__APP_VERSION__`)
