# Tasks: Expandir README com funcionalidades, estrutura, stack e passo a passo

## 1. Funcionalidades

- [x] 1.1 Adicionar ou reorganizar no README uma secção **Funcionalidades** (ou integrar em "O que o projeto faz") que liste de forma explícita: página inicial (destaque + recentes), lista de posts, post individual com descrição do autor no final, índice da história (paginação 6 itens, filtro em tempo real, reordenação por número ou arrastar para utilizadores autenticados), tema claro/escuro, login, troca obrigatória de senha no primeiro acesso com senha padrão, área do autor (dashboard, novo/editar post), menu com Área do autor, Contas e Sair, Contas (perfil próprio com nome/descrição do autor/senha; Admin: lista de contas, criar, editar, resetar senha, excluir), critério mínimo de senha (6 caracteres, maiúscula, número), edição de posts com permissões (dono, colaborador, Admin), recuperação da senha do Admin via ficheiro de trigger.

## 2. Estrutura dos serviços

- [x] 2.1 Adicionar no README uma secção **Estrutura dos serviços** (ou dentro de Arquitetura) que descreva o fluxo: Frontend (React) → BFF (único ponto de entrada público) → API (interna) → SQLite. Incluir a estrutura de pastas relevante: raiz com `src/` (frontend), `backend/api/` (Controllers, Data, Models, Services, Migrations), `backend/bff/` (Controllers, Services, Models), de forma que o leitor saiba onde estão API, BFF e frontend.

## 3. Stack de desenvolvimento

- [x] 3.1 Garantir que a secção **Tecnologias** (ou **Stack**) do README liste de forma clara: Node.js e npm (frontend), .NET 9 SDK (backend), Vite, React, TypeScript, React Router, Tailwind CSS, shadcn/ui, TanStack Query; backend com EF Core, SQLite, BCrypt, Markdig; testes (Vitest, Testing Library); lint (ESLint). Incluir referência aos comandos de build (`npm run build`, `dotnet build` em backend/api e backend/bff) e aos scripts principais (dev, test, lint).

## 4. Passo a passo de configuração

- [x] 4.1 Adicionar no README uma secção **Configuração passo a passo** (ou **Do zero ao primeiro acesso**) com passos numerados: (1) Clonar o repositório e instalar dependências do frontend (`npm install`); (2) Build/execução do backend: build da API e do BFF (`dotnet build` em `backend/api` e `backend/bff`), executar API (porta 5001) e BFF (porta 5000); (3) Executar o frontend (`npm run dev`); (4) Configurar o Admin: definir `Admin:Email` (appsettings ou `Admin__Email`) e reiniciar a API para criar a conta com senha padrão; (5) Primeiro acesso: login com o e-mail do Admin e senha padrão, concluir a troca obrigatória de senha no modal; (6) (Opcional) Recuperar senha do Admin: criar ficheiro de trigger, reiniciar API, login com senha padrão e trocar novamente. Garantir que o fluxo está completo e na ordem lógica.

## 5. Validação

- [x] 5.1 Revisar o README final para garantir que não há informação duplicada em conflito e que as secções (funcionalidades, estrutura, stack, passo a passo) estão claras e alinhadas com `openspec/project.md`. Build do frontend e da API/BFF para confirmar que os comandos documentados funcionam.
