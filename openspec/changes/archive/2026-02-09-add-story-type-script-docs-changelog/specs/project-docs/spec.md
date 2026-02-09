# project-docs — delta for add-story-type-script-docs-changelog

## ADDED Requirements

### Requirement: Script SQL e documentação para a coluna StoryType; CHANGELOG atualizado

O repositório **deve** (SHALL) incluir um **script SQL manual** em `backend/api/Migrations/Scripts/add_story_type_to_posts.sql` que adiciona a coluna **StoryType** à tabela Posts (para upgrades em que a migração EF Core não foi aplicada). O **README da API** (`backend/api/README.md`) **deve** documentar esse script na secção de migrações manuais e **deve** incluir na secção Troubleshooting uma entrada para o erro "no such column: p.StoryType" (ou "no such column: StoryType") com passos de resolução (reconstruir/restart da API ou executar o script manualmente). O **CHANGELOG** na raiz do repositório **deve** ter uma secção para a versão que inclui estas alterações (ex.: [1.7]) listando as changes OpenSpec aplicadas (incl. tipo de história no post, toggle no Índice da História, campo História como toggle e obrigatório, resumo não atualizado ao editar, e script/docs/changelog).

#### Scenario: Operador aplica o script ou reconstrói a API

- **Dado** que o operador tem uma base de dados criada antes da migração que adiciona StoryType
- **Quando** a API arranca e devolve erro "no such column: p.StoryType"
- **Então** o operador pode consultar o README da API (Troubleshooting) e seguir os passos: reconstruir e reiniciar a API, ou executar o script `add_story_type_to_posts.sql` uma vez e reiniciar
- **E** após aplicar uma das soluções, a API funciona com a coluna StoryType

#### Scenario: Leitor consulta o CHANGELOG e vê a nova versão

- **Dado** que o repositório tem a secção [1.7] (ou a versão acordada) no CHANGELOG
- **Quando** um leitor ou operador abre o CHANGELOG
- **Então** vê listadas as alterações dessa versão, incluindo a funcionalidade de tipo de história (Velho Mundo / Idade das Trevas), o toggle no Índice da História, o campo História como toggle e obrigatório no formulário de post, e o script/documentação para a coluna StoryType
