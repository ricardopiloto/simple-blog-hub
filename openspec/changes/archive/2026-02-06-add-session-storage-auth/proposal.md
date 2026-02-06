# Change: Sessão expira ao fechar aba ou navegador

## Why

Aumentar a segurança da área logada: hoje o token e o autor são persistidos em `localStorage`, então a sessão sobrevive ao fechar a aba ou o navegador. Para forçar novo login ao fechar a aba/navegador, a sessão deve ser armazenada apenas em `sessionStorage` (ou equivalente), de modo que o fechamento da aba ou do navegador limpe os dados e o usuário precise autenticar novamente.

## What Changes

- Alterar o armazenamento de autenticação no frontend de `localStorage` para `sessionStorage` em `src/auth/storage.ts` (leitura e escrita de token e autor).
- Garantir que, ao fechar a aba ou o navegador, o token e o autor não persistam; ao reabrir, o usuário não esteja logado e seja redirecionado para login ao acessar rotas protegidas.

## Impact

- **Affected specs:** auth (novo requisito de sessão por aba; alteração implícita no requisito de armazenamento do token).
- **Affected code:** `src/auth/storage.ts`.
