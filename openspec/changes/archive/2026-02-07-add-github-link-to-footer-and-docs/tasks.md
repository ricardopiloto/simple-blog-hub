# Tasks: add-github-link-to-footer-and-docs

## 1. Rodapé: link para o GitHub

- [x] 1.1 Em `frontend/src/components/layout/Footer.tsx`, adicionar um link para https://github.com/ricardopiloto/simple-blog-hub (ex.: na área inferior do rodapé, junto ao copyright e à atribuição do ícone, ou numa coluna "Projeto"). O link deve ter `target="_blank"` e `rel="noopener noreferrer"` e texto acessível (ex.: "Código no GitHub" ou ícone GitHub + texto). Opcional: usar ícone Lucide (ex.: Github) se já disponível no projeto.

## 2. README e project.md

- [x] 2.1 Em `README.md`, adicionar referência ao repositório (ex.: no início, após o título, uma linha "Repositório: https://github.com/ricardopiloto/simple-blog-hub" ou secção curta "Repositório" com o link).
- [x] 2.2 Em `openspec/project.md`, adicionar menção ao repositório onde fizer sentido (ex.: na secção "Git Workflow" ou "Purpose": "Repositório: https://github.com/ricardopiloto/simple-blog-hub").

## 3. Guias de deploy

- [x] 3.1 Em `DEPLOY-DOCKER-CADDY.md`, onde for referido o clone do repositório (ex.: `git clone <url-do-repositório> repo`), adicionar o URL canónico como exemplo (ex.: "Ex.: https://github.com/ricardopiloto/simple-blog-hub" ou substituir o placeholder pelo URL em exemplo).
- [x] 3.2 Em `ATUALIZAR-SERVIDOR-DOCKER-CADDY.md`, se aplicável, indicar o repositório como exemplo onde se fala em `git pull` ou diretório do projeto (para consistência com o README e DEPLOY).

## 4. Spec deltas

- [x] 4.1 O delta em `openspec/changes/add-github-link-to-footer-and-docs/specs/branding/spec.md` está preenchido (link no rodapé). Revisar se necessário.
- [x] 4.2 O delta em `openspec/changes/add-github-link-to-footer-and-docs/specs/project-docs/spec.md` está preenchido (documentação referencia o repositório). Revisar se necessário.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-github-link-to-footer-and-docs --strict` e corrigir qualquer falha.
