# project-docs — delta for add-version-1-3-and-update-deploy-docs

## ADDED Requirements

### Requirement: Guia de atualização com secções local e Docker e lista de scripts de banco

A documentação do projeto SHALL incluir um **guia de atualização** (como atualizar o código e os serviços após um `git pull`) com **secções claras** que separem:

- **Atualização local (desenvolvimento)**: passos para atualizar e executar a API, o BFF e o frontend em ambiente de desenvolvimento (ex.: `dotnet run` a partir de `backend/api` e `backend/bff`, SQLite em `blog.db`), incluindo quando e como aplicar migrações ou scripts manuais se a base estiver desatualizada.
- **Atualização Docker (produção)**: passos para atualizar no servidor com Docker (pull, rebuild das imagens, `docker compose up -d`, build do frontend e cópia para o document root), com ênfase na reconstrução da imagem da API quando há novas migrações.

O guia SHALL listar os **scripts de banco de dados** que podem ser aplicados manualmente (ex.: `add_view_count_to_posts.sql`, `add_include_in_story_order_to_posts.sql`), com instruções ou referências explícitas para **cada ambiente** (local: comando `sqlite3` a partir da pasta da API; Docker: uso do volume ou cópia da base para o host, execução do script, e quando aplicável devolução ao volume). A referência ao README da API (Troubleshooting e migrações manuais) é aceitável para o detalhe completo dos comandos Docker.

#### Scenario: Operador atualiza em Docker e consulta scripts de banco

- **GIVEN** o operador está a atualizar o servidor com Docker (após `git pull`)
- **WHEN** precisa de aplicar um script de banco manualmente (ex.: coluna IncludeInStoryOrder em falta)
- **THEN** o guia de atualização contém a secção "Atualização Docker" e uma subsecção ou lista de "Scripts de banco de dados"
- **AND** o operador encontra o script relevante (ex.: `add_include_in_story_order_to_posts.sql`) com indicação de como executar em ambiente Docker (ou referência ao README da API para os comandos completos)

#### Scenario: Desenvolvedor atualiza localmente

- **GIVEN** o desenvolvedor faz pull e corre a API localmente (`cd backend/api && dotnet run`)
- **WHEN** consulta como atualizar em desenvolvimento
- **THEN** o guia contém a secção "Atualização local (desenvolvimento)" com passos de build e execução
- **AND** se precisar de scripts manuais, encontra a lista de scripts e o comando para ambiente local (ex.: `sqlite3 blog.db < Migrations/Scripts/...` a partir de `backend/api`)
