# Tasks: fix-sqlite-connection-path-for-migrate-async

## 1. Resolver path relativo da connection string em Program.cs

- [x] 1.1 Em `backend/api/Program.cs`, antes de `AddDbContext<BlogDbContext>`, obter a connection string (config "ConnectionStrings:DefaultConnection" ou fallback "Data Source=blog.db"). Se o segmento "Data Source" for um path relativo (não absoluto), resolver para path absoluto com `Path.Combine(builder.Environment.ContentRootPath, fileName)` (extrair o nome do ficheiro do Data Source) e reconstruir a connection string. Usar a connection string resolvida em `options.UseSqlite(...)`. Utilizar `Microsoft.Data.Sqlite.SqliteConnectionStringBuilder` para parse e atribuição segura, ou parsing mínimo (ex.: procurar "Data Source=" e aplicar Path.IsPathRooted + Path.Combine).

## 2. Log do ficheiro da base (opcional)

- [x] 2.1 Após `MigrateAsync()`, logar uma mensagem que inclua o path do ficheiro da base de dados (ex.: "Database migrations applied. Database file: {path}.") para facilitar a validação. O path pode ser obtido da connection string resolvida guardada (ex.: variável) ou do DbContext (GetDbConnection().DataSource se disponível).

## 3. Documentação

- [x] 3.1 Em `backend/api/README.md`, na secção de configuração ou "Migrações automáticas", indicar que o path da base SQLite é resolvido relativamente ao **Content Root** da aplicação, de modo que o mesmo ficheiro seja sempre usado independentemente do diretório de trabalho. Recomendar para desenvolvimento local: executar a API a partir de `backend/api` (`cd backend/api && dotnet run`) para que `blog.db` fique nessa pasta e as migrações ao arranque se apliquem a esse ficheiro; assim não é necessário aplicar scripts manualmente após pull com novas migrações (desde que se faça build e run a partir dessa pasta).

## 4. Spec delta

- [x] 4.1 Em `openspec/changes/fix-sqlite-connection-path-for-migrate-async/specs/project-docs/spec.md`, ADDED requirement: a API SHALL resolve paths relativos na connection string SQLite ("Data Source") relativamente ao Content Root da aplicação, para que `MigrateAsync()` e todo o runtime usem o mesmo ficheiro de base de dados. Cenário: operador executa `cd backend/api && dotnet build && dotnet run`; as migrações EF Core pendentes são aplicadas ao ficheiro `blog.db` em backend/api; não é necessário executar scripts SQL manuais para colunas introduzidas por essas migrações.

## 5. Validação

- [x] 5.1 Executar `openspec validate fix-sqlite-connection-path-for-migrate-async --strict` e corrigir qualquer falha.
