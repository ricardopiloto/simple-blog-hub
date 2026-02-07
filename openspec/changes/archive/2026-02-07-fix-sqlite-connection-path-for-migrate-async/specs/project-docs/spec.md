# project-docs — delta for fix-sqlite-connection-path-for-migrate-async

## ADDED Requirements

### Requirement: API usa path determinístico para a base SQLite (Content Root)

A API **deve** (SHALL) resolver paths relativos na connection string SQLite ("Data Source") **relativamente ao Content Root** da aplicação (e não ao diretório de trabalho do processo), de modo que `MigrateAsync()` e todo o runtime usem **o mesmo ficheiro** de base de dados. Isto evita que, consoante o sítio de onde se invoca `dotnet run`, um ficheiro `blog.db` diferente seja usado e que as migrações pareçam "não estar a ser aplicadas" (por aplicarem-se a outro ficheiro). A documentação da API (README) **deve** indicar que o cenário recomendado para desenvolvimento local é executar a API a partir de `backend/api` (`cd backend/api && dotnet run`), para que o `blog.db` fique nessa pasta e as migrações ao arranque se apliquem a esse ficheiro sem necessidade de scripts manuais.

#### Scenario: Operador corre build e run a partir de backend/api e migrações aplicam-se

- **Dado** que existem migrações EF Core pendentes (ex.: coluna IncludeInStoryOrder)
- **Quando** o operador executa `cd backend/api && dotnet build && dotnet run`
- **Então** a API usa o ficheiro `blog.db` em `backend/api` (path resolvido pelo Content Root)
- **E** `MigrateAsync()` aplica as migrações pendentes a esse ficheiro ao arranque
- **E** não é necessário executar scripts SQL manuais para colunas introduzidas por essas migrações
