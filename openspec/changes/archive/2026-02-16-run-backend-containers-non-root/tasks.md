# Tasks: run-backend-containers-non-root

## 1. Dockerfile API

- [x] 1.1 Em `backend/api/Dockerfile`, na etapa runtime: criar um utilizador não-root com UID e GID fixos (ex.: 10000), garantir que o diretório `/app` pertence a esse utilizador (ou que o processo possa escrever em `/data`, que é o volume montado), e adicionar `USER <uid>` (ou o nome do user) antes do ENTRYPOINT. O processo **não** deve correr como root.

## 2. Dockerfile BFF

- [x] 2.1 Em `backend/bff/Dockerfile`, na etapa runtime: criar um utilizador não-root com o mesmo UID/GID (ex.: 10000) para consistência, e adicionar `USER` antes do ENTRYPOINT. O BFF escreve em `/frontend/public/images/posts` (volume montado); não é necessário chown dentro da imagem para essa pasta.

## 3. docker-compose

- [x] 3.1 Em `docker-compose.yml`, nos serviços `api` e `bff`, adicionar `user: "10000:10000"` (ou o UID:GID escolhido) para tornar explícito que os contentores correm como não-root e alinhar com a documentação.

## 4. Documento passo a passo no servidor

- [x] 4.1 Criar **docs/deploy/CONFIGURAR-SERVIDOR-NAO-ROOT.md** com: (1) objetivo (contentores não-root, UID 10000); (2) **Deploy novo**: comandos para criar `data/` e `frontend/public/images/posts` (se não existirem), `chown -R 10000:10000 REPO_DIR/data REPO_DIR/frontend/public/images/posts`, depois build e `docker compose up -d`; (3) **Migração desde root**: parar contentores, aplicar o mesmo `chown` nas pastas existentes, atualizar código e imagens, subir contentores; (4) **Verificação**: como confirmar que os contentores correm como UID 10000 e que a API grava na base e o BFF grava uploads; (5) troubleshooting (readonly database, Permission denied → verificar dono das pastas). Comandos copiáveis e REPO_DIR como variável a substituir.

## 5. Atualizar documentação de deploy e segurança

- [x] 5.1 Em **docs/deploy/DEPLOY-DOCKER-CADDY.md**: indicar que os contentores da API e do BFF correm como **não-root** (UID 10000); adicionar referência a CONFIGURAR-SERVIDOR-NAO-ROOT.md na secção de permissões ou pré-requisitos; ajustar troubleshooting (readonly database / Permission denied) para mencionar chown para 10000:10000.
- [x] 5.2 Em **docs/deploy/ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: mencionar que os contentores são não-root e que, na primeira vez com esta configuração, o operador deve seguir CONFIGURAR-SERVIDOR-NAO-ROOT.md (ou aplicar os comandos de permissões) antes ou após o pull/rebuild.
- [x] 5.3 Em **docs/security/SECURITY-HARDENING.md**, **docs/security/SECURITY-REMEDIATION.md** e **docs/security/PRODUCTION-CHECKLIST.md**: atualizar para indicar que os contentores **não** correm como root e referenciar o guia CONFIGURAR-SERVIDOR-NAO-ROOT.md para configuração de permissões no servidor.
- [x] 5.4 Em **docs/database/EXPOR-DB-NO-HOST.md**: indicar que, com contentores não-root, a pasta de dados no host deve ter dono UID 10000 (ou o UID usado na imagem) e referenciar CONFIGURAR-SERVIDOR-NAO-ROOT.md quando aplicável.

## 6. Spec delta security-hardening

- [x] 6.1 Em `openspec/changes/run-backend-containers-non-root/specs/security-hardening/spec.md`: requisito MODIFIED para "Hardening de infra e documentação de segurança SHALL be aplicados": os contentores da API e do BFF **DEVEM** (SHALL) executar como **utilizador não-root** (UID fixo documentado, ex.: 10000). A documentação **DEVE** incluir um **passo a passo no servidor** (comandos e alterações) para configurar as permissões dos volumes (ex.: `chown` para o UID do contentor) de forma a que a API e o BFF funcionem sem erros de permissão. Adicionar cenário: operador segue o guia, aplica os comandos no servidor e os contentores correm como não-root com escrita nos volumes.

## 7. Spec delta project-docs (opcional)

- [x] 7.1 Se necessário, em `openspec/changes/run-backend-containers-non-root/specs/project-docs/spec.md`: garantir que a documentação de deploy (ou documento referenciado) inclui ou referencia os passos de configuração do servidor para executar os contentores como não-root (permissões dos volumes). Só criar este delta se o project-docs exigir explicitamente esse conteúdo; caso o CONFIGURAR-SERVIDOR-NAO-ROOT seja referenciado pelo DEPLOY, pode ser suficiente.

## 8. Validação

- [x] 8.1 Executar `openspec validate run-backend-containers-non-root --strict` e corrigir até passar.
