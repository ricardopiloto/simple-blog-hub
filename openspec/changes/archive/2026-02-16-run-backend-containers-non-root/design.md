# Design: Executar contentores do backend como não-root

## Contexto

O projeto já passou por um ajuste (change **adjust-dockerfiles-and-docs-after-hardening**) em que os Dockerfiles **deixaram** de usar `USER` não-root para evitar o erro "readonly database" quando o volume `data/` no host não tinha permissões para o UID do contentor. A solução adoptada foi correr como **root** e documentar o trade-off. Agora queremos **reverter** essa decisão do ponto de vista de segurança: os contentores **devem** correr como não-root, e a forma de evitar erros de permissão é **configurar o host** uma vez (chown das pastas de volume para o UID do contentor).

## Decisões

### UID fixo (10000)

- Utilizar um **UID e GID fixos** (ex.: 10000) dentro da imagem, sem depender de um utilizador existente no host. Assim, o operador **não** é obrigado a criar um utilizador "blogapp" no servidor; basta executar `chown -R 10000:10000 data/ frontend/public/images/posts` (a partir de REPO_DIR) para que os contentores tenham permissão de escrita.
- 10000 evita colisões com UIDs típicos de utilizadores de desktop (ex.: 1000) e é um valor comum para "service" users em imagens Docker.

### Onde o processo precisa de escrever

- **API**: `/data` (bind mount de `./data` no host) — SQLite (`blog.db`), ficheiro de trigger de reset de senha do Admin (`admin-password-reset.trigger`). O conteúdo é copiado para `/app`; apenas `/data` é montado do host.
- **BFF**: `/frontend/public/images/posts` (bind mount de `./frontend/public/images/posts` no host) — uploads de imagens de capa. O resto da aplicação está em `/app`.

Nos Dockerfiles, não é necessário criar os diretórios montados dentro da imagem (vêm do host). Basta garantir que o processo corre com um UID que o host possa atribuir às pastas via `chown`.

### docker-compose

- Definir `user: "10000:10000"` nos serviços `api` e `bff` torna explícito no repositório o UID esperado e permite que a documentação referencie "10000" de forma única. Alternativa: confiar apenas no `USER` do Dockerfile; manter ambos (Dockerfile + compose) alinhados evita surpresas se alguém rebuildar sem o compose.

### Documentação do servidor

- **Um único documento** (CONFIGURAR-SERVIDOR-NAO-ROOT.md) com:
  1. **Deploy novo**: criar pastas `data/` e `frontend/public/images/posts` (se não existirem), `chown -R 10000:10000` para ambas a partir de REPO_DIR, depois `docker compose up -d`.
  2. **Migração desde root**: parar contentores; aplicar o mesmo `chown` nas pastas existentes (os ficheiros `blog.db` e imagens já existentes passam a ser propriedade de 10000:10000); puxar código novo, rebuild, `docker compose up -d`.
  3. **Verificação**: `docker compose exec api id` (deve mostrar uid=10000); testar criação de post e upload de capa; confirmar que não há "readonly database" nem "Permission denied".
- Referência a este documento em DEPLOY-DOCKER-CADDY (secção de permissões / pré-requisitos), ATUALIZAR-SERVIDOR-DOCKER-CADDY (quando aplicável), SECURITY-HARDENING, PRODUCTION-CHECKLIST e EXPOR-DB-NO-HOST.

### Script de atualização (atualizar-servidor.sh)

- O script existente não precisa de fazer `chown` em cada atualização; a configuração de permissões é **uma vez** (deploy inicial ou migração). Pode-se adicionar um comentário ou secção no script (ou no guia) a lembrar que, na primeira vez com imagens não-root, o operador deve ter executado os passos de CONFIGURAR-SERVIDOR-NAO-ROOT.md. Opcional: variável ou flag para executar chown (para ambientes onde o REPO_DIR é recriado), mas não é obrigatório para este change.

## Trade-offs

- **Operacional**: O operador tem de executar comandos no servidor (chown) uma vez. Em troca, reduz-se o risco de um processo comprometido correr com root.
- **Compatibilidade**: Quem estiver em root e fizer apenas `git pull` + `docker compose up -d` sem ler o guia pode ver a API falhar com "readonly database". Daí a importância de (1) referenciar o guia de não-root no DEPLOY e no ATUALIZAR, e (2) incluir no troubleshooting a verificação de permissões (chown para 10000:10000).
