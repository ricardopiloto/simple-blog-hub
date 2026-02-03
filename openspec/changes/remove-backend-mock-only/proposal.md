# Change: Remover backend e manter dados apenas mockados no frontend

## Why

Simplificar o projeto eliminando Supabase e qualquer backend: o blog já funciona com dados mock em memória (`mockPosts` e store em `usePosts`). Remover a camada de backend reduz dependências, evita variáveis de ambiente e deixa a aplicação 100% frontend com dados estáticos/mock.

## What Changes

- Remover integração Supabase: pasta `src/integrations/supabase/` (client e types).
- Remover pasta `supabase/` (config.toml e migrations).
- Remover dependência `@supabase/supabase-js` do `package.json`.
- Garantir que nenhum código importe ou referencie Supabase.
- Atualizar `openspec/project.md`: remover Supabase do tech stack, convenções, constraints e dependências externas; afirmar que dados são exclusivamente mock no frontend.

## Impact

- Affected specs: nova capacidade `content-source` (fonte de dados do blog).
- Affected code: `src/integrations/supabase/` (removido), `supabase/` (removido), `package.json`, `openspec/project.md`. Nenhum componente ou página importa Supabase atualmente; apenas os arquivos da integração referenciam o cliente.
