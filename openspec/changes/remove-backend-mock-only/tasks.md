# Tasks: remove-backend-mock-only

## 1. Remoção do backend

- [x] 1.1 Remover pasta `src/integrations/supabase/` (client.ts e types.ts).
- [x] 1.2 Remover pasta `supabase/` (config.toml e migrations).
- [x] 1.3 Remover dependência `@supabase/supabase-js` do `package.json` e rodar `npm install` (ou equivalente).
- [x] 1.4 Verificar com busca no código que não restam imports ou referências a `supabase` ou `@/integrations/supabase`.

## 2. Documentação e convenções

- [x] 2.1 Atualizar `openspec/project.md`: remover Supabase do Tech Stack, Architecture Patterns (Supabase), Important Constraints (Supabase, variáveis VITE_SUPABASE_*), External Dependencies (Supabase); afirmar que toda fonte de dados do blog é mock no frontend (ex.: `@/data/mockPosts` e store em `@/hooks/usePosts`).
- [x] 2.2 Remover ou ajustar entradas em Domain Context que citem Supabase/profiles/user_roles como parte ativa do sistema (manter apenas o modelo de autor no frontend se fizer sentido).

## 3. Validação

- [x] 3.1 Executar `npm run build` e `npm run test` para garantir que o build e os testes passam sem Supabase.
- [x] 3.2 Se existir `.env.example` ou documentação que mencione `VITE_SUPABASE_*`, remover ou atualizar.
