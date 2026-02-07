# Design: Caminho determinístico para SQLite e MigrateAsync()

## Problem

- A connection string padrão é `"Data Source=blog.db"`. No provider SQLite do .NET, paths relativos em "Data Source" são resolvidos em relação ao **Current Working Directory (CWD)** do processo, não ao diretório do executável nem ao diretório do projeto.
- Consoante como a API é iniciada (terminal com `cd backend/api`, IDE a correr a partir da raiz, `dotnet run --project backend/api` da raiz), o CWD pode ser diferente. Assim, `MigrateAsync()` pode estar a aplicar migrações a `repo/blog.db` enquanto o utilizador aplica scripts a `backend/api/blog.db`, ou o contrário — resultando na perceção de que "as migrações não estão a ser aplicadas".

## Decision: Resolve relative path using Content Root

- Obter a connection string (config ou fallback "Data Source=blog.db").
- Se o valor de "Data Source" for um path **relativo** (não começa por `/` nem por letra+`:`, e não é URI), resolver para **path absoluto** com base em `IWebHostEnvironment.ContentRootPath`. Em desenvolvimento, quando se corre a API a partir de `backend/api`, o Content Root é tipicamente `backend/api`; quando se usa `dotnet run --project backend/api` da raiz, o Content Root é também a pasta do projeto. Assim, o ficheiro da base fica sempre em `{ContentRoot}/blog.db` (ou o nome configurado).
- Usar a connection string com o path absoluto no `AddDbContext` / `UseSqlite()`, para que `MigrateAsync()` e todas as queries usem o mesmo ficheiro.

## Implementation note

- Parsing simples: se `connectionString` contém "Data Source=", extrair o valor; se não for path absoluto (Path.IsPathRooted), combinar com `ContentRootPath` e reconstruir a connection string. Tratar também "Data Source" com espaços e variações (ex.: `Data Source=blog.db`).
- Alternativa robusta: usar `SqliteConnectionStringBuilder` para parse e set de `DataSource`; depois `Path.GetFullPath(dataSource, ContentRootPath)` (ou `Path.Combine(ContentRootPath, dataSource)` quando relativo).

## Optional: Log resolved path

- Após `MigrateAsync()`, logar por exemplo "Database migrations applied. Database file: {path}." para que, em logs, se confirme qual ficheiro foi migrado.
