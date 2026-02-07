# Design: Expor a base de dados no host para Docker

## Contexto

Atualmente o `docker-compose.yml` usa um **volume nomeado** `blog_api_data` montado em `/data` no contentor da API. O `blog.db` e o ficheiro de trigger do Admin ficam dentro desse volume, acessíveis apenas via `docker run -v blog_api_data:/data ...` ou copiando a base para o host. Para executar scripts SQL manualmente (ex.: migrações de colunas quando a imagem não foi reconstruída), o operador tem de usar contentores temporários ou copiar o ficheiro. O utilizador quer que o `.db` fique **no servidor** (fora do volume Docker) para facilitar a execução de scripts.

## Decisão: bind mount em vez de volume nomeado

- **Bind mount** `./data:/data`: a pasta `data/` na raiz do repositório (ou no diretório de trabalho do `docker compose`) é montada em `/data` no contentor. O `blog.db` e `admin-password-reset.trigger` ficam em `data/blog.db` e `data/admin-password-reset.trigger` no host.
- **Vantagens**: O operador pode executar `sqlite3 data/blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql` (ou equivalente) a partir da raiz do repo, sem Docker. A documentação de migrações manuais simplifica-se para o caso Docker (usa o mesmo fluxo que local, com caminho `data/blog.db`).
- **Desvantagem**: Quem já tem dados no volume nomeado precisa de **migrar** uma vez (copiar o conteúdo do volume para `./data` antes de trocar o compose). O documento genérico cobre esse caso.

## Decisão: pasta `data/` no repositório

- Criar **`data/.gitkeep`** para que a pasta exista após o clone; o `.gitignore` já ignora `backend/api/*.db`, mas **não** deve ignorar `data/` inteiramente se quisermos que a pasta seja versionada (vazia). Na prática, é comum ignorar `data/*.db` e `data/*.db-*` e **não** ignorar `data/.gitkeep`, ou simplesmente criar a pasta no primeiro `docker compose up` (o Docker cria a pasta ao montar). Para evitar que alguém commite o `blog.db` por engano, adicionar ao `.gitignore`: `data/*.db` e `data/*.db-*` (e opcionalmente `data/admin-password-reset.trigger`). Assim a pasta `data/` pode ser commitada (com .gitkeep) e os ficheiros sensíveis ficam ignorados.
- **Alternativa**: Não versionar `data/` e documentar que o operador deve criar a pasta antes do primeiro `docker compose up`. A proposta escolhe criar `data/.gitkeep` e ignorar apenas os ficheiros dentro de `data/` que não devem ir para o repo (`*.db`, `*.db-*`, trigger).

## Decisão: documentação em dois níveis

1. **Genérica (commitada)**: `EXPOR-DB-NO-HOST.md` (ou secção em DEPLOY) com passos que usam placeholders (ex.: "pasta de dados no host", "REPO_DIR"). Serve qualquer utilizador do repositório.
2. **Local (não commitada)**: `docs/local/expor-db-servidor.md` com o mesmo passo a passo mas pensado para o operador preencher **os seus** caminhos (ex.: `/var/www/blog`, `/var/lib/blog-data`). A pasta `docs/local/` está no `.gitignore`, pelo que este ficheiro não vai para o GitHub.

## Decisão: compatibilidade com deploy existente

- Quem já tem o volume nomeado e não quiser mudar pode manter o compose antigo (não fazer pull do novo compose ou reverter a alteração ao volume). O documento genérico explica como **optar** por bind mount e como migrar dados do volume antigo para a pasta do host. A alteração ao `docker-compose.yml` no repo será para **usar bind mount por defeito**; quem preferir volume nomeado pode editar localmente o compose (e esse ficheiro não é tipicamente commitado com dados locais). Assim o padrão do projeto passa a ser "base no host"; quem quiser volume nomeado pode adaptar.
