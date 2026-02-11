# project-docs — delta for add-remaining-hardening-improvements-and-db-script-rule

## ADDED Requirements

### Requirement: Alterações de esquema de base de dados exigem script manual e documentação

Quando uma **change** introduz **alteração de esquema de base de dados** (nova tabela, nova coluna, ou migração EF Core que altere o esquema persistido), o projeto **deve** (SHALL): (1) disponibilizar um **script SQL** em `backend/api/Migrations/Scripts/` destinado à **execução manual** por operadores que não usem apenas `MigrateAsync()` ao arranque; (2) referenciar esse script no **README da API** (`backend/api/README.md`), na secção de migrações manuais ou equivalente, e nas **tarefas da change**. Isto aplica-se sempre que a alteração de esquema for relevante para upgrades (ex.: nova coluna ou tabela); alterações que não alterem o esquema (ex.: apenas lógica) não exigem script.

#### Scenario: Change com nova coluna inclui script e documentação

- **Dado** que uma change adiciona uma nova coluna a uma tabela existente (ex.: via migração EF Core)
- **Quando** a change está implementada e aprovada
- **Então** existe um ficheiro SQL em `backend/api/Migrations/Scripts/` que aplica essa alteração (ex.: `ALTER TABLE ... ADD COLUMN ...`)
- **E** o README da API lista ou referencia esse script na secção de migrações manuais (e/ou Troubleshooting)
- **E** as tarefas da change incluem a criação do script e a atualização do README

#### Scenario: Operador aplica upgrade com script manual

- **Dado** que o operador está a atualizar uma instalação existente e prefere aplicar o esquema manualmente antes de iniciar a nova API
- **Quando** a nova versão inclui alteração de esquema (nova coluna ou tabela)
- **Então** o operador encontra no README da API (ou no guia de atualização) a referência ao script em `Migrations/Scripts/`
- **E** pode executar o script uma vez contra o ficheiro da base de dados (ex.: `sqlite3 blog.db < Migrations/Scripts/nome.sql`) e depois iniciar a API
