# Blog API (Backend interno)

API interna .NET 8 + Entity Framework Core + SQLite. Expõe endpoints de leitura de posts. **Não deve ser exposta à internet**; apenas o BFF consome esta API.

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Build

```bash
cd backend/api
dotnet restore
dotnet build
```

O comando `dotnet run` faz restore e build automaticamente quando necessário.

## Configuração

- **Connection string**: `appsettings.json` ou variável de ambiente. Padrão: `Data Source=blog.db` (arquivo SQLite na pasta do projeto).
- **Porta**: por padrão `http://localhost:5001` (ver `Properties/launchSettings.json`).

## Como rodar

```bash
cd backend/api
dotnet run
```

A primeira execução aplica as migrations e insere o seed (1 autor, 5 posts). O arquivo `blog.db` é criado na pasta do projeto.

## Endpoints

- `GET /api/posts` — lista posts. Query: `published` (bool, opcional), `order` (`date` ou `story`, padrão `date`).
- `GET /api/posts/{slug}` — post por slug (inclui author).

Respostas em JSON com formato compatível ao frontend (snake_case: `cover_image`, `published_at`, `story_order`, `author` aninhado).

## Troubleshooting

**Se o build falhar:**

1. Verifique a versão do SDK: `dotnet --version` deve ser **9.x** (ex.: 9.0.113). O projeto usa o `global.json` em `backend/` para exigir .NET 9.
2. Execute um restore limpo: `dotnet clean` e em seguida `dotnet restore` dentro de `backend/api`, depois `dotnet build` novamente.
3. Se não tiver .NET 9 instalado, baixe em [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0).

**Se `dotnet run` falhar com "Address already in use":** a porta 5001 está ocupada (outra instância da API, do BFF ou outro processo). Opções:

1. **Usar o perfil na porta 5002:** `dotnet run --launch-profile http-5002`. Configure o BFF com a mesma URL da API (ex.: `API__BaseUrl=http://localhost:5002` em variável de ambiente ou em `backend/bff/appsettings.json`).
2. **Usar outra porta (variável de ambiente):** `ASPNETCORE_URLS=http://localhost:5002 dotnet run`. Se fizer isso, configure o BFF com `API__BaseUrl=http://localhost:5002`.
3. **Liberar a porta 5001:** no macOS/Linux, veja qual processo usa a porta com `lsof -i :5001` e encerre-o (ex.: outra instância da API que ficou rodando). Depois rode `dotnet run` de novo.
