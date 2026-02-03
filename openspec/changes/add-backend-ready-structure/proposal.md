# Change: Estrutura de pastas preparada para desenvolvimento do backend

## Why

O projeto hoje tem apenas frontend em `src/` e não define onde o backend ou o cliente de API devem ficar. Organizar a estrutura de pastas agora reserva lugares claros para o backend e para a camada de acesso a dados no frontend, sem quebrar a aplicação e facilitando a futura integração.

## What Changes

- **Criar `backend/` na raiz do repositório**: diretório reservado para o futuro backend (API, serviços, persistência). Conteúdo inicial: README explicando o propósito e, se desejado, um `.gitkeep` ou arquivo placeholder para manter a pasta no Git.
- **Criar `src/api/`**: diretório reservado para o cliente de API do frontend (base URL, fetch/axios, tipos de resposta). Pode conter um README ou um módulo placeholder (ex.: `client.ts` ou `index.ts` que exporta um stub ou comentário) para não quebrar imports; nenhum código de negócio ainda.
- **Opcionalmente criar `src/services/`**: camada de serviços que hoje podem re-exportar ou usar os dados mock e no futuro chamar `src/api/`. Se criado, manter compatível com os hooks atuais (`usePosts` continua consumindo dados de `@/data/mockPosts` ou de um serviço que por sua vez usa mock).
- **Atualizar `openspec/project.md`**: descrever a estrutura (frontend em `src/`, backend em `backend/`, cliente API em `src/api/`, serviços em `src/services/` se existir); afirmar que a aplicação atual continua funcionando (build, testes, alias `@/` inalterados).
- **Não mover** `index.html`, `src/`, `vite.config.ts`, `tsconfig` ou scripts do `package.json`: o frontend permanece na raiz; apenas adicionar pastas e documentação para não quebrar a aplicação.

## Impact

- Affected specs: nova capacidade `project-structure` (estrutura de pastas preparada para backend).
- Affected code: novos diretórios e arquivos (README/placeholder); `openspec/project.md`. Nenhuma alteração em imports existentes, Vite ou TypeScript que exija mudança de paths; build e testes devem continuar passando.
