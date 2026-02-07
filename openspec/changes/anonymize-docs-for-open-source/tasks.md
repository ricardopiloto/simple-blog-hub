# Tasks: anonymize-docs-for-open-source

## 1. Placeholders e .gitignore

- [x] 1.1 Adicionar ao `.gitignore` o padrão para documentação local: ficheiros `*-local.md` na raiz do repositório (ex.: `DEPLOY-DOCKER-CADDY.local.md`, `ATUALIZAR-SERVIDOR-DOCKER-CADDY.local.md`). Opcional: ignorar também a pasta `docs/local/` se for criada.

- [x] 1.2 No README (ou num ficheiro curto tipo `docs/README-local.md`), adicionar uma nota (1–2 frases): a documentação no repositório é genérica (sem domínios nem caminhos específicos); podes manter uma cópia local dos guias de deploy/atualização com os teus dados (domínio, caminhos) em ficheiros `*-local.md`, que não são commitados.

## 2. Anonimizar documentação commitada

- [x] 2.1 **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Substituir todas as ocorrências de `blog.1nodado.com.br` por placeholder (ex.: `https://seu-dominio.com` ou `seu-dominio.com` em `VITE_BFF_URL`). Substituir `/var/www/blog/repo` e `/var/www/blog` por texto genérico (ex.: "diretório do repositório no servidor (ex.: REPO_DIR)" e "document root do Caddy (ex.: DOCUMENT_ROOT)" ou variáveis explicadas no início do doc).

- [x] 2.2 **DEPLOY-DOCKER-CADDY.md**: Substituir domínio `blog.1nodado.com.br` por `seu-dominio.com` (ou equivalente) em exemplos de Caddyfile, URLs de build e tabela de resumo. Substituir caminhos `/var/www/blog`, `/var/www/blog/repo`, `/var/www/blog/dist`, etc., por placeholders (REPO_DIR, DOCUMENT_ROOT) ou por texto "ex.: /caminho/do/projeto" com explicação. Garantir que exemplos de comandos e Caddyfile sejam utilizáveis por qualquer deployer ao preencher com os seus valores.

- [x] 2.3 **backend/api/README.md**: Substituir o exemplo "se o projeto está em `/var/www/blog/repo`" por "se o projeto está em REPO_DIR (ex.: o diretório onde fizeste clone do repositório no servidor)".

- [x] 2.4 **backend/bff/README.md**: Verificar se há referências a domínio ou caminhos específicos; se sim, substituir por placeholders.

- [x] 2.5 **README.md**: Verificar referências a 1nodado, blog.1nodado.com.br ou caminhos como /var/www; substituir por placeholders ou texto genérico.

## 3. Openspec

- [x] 3.1 **openspec/specs/project-docs/spec.md**: Em todos os requisitos e cenários que mencionem `blog.1nodado.com.br` ou `1nodado.com.br`, substituir por "e.g. seu-dominio.com" ou "placeholders (e.g. https://seu-dominio.com)". Adicionar um requisito ADDED (ou ajustar o existente): a documentação **commitada** do projeto SHALL NOT conter domínios de deploy reais nem caminhos absolutos específicos do servidor do mantenedor; SHALL usar placeholders genéricos (domínio: e.g. seu-dominio.com; caminhos: e.g. REPO_DIR, DOCUMENT_ROOT). O repositório MAY documentar que o operador pode manter uma cópia local (ficheiros ignorados pelo git) com os seus próprios domínio e caminhos.

- [x] 3.2 **openspec/changes/add-post-cover-image-upload-local/design.md**: Substituir exemplos com `/var/www/blog` e domínio específico por placeholders (ex.: DOCUMENT_ROOT, "caminho configurável no host").

## 4. Validação

- [x] 4.1 Confirmar que não resta nenhuma ocorrência de `1nodado.com.br` ou `blog.1nodado.com.br` em ficheiros que sejam commitados (ex.: `rg -l "1nodado" --glob '!*.git*' --glob '!*archive*'` deve listar zero ficheiros ou apenas ficheiros já no .gitignore).

- [x] 4.2 Executar `openspec validate anonymize-docs-for-open-source --strict` e corrigir falhas.
