# project-docs — delta for add-github-link-to-footer-and-docs

## ADDED Requirements

### Requirement: Documentação referencia o repositório do projeto (URL canónico)

A documentação do projeto **deve** (SHALL) referenciar de forma explícita o **repositório do projeto no GitHub** com o URL canónico (https://github.com/ricardopiloto/simple-blog-hub). O **README.md** **deve** incluir esse URL (ex.: no início, numa secção "Repositório" ou equivalente) para que quem clona ou consulta a documentação saiba onde encontrar o código. O **openspec/project.md** **deve** mencionar o repositório onde fizer sentido (ex.: contexto do projeto ou convenções de Git). Nos guias de deploy (**DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**), onde se instrui a clonar ou a atualizar o código (ex.: `git clone`, `git pull`), **deve** ser indicado o URL canónico como exemplo (ex.: "Ex.: https://github.com/ricardopiloto/simple-blog-hub") para facilitar a configuração em novos ambientes.

#### Scenario: Leitor do README encontra o link do repositório

- **Quando** um desenvolvedor ou operador abre o README.md do projeto
- **Então** encontra uma referência clara ao repositório GitHub (URL ou secção "Repositório" com o link)
- **E** pode usar esse URL para clonar ou partilhar o projeto

#### Scenario: Guias de deploy incluem exemplo de URL para clone/atualização

- **Quando** um operador segue DEPLOY-DOCKER-CADDY.md ou ATUALIZAR-SERVIDOR-DOCKER-CADDY.md e precisa de clonar ou atualizar o repositório
- **Então** as instruções incluem o URL canónico como exemplo (ex.: `git clone https://github.com/ricardopiloto/simple-blog-hub repo`)
- **E** não é necessário procurar o URL noutro sítio
