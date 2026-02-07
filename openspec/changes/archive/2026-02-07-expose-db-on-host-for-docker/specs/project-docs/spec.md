# project-docs — delta for expose-db-on-host-for-docker

## ADDED Requirements

### Requirement: Base de dados no servidor exposta ao Docker via volume (bind mount)

A documentação do projeto **deve** (SHALL) indicar que, em deploy com Docker, a **base de dados SQLite** pode ficar **no servidor** (host), numa pasta exposta ao contentor da API via **bind mount** (volume), de modo a facilitar a execução de **scripts manuais** (ex.: migrações SQL) no host com `sqlite3` sem precisar de contentores temporários. O repositório **deve** incluir um documento genérico (ex.: **EXPOR-DB-NO-HOST.md**) com passo a passo para usar essa configuração (bind mount, migração de dados desde volume nomeado se aplicável, execução de scripts no host). A documentação **pode** referir que o operador pode manter um guia **local** (ex.: em `docs/local/`) com os seus caminhos e passos específicos do servidor; esse ficheiro **não** é commitado (a pasta `docs/local/` e o padrão `*-local.md` estão no `.gitignore`).

#### Scenario: Operador executa script manual no host quando a base está em pasta exposta

- **Dado** que o deploy Docker usa bind mount (ex.: pasta `data/` no host montada em `/data` no contentor da API)
- **Quando** o operador precisa de aplicar um script SQL manual (ex.: coluna em falta)
- **Então** a documentação indica que pode executar no host, a partir da raiz do repositório (ou da pasta onde está o `blog.db`): `sqlite3 data/blog.db < backend/api/Migrations/Scripts/nome.sql`
- **E** o documento EXPOR-DB-NO-HOST.md (ou equivalente) descreve o passo a passo genérico e, se aplicável, a migração desde um volume nomeado

#### Scenario: Documentação local não é commitada

- **Quando** o operador cria ou edita um guia em `docs/local/` (ex.: `expor-db-servidor.md`) com os seus caminhos específicos do servidor
- **Então** esse ficheiro está coberto pelo `.gitignore` (pasta `docs/local/` ou padrão `*-local.md`)
- **E** não é incluído em commits nem publicado no GitHub
