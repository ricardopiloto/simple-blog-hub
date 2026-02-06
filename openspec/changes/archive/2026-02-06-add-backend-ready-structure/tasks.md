# Tasks: add-backend-ready-structure

## 1. Diretório backend

- [x] 1.1 Criar o diretório `backend/` na raiz do repositório.
- [x] 1.2 Adicionar `backend/README.md` explicando que o diretório está reservado para o futuro desenvolvimento do backend (API, persistência, etc.) e que por enquanto não há código ativo.

## 2. Diretório src/api (cliente API no frontend)

- [x] 2.1 Criar o diretório `src/api/`.
- [x] 2.2 Adicionar um arquivo placeholder ou README em `src/api/` que indique o propósito (cliente HTTP para a futura API). Se for um módulo (ex.: `index.ts` ou `client.ts`), garantir que não introduza imports que quebrem o build (ex.: export vazio ou comentário).

## 3. Documentação da estrutura

- [x] 3.1 Atualizar `openspec/project.md`: na seção de Architecture Patterns ou nova seção "Estrutura de pastas", documentar que o frontend está em `src/`, o backend reservado em `backend/`, e o cliente de API do frontend em `src/api/`; mencionar `src/services/` apenas se for criado.
- [x] 3.2 Garantir que as convenções de path alias (`@/` → `src/`) e de dados (mock em `src/data/`, hooks em `src/hooks/`) permaneçam válidas e referenciadas.

## 4. Validação

- [x] 4.1 Executar `npm run build` e `npm run test` após as alterações; confirmar que a aplicação não quebra.
- [x] 4.2 Verificar que nenhum import existente foi alterado e que `vite.config.ts`, `tsconfig.app.json` e `vitest.config.ts` continuam sem necessidade de mudança de paths (a menos que se opte por referenciar `src/api/` em algum lugar sem impacto no build).
