# Tasks: simplify-readme-docs-changelog-v1-8

## 1. Reescrever README nas 7 secções

- [x] 1.1 **Secção 1 — Explicação breve do projeto**: parágrafo(s) curtos sobre o que é o blog (contos e aventuras de RPG), que os dados vêm do BFF → API → SQLite, interface em português. Incluir URL do repositório (https://github.com/ricardopiloto/simple-blog-hub).
- [x] 1.2 **Secção 2 — Stack de desenvolvimento**: frontend (Node.js, npm, Vite 5, React 18, TypeScript, Tailwind, shadcn/ui, TanStack Query, etc.) e backend (.NET 8, EF Core, SQLite, BFF); comandos de build (frontend em `frontend/`, API e BFF com `dotnet build`); scripts principais (dev, build, test, lint) a partir de `frontend/`.
- [x] 1.3 **Secção 3 — Requisitos mínimos**: Node.js e npm (com link, ex.: nvm ou distro); .NET 8 SDK (com link de download).
- [x] 1.4 **Secção 4 — Links para CHANGELOG**: referência ao CHANGELOG.md e ao versionamento por tag (ex.: v1.7, v1.8).
- [x] 1.5 **Secção 5 — Funcionalidades existentes no blog**: lista concisa das capacidades atuais (página inicial, lista de posts, post por slug, índice da história com paginação/filtro/reordenação e toggle universo, tema claro/escuro, login, troca obrigatória de senha, área do autor, Contas, permissões por post, recuperação de senha Admin, sitemap/robots.txt, etc.), sem duplicar o texto longo atual; pode ser em bullet points.
- [x] 1.6 **Secção 6 — Procedimentos de instalação e atualização**: links para **DEPLOY-DOCKER-CADDY.md** (instalação inicial em servidor com Docker e Caddy), **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** (atualização após git pull, local e Docker), **EXPOR-DB-NO-HOST.md** (base de dados no host e scripts manuais). Breve menção de que o passo a passo completo e variáveis de ambiente estão nesses guias.
- [x] 1.7 **Secção 7 — Estrutura de pastas**: árvore do repositório (`frontend/`, `backend/api/`, `backend/bff/`, `openspec/`, ficheiros de raiz) com descrição breve das pastas principais, alinhada à estrutura atual.

## 2. Remover ou condensar conteúdo redundante no README

- [x] 2.1 Remover ou condensar o passo a passo longo de configuração (clone, build API/BFF, run frontend, configurar Admin, primeiro acesso, recuperar senha) para um resumo curto e referência aos guias (ou manter um "Quick start" mínimo de 3–4 passos e link para DEPLOY/ATUALIZAR para o resto).
- [x] 2.2 Remover ou condensar a tabela detalhada de variáveis de ambiente e a secção "Instalação em ambientes de nuvem (Linux)" longa; substituir por referência aos guias de deploy e atualização.
- [x] 2.3 Manter ou mover para os guias a secção "Recuperar senha do Admin" (pode ficar resumida no README com link para DEPLOY-DOCKER-CADDY ou ATUALIZAR se o detalhe estiver lá).
- [x] 2.4 Manter secção "Verificar que a aplicação funciona" ou integrar em "Procedimentos" com link para ATUALIZAR; garantir que comandos de verificação (build frontend, testes, build backend, smoke check) continuam referidos nalgum sítio (README ou guia).

## 3. Consistência com project.md e guias

- [x] 3.1 Confirmar que README e openspec/project.md referem .NET 8 (não .NET 9) e que a estrutura de pastas descrita no README coincide com project.md onde aplicável.
- [x] 3.2 Verificar que DEPLOY-DOCKER-CADDY e ATUALIZAR-SERVIDOR-DOCKER-CADDY continuam a ser a fonte canónica para instalação e atualização; README não contradiz esses guias.

## 4. CHANGELOG [1.8]

- [x] 4.1 Adicionar secção **## [1.8]** em `CHANGELOG.md` no topo das versões (acima de [1.7]), com entrada para **simplify-readme-docs-changelog-v1-8**: README reorganizado em sete secções (explicação do projeto, stack, requisitos, links para CHANGELOG, funcionalidades, procedimentos de instalação/atualização com links, estrutura de pastas); documentação alinhada; nova versão no changelog. Incluir outras changes aplicadas desde 1.7 se houver e ainda não listadas numa versão.

## 5. Spec delta project-docs

- [x] 5.1 Em `openspec/changes/simplify-readme-docs-changelog-v1-8/specs/project-docs/spec.md`, ADDED requirement: o README **deve** estar organizado em sete secções (1. Explicação breve do projeto; 2. Stack de desenvolvimento; 3. Requisitos mínimos; 4. Links para CHANGELOG; 5. Funcionalidades existentes no blog; 6. Procedimentos de instalação e atualização com links para os guias; 7. Estrutura de pastas). MODIFIED ou referência ao requisito existente de README completo: a completude das funcionalidades e dos procedimentos pode ser satisfeita por lista no README + links para DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY e EXPOR-DB-NO-HOST. Incluir cenário: leitor abre o README e encontra as sete secções e os links para CHANGELOG e para os guias de instalação/atualização.

## 6. Validação

- [x] 6.1 Executar `openspec validate simplify-readme-docs-changelog-v1-8 --strict` e corrigir falhas.
