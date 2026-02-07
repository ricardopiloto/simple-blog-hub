# Design: Guia de atualização e versionamento v1.3

## Estrutura do guia de atualização

- **Atualização local (desenvolvimento)**  
  Passos: pull; build da API e do BFF (`dotnet build`); executar API e BFF (`dotnet run` a partir de `backend/api` e `backend/bff`); build do frontend e servir (ex.: `npm run dev`). Se a base de dados estiver desatualizada (erro "no such column"), aplicar scripts manuais a partir da pasta onde está o `blog.db` (ex.: `backend/api`) ou reconstruir e reiniciar a API para que `MigrateAsync()` aplique as migrações.

- **Atualização Docker (produção)**  
  Passos: pull; `docker compose build --no-cache` (ou `build api` quando há novas migrações); `docker compose up -d`; build do frontend no host e copiar para o document root do Caddy. Scripts manuais: quando necessário, usar o volume da API ou copiar a base para o host, executar o script SQL e (se aplicável) devolver ao volume; comandos concretos documentados por script.

## Scripts de banco (lista atual)

| Script | Coluna/tabela | Quando usar |
|--------|----------------|-------------|
| `backend/api/Migrations/Scripts/add_view_count_to_posts.sql` | ViewCount em Posts | Se "no such column: p.ViewCount" e não quiser depender de MigrateAsync(). |
| `backend/api/Migrations/Scripts/add_include_in_story_order_to_posts.sql` | IncludeInStoryOrder em Posts | Se "no such column: p.IncludeInStoryOrder" e não quiser depender de MigrateAsync(). |

Cada script deve ter instruções para **local** (caminho do `blog.db`, comando `sqlite3`) e para **Docker** (volume, `docker run` com sqlite3 ou copiar base para o host).

## Versionamento

- A partir de agora, os releases são marcados com uma versão semântica (ex.: v1.3, v1.4).
- O commit que consolida a release pode incluir na mensagem o resumo (changelog) das changes OpenSpec aplicadas; a tag (ex.: `git tag v1.3`) identifica o ponto no histórico.
- Opcional: ficheiro CHANGELOG.md na raiz com uma entrada por versão; nesta change pode-se apenas deixar o resumo na proposta para o commit v1.3.
