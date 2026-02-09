# branding — delta for add-app-version-in-footer

## ADDED Requirements

### Requirement: Rodapé exibe a versão atual da aplicação

O **rodapé** do site **deve** (SHALL) exibir a **versão atual da aplicação** (ex.: "Versão 1.7" ou "v1.7") de forma visível e discreta. A versão **deve** ser obtida em **tempo de build** a partir de uma **única fonte de verdade** (ex.: campo `version` do `package.json` do frontend ou variável de ambiente `VITE_APP_VERSION`), injectada no bundle pelo processo de build (ex.: Vite `define`), de forma a que não seja necessária nenhuma chamada em runtime. Sempre que se fizer um **novo build** com a fonte de versão atualizada, o rodapé **deve** refletir automaticamente essa versão. Se a versão não estiver definida ou for indicativa de desenvolvimento (ex.: "0.0.0"), o rodapé **pode** exibir "Versão dev" ou omitir a linha da versão.

#### Scenario: Utilizador vê a versão no rodapé

- **Dado** que a aplicação foi construída com uma versão definida (ex.: 1.7.0 no package.json)
- **Quando** o utilizador visualiza qualquer página do site e desloca-se ao rodapé
- **Então** o rodapé exibe a versão atual (ex.: "Versão 1.7" ou "v1.7") em texto discreto
- **E** o utilizador ou operador pode identificar que versão do frontend está em execução

#### Scenario: Novo build com versão atualizada reflete no rodapé

- **Dado** que o maintainer atualizou a fonte da versão (ex.: package.json para "1.8.0") e executou o build do frontend
- **Quando** o novo bundle é implantado e o utilizador carrega o site
- **Então** o rodapé exibe a nova versão (ex.: "Versão 1.8" ou "v1.8")
- **E** não é necessária alteração manual no código do componente Footer para atualizar o número
