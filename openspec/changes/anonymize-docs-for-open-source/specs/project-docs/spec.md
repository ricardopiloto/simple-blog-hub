# project-docs — delta for anonymize-docs-for-open-source

## ADDED Requirements

### Requirement: Documentação commitada genérica (open-source)

A documentação do projeto que é **commitada no repositório** (e publicada no GitHub) SHALL NOT conter **domínios de deploy reais** (ex.: blog.1nodado.com.br) nem **caminhos absolutos específicos** do servidor do mantenedor (ex.: /var/www/blog). Em vez disso, a documentação SHALL usar **placeholders genéricos**:

- **Domínio**: exemplos com "seu-dominio.com" ou "https://seu-dominio.com" (ou equivalente em português: "URL do seu domínio"), para que qualquer utilizador possa substituir pelo seu próprio domínio.
- **Caminhos**: uso de variáveis ou texto genérico (ex.: REPO_DIR para o diretório do repositório no servidor, DOCUMENT_ROOT para o document root do Caddy onde são copiados os estáticos), ou frases como "diretório do projeto (ex.: /caminho/do/projeto)".

O repositório MAY documentar (no README ou noutro ficheiro) que o **operador** pode manter uma **cópia local** dos guias de deploy e atualização com os **seus** domínio e caminhos preenchidos, em ficheiros que estão listados no `.gitignore` (ex.: `*-local.md`) e que **não** são commitados. O objetivo é que o projeto seja **open-source friendly**: quem clona ou faz fork vê apenas documentação reutilizável em qualquer servidor e domínio.

#### Scenario: Leitor do repositório não vê domínio real

- **GIVEN** um utilizador clona o repositório ou consulta a documentação no GitHub
- **WHEN** lê README, DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md ou outros guias versionados
- **THEN** não encontra domínios reais (ex.: 1nodado.com.br) nem caminhos específicos do servidor do autor (ex.: /var/www/blog)
- **AND** encontra placeholders (ex.: seu-dominio.com, REPO_DIR, DOCUMENT_ROOT) que pode substituir pelos seus próprios valores

#### Scenario: Operador mantém documentação local específica

- **GIVEN** o operador segue a documentação genérica do repo para deploy
- **WHEN** deseja manter um guia com o seu domínio e caminhos preenchidos (para uso local no servidor)
- **THEN** o README (ou doc equivalente) indica que pode criar uma cópia em ficheiro com sufixo `-local` (ex.: DEPLOY-DOCKER-CADDY.local.md) e preencher com os seus dados
- **AND** esses ficheiros estão listados no `.gitignore` e não são commitados

## MODIFIED (reference for implementation)

Os requisitos existentes em `openspec/specs/project-docs/spec.md` que mencionam **blog.1nodado.com.br** ou **1nodado.com.br** (ex.: cenários de CORS, deploy doc, update document) devem ser **alterados in-place** para usar placeholders (ex.: "e.g. seu-dominio.com", "e.g. https://seu-dominio.com") em vez do domínio real. Isto é feito na tarefa 3.1 (editar o spec principal), não por duplicação neste delta.
