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
- **Admin (Admin:Email / Admin__Email)**: o ficheiro versionado usa apenas placeholder (ex.: admin@example.com). Em produção configurar via variável de ambiente `Admin__Email` ou ficheiro não versionado (appsettings.Production.json, etc.); não commitar e-mails ou credenciais reais.

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

## Migrações automáticas

A API executa `MigrateAsync()` ao arranque (antes do seed e do utilizador inicial). O caminho da base SQLite (ex.: `blog.db`) é resolvido **relativamente ao Content Root** da aplicação (e não ao diretório de trabalho do processo), de modo que o mesmo ficheiro seja sempre usado e as migrações se apliquem ao ficheiro esperado. Para desenvolvimento local, execute a API a partir de `backend/api` (`cd backend/api && dotnet run`): o `blog.db` fica nessa pasta e as migrações pendentes são aplicadas ao arranque; não é necessário executar scripts SQL manualmente após um pull que inclua novas migrações (basta `dotnet build && dotnet run` nesta pasta). Em deploy com Docker, é necessário **reconstruir** a imagem da API quando há novas migrações (`docker compose build api` ou `docker compose build --no-cache`), para que o novo código esteja na imagem; ao arrancar o contentor, as migrações são aplicadas automaticamente. Com o docker-compose por defeito, a base fica na pasta `data/` no host (bind mount); ver **[EXPOR-DB-NO-HOST.md](../../EXPOR-DB-NO-HOST.md)** na raiz do repo para executar scripts SQL no host. Os scripts manuais abaixo são uma opção para quem preferir aplicar alterações ao esquema antes de iniciar a nova API.

O guia de atualização do projeto (passos local e Docker e lista de scripts de banco) está em **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](../../ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)** (raiz do repositório).

## Migrações manuais (upgrade)

Se estiver a atualizar de uma versão **anterior** que não tinha a coluna **ViewCount** (contagem de visualizações por post) e preferir aplicar o schema manualmente em vez de depender do `MigrateAsync()` na arrancada da API, pode executar o script SQL em `Migrations/Scripts/add_view_count_to_posts.sql`:

```bash
sqlite3 blog.db < Migrations/Scripts/add_view_count_to_posts.sql
```

(Substitua `blog.db` pelo caminho do seu ficheiro SQLite.) Execute **uma vez**. Se a coluna já existir (por exemplo, a migração EF já foi aplicada), o SQLite devolverá erro; pode ignorar e não voltar a executar.

Para a coluna **IncludeInStoryOrder** (posts "faz parte da ordem da história"), use o script `Migrations/Scripts/add_include_in_story_order_to_posts.sql` da mesma forma (executar uma vez; se a coluna já existir, ignorar o erro).

Para a coluna **ScheduledPublishAt** (agendamento de publicação de posts), use o script `Migrations/Scripts/add_scheduled_publish_at_to_posts.sql` da mesma forma (executar uma vez; se a coluna já existir, ignorar o erro).

Para a coluna **StoryType** (tipo de história do post: Velho Mundo / Idade das Trevas), use o script `Migrations/Scripts/add_story_type_to_posts.sql` da mesma forma (executar uma vez; se a coluna já existir, ignorar o erro).

Para as colunas **CloudflareAccountId** e **CloudflareApiTokenEncrypted** (credenciais Cloudflare Workers AI por autor, Geração de Imagem), use o script `Migrations/Scripts/add_cloudflare_credentials_to_author.sql` da mesma forma (executar uma vez; se as colunas já existirem, ignorar o erro). Em desenvolvimento local, reiniciar a API após `dotnet build` também aplica a migração EF `AddCloudflareCredentialsToAuthor` quando registada.

Para a coluna **CloudflareImageModel** (modelo Workers AI configurável por autor), use o script `Migrations/Scripts/add_cloudflare_image_model_to_author.sql` da mesma forma (executar uma vez; se a coluna já existir, ignorar o erro). Migração EF: `AddCloudflareImageModelToAuthor`.

### Regra para alterações de esquema

**Qualquer change** que introduza **alteração de esquema de base de dados** (nova tabela, nova coluna, ou migração EF Core que altere o esquema) **deve** incluir um script SQL em `backend/api/Migrations/Scripts/` para execução manual quando aplicável, e a change **deve** referenciar esse script neste README (na lista acima ou na secção Troubleshooting) e nas suas tarefas. Isto permite upgrades em ambientes onde as migrações não são aplicadas automaticamente ao arranque e garante rastreabilidade.

## Troubleshooting

**Se aparecer "no such column: p.ViewCount" (ou "no such column: ViewCount"):** a base de dados foi criada antes da migração que adiciona a coluna ViewCount. Duas formas de resolver:

1. **Recomendado (Docker):** Reconstruir a imagem da API com o código actual e reiniciar. Na arrancada, a API aplica as migrações EF Core (incl. ViewCount). Não é preciso SQL manual.
   ```bash
   docker compose build --no-cache api
   docker compose up -d api
   ```
   Se já tiver feito `git pull` e o código tiver a migração, isto basta. A API chama `MigrateAsync()` ao iniciar e adiciona a coluna.

2. **Migração manual (local):** A partir da pasta `backend/api`, onde está o `blog.db`:
   ```bash
   cd backend/api
   sqlite3 blog.db < Migrations/Scripts/add_view_count_to_posts.sql
   ```
   Se o `blog.db` estiver noutro caminho (ex.: definido em `ConnectionStrings:DefaultConnection`), use esse caminho. Depois reinicie a API.

3. **Migração manual com Docker (se o script no volume não funcionou):**  
   Executar os comandos **na raiz do repositório no servidor** (a pasta onde está o `docker-compose.yml` e a pasta `backend/`). Ex.: se o projeto está em REPO_DIR (o diretório onde fizeste clone do repositório no servidor), faça `cd REPO_DIR` antes.

   **Opção A – Tudo dentro do Docker com imagem Ubuntu** (não precisa de `sqlite3` no host). Na raiz do repo, com o script em `backend/api/Migrations/Scripts/add_view_count_to_posts.sql`:
   ```bash
   # NOME_DO_VOLUME = resultado de: docker volume ls | grep blog_api_data
   docker run --rm -v NOME_DO_VOLUME:/data -v $(pwd)/backend/api/Migrations/Scripts:/scripts ubuntu:22.04 sh -c "apt-get update -qq && apt-get install -y -qq sqlite3 && sqlite3 /data/blog.db < /scripts/add_view_count_to_posts.sql"
   ```
   Depois: `docker compose up -d api`. (Se der erro "column ViewCount already exists", pode ignorar.)

   **Opção B – Copiar a base para o host, executar no host e devolver.** Os contentores de cópia abaixo usam `alpine` (leve); se preferir Ubuntu, troque `alpine` por `ubuntu:22.04` e use `cp` da mesma forma.
   - Nome do volume: `docker volume ls | grep blog_api_data`
   - Copiar a base para a pasta actual:
     ```bash
     docker run --rm -v NOME_DO_VOLUME:/data -v $(pwd):/out alpine cp /data/blog.db /out/blog.db
     ```
   - No host (Ubuntu/Debian: `sudo apt install sqlite3`), executar o script:
     ```bash
     sqlite3 blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql
     ```
   - Devolver ao volume:
     ```bash
     docker run --rm -v NOME_DO_VOLUME:/data -v $(pwd):/out alpine cp /out/blog.db /data/blog.db
     ```
   - Reiniciar a API: `docker compose up -d api`.

**Se aparecer "no such column: p.IncludeInStoryOrder" (ou "no such column: IncludeInStoryOrder"):** a base de dados ainda não tem a coluna da migração que adiciona "faz parte da ordem da história" aos posts. Duas formas de resolver:

1. **Recomendado:** Reconstruir e reiniciar a API para que `MigrateAsync()` execute a migração ao arranque. Em desenvolvimento local: pare a API, faça `dotnet build` em `backend/api` e volte a executar `dotnet run`. Com Docker: `docker compose build --no-cache api` e `docker compose up -d api`.
2. **Migração manual (local):** Se preferir aplicar o esquema à mão, execute o script SQL uma vez:
   ```bash
   cd backend/api
   sqlite3 blog.db < Migrations/Scripts/add_include_in_story_order_to_posts.sql
   ```
   (Substitua `blog.db` pelo caminho do seu ficheiro SQLite.) Depois reinicie a API. Se a coluna já existir, o SQLite devolverá erro; pode ignorar.

**Se aparecer "no such column: p.ScheduledPublishAt" (ou "no such column: ScheduledPublishAt"):** a base de dados ainda não tem a coluna da migração que adiciona o agendamento de publicação. Duas formas de resolver:

1. **Recomendado:** Reconstruir e reiniciar a API para que `MigrateAsync()` aplique a migração ao arranque. Em desenvolvimento local: pare a API, faça `dotnet build` em `backend/api` e volte a executar `dotnet run`. Com Docker: `docker compose build --no-cache api` e `docker compose up -d api`.
2. **Migração manual (local):** Execute o script SQL uma vez:
   ```bash
   cd backend/api
   sqlite3 blog.db < Migrations/Scripts/add_scheduled_publish_at_to_posts.sql
   ```
   (Substitua `blog.db` pelo caminho do seu ficheiro SQLite.) Depois reinicie a API. Se a coluna já existir, o SQLite devolverá erro; pode ignorar.

**Se aparecer "no such column: p.StoryType" (ou "no such column: StoryType"):** a base de dados ainda não tem a coluna da migração que adiciona o tipo de história (Velho Mundo / Idade das Trevas) aos posts. Duas formas de resolver:

1. **Recomendado:** Reconstruir e reiniciar a API para que `MigrateAsync()` aplique a migração ao arranque. Em desenvolvimento local: pare a API, faça `dotnet build` em `backend/api` e volte a executar `dotnet run`. Com Docker: `docker compose build --no-cache api` e `docker compose up -d api`.
2. **Migração manual (local):** Execute o script SQL uma vez:
   ```bash
   cd backend/api
   sqlite3 blog.db < Migrations/Scripts/add_story_type_to_posts.sql
   ```
   (Substitua `blog.db` pelo caminho do seu ficheiro SQLite.) Depois reinicie a API. Se a coluna já existir, o SQLite devolverá erro; pode ignorar.

**Se aparecer "no such column: a.CloudflareImageModel":** execute `Migrations/Scripts/add_cloudflare_image_model_to_author.sql` ou reinicie a API com código actual para aplicar a migração EF `AddCloudflareImageModelToAuthor`.

**Se aparecer "no such column: a.CloudflareAccountId" (ou "CloudflareApiTokenEncrypted"):** a base de dados ainda não tem as colunas da migração **AddCloudflareCredentialsToAuthor** (credenciais Cloudflare por autor). Duas formas de resolver:

1. **Recomendado:** Pare a API, faça `dotnet build` em `backend/api` e volte a executar `dotnet run` — o `MigrateAsync()` aplica a migração EF ao arranque.
2. **Migração manual (local):** Execute o script SQL uma vez:
   ```bash
   cd backend/api
   sqlite3 blog.db < Migrations/Scripts/add_cloudflare_credentials_to_author.sql
   ```
   Depois reinicie a API. Se as colunas já existirem, o SQLite devolverá erro; pode ignorar.

**Se a geração de imagem falhar com erro de token encriptado (`AuthenticationTagMismatchException` ou `token_decrypt_failed`):** o API Token foi guardado com uma **`Cloudflare__EncryptionKey` diferente** da que a API usa agora. Isto acontece em desenvolvimento se arrancar a API com `Cloudflare__EncryptionKey="$(openssl rand -base64 32)"` a cada sessão (cada arranque gera uma chave nova). Soluções:

1. **Desenvolvimento:** use a chave fixa em `appsettings.Development.json` (secção `Cloudflare:EncryptionKey`) e arranque com `dotnet run` **sem** sobrescrever a variável de ambiente; ou exporte a mesma chave uma vez: `export Cloudflare__EncryptionKey='...'` e reutilize-a.
2. **Recuperação:** abra **Contas**, cole o **API Token** Cloudflare de novo e salve (re-encripta com a chave actual).
3. **Produção:** nunca altere `Cloudflare__EncryptionKey` depois de autores guardarem tokens, a menos que todos voltem a registar o token.

**Se a Cloudflare devolver 401 (`Authentication error`):**

1. Crie o token em **Workers AI → Use REST API** no [dashboard Cloudflare](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) com permissões **Workers AI Read** e **Edit** (não use a Global API Key).
2. Copie o **Account ID** da mesma página **Use REST API** (não de outra secção do dashboard).
3. Em **Contas**, cole o API Token de novo e salve (re-encripta com a chave actual do servidor).
4. Use **Testar credenciais guardadas** em Contas para ver se o token ou o Account ID estão incorrectos.

A imagem gerada é devolvida ao browser em base64 e **não é guardada no servidor**.

**Se o build falhar:**

1. Verifique a versão do SDK: `dotnet --version` deve ser **8.x** (ex.: 8.0.401). O projeto usa o `global.json` em `backend/` para exigir .NET 8.
2. Execute um restore limpo: `dotnet clean` e em seguida `dotnet restore` dentro de `backend/api`, depois `dotnet build` novamente.
3. Se não tiver .NET 8 instalado, baixe em [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

**Se `dotnet run` falhar com "Address already in use":** a porta 5001 está ocupada (outra instância da API, do BFF ou outro processo). Opções:

1. **Usar o perfil na porta 5002:** `dotnet run --launch-profile http-5002`. Configure o BFF com a mesma URL da API (ex.: `API__BaseUrl=http://localhost:5002` em variável de ambiente ou em `backend/bff/appsettings.json`).
2. **Usar outra porta (variável de ambiente):** `ASPNETCORE_URLS=http://localhost:5002 dotnet run`. Se fizer isso, configure o BFF com `API__BaseUrl=http://localhost:5002`.
3. **Liberar a porta 5001:** no macOS/Linux, veja qual processo usa a porta com `lsof -i :5001` e encerre-o (ex.: outra instância da API que ficou rodando). Depois rode `dotnet run` de novo.
