# Proposal: Garantir que MigrateAsync() use sempre o mesmo ficheiro SQLite (caminho determinístico)

## Summary

O `MigrateAsync()` não parece estar a aplicar as migrações na prática: mesmo após `dotnet build && dotnet run`, os operadores têm de executar os scripts SQL manualmente. A causa mais provável é que a connection string **"Data Source=blog.db"** é interpretada pelo SQLite como **path relativo ao diretório de trabalho atual (Current Working Directory)** do processo, e não ao diretório do projeto ou da aplicação. Assim, consoante o sítio de onde se invoca `dotnet run` (raiz do repo, `backend/api`, ou IDE), o processo pode estar a usar **ficheiros `blog.db` diferentes**: as migrações aplicam-se a um ficheiro, enquanto o utilizador ou outro processo espera outro. Este change (1) **torna o caminho da base de dados determinístico** resolvendo paths relativos em "Data Source" relativamente ao **Content Root** da aplicação (diretório do projeto em dev quando se corre de `backend/api`), para que `MigrateAsync()` e todo o runtime usem sempre o mesmo ficheiro; (2) **documenta** o comportamento e opcionalmente regista em log o path resolvido ao arranque, para validação; (3) **valida** que o fluxo "dotnet build && dotnet run" a partir de `backend/api` aplica as migrações ao `blog.db` esperado.

## Goals

- **Caminho determinístico**: A API SHALL resolve paths relativos na connection string (ex.: "Data Source=blog.db") relativamente ao **Content Root** da aplicação, de modo que o mesmo ficheiro SQLite seja usado independentemente do diretório de trabalho do processo ao iniciar.
- **MigrateAsync() aplica ao ficheiro certo**: Ao correr `dotnet run` a partir de `backend/api`, as migrações EF Core aplicam-se ao `blog.db` nessa pasta; não é necessário aplicar scripts manualmente para o cenário de desenvolvimento local padrão.
- **Visibilidade**: Opcionalmente logar ao arranque o path absoluto do ficheiro da base de dados (ou indicar que se está a usar path resolvido), para facilitar o diagnóstico quando algo falha.

## Scope

- **In scope**: (1) Em `Program.cs`, antes de registar o `DbContext`, obter a connection string e, se "Data Source" for um path relativo (ex.: `blog.db`), resolver para um path absoluto usando `Path.Combine(builder.Environment.ContentRootPath, fileName)`. Usar a connection string resolvida no `UseSqlite()`. (2) Opcionalmente, após `MigrateAsync()`, logar uma mensagem que inclua o path do ficheiro da base (ou "Database file: <path>") para confirmação. (3) Em `backend/api/README.md`, documentar que a API resolve o path da base relativamente ao Content Root e que o cenário recomendado para desenvolvimento local é executar a API a partir de `backend/api` (`cd backend/api && dotnet run`), de forma a que `blog.db` fique nessa pasta e as migrações se apliquem automaticamente. (4) Spec delta (project-docs ou backend): requisito ADDED de que a API usa um path determinístico para o SQLite (resolução relativamente ao Content Root) para que as migrações ao arranque atinjam o ficheiro esperado.
- **Out of scope**: Alterar a lógica das migrações EF Core; suportar múltiplas connection strings; alterar o comportamento em Docker (no contentor o CWD e o content root estão alinhados com a imagem).

## Affected code and docs

- **backend/api/Program.cs**: (1) Resolver "Data Source" relativo para path absoluto usando `builder.Environment.ContentRootPath`. (2) Opcional: log após MigrateAsync com o path do ficheiro (pode obter do DbContext ou da connection string resolvida).
- **backend/api/README.md**: Secção de configuração ou "Migrações automáticas": indicar que o path da base é resolvido relativamente ao Content Root; recomendar `cd backend/api && dotnet run` para desenvolvimento local para que as migrações apliquem ao `blog.db` nessa pasta.
- **openspec/changes/fix-sqlite-connection-path-for-migrate-async/specs/project-docs/spec.md** (ou backend): ADDED — a API resolve paths relativos na connection string SQLite relativamente ao Content Root para garantir que MigrateAsync() e o runtime usam o mesmo ficheiro; cenário: operador corre `cd backend/api && dotnet build && dotnet run` e as migrações pendentes são aplicadas ao `blog.db` em backend/api sem scripts manuais.

## Dependencies and risks

- **Compatibilidade**: Se alguém dependia de "correr a API da raiz do repo" e ter `blog.db` na raiz, após o change o ficheiro passará a ser resolvido para `backend/api/blog.db` (Content Root = pasta do projeto quando se usa `dotnet run --project backend/api`). Em .NET, ao usar `dotnet run --project backend/api`, o Content Root é tipicamente a pasta **do projeto** (backend/api), pelo que o comportamento fica alinhado com a expectativa "blog.db em backend/api". Risco baixo.
- **Docker**: No contentor, o working directory e o content root são os da imagem; o path resolvido será o mesmo que hoje se o CWD já for a pasta da API. Sem alteração de comportamento em produção.

## Success criteria

- Com a connection string padrão "Data Source=blog.db", o ficheiro efetivamente usado é `{ContentRootPath}/blog.db`. Ao correr `cd backend/api && dotnet build && dotnet run`, as migrações pendentes são aplicadas a esse ficheiro e não é necessário executar scripts SQL manualmente para colunas introduzidas por migrações existentes (ex.: IncludeInStoryOrder, ViewCount).
- Documentação atualizada e spec delta validado com `openspec validate fix-sqlite-connection-path-for-migrate-async --strict`.
