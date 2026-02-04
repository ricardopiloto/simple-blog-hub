# Tasks: Sessão expira ao fechar aba ou navegador

## 1. Armazenamento de sessão

- [x] 1.1 Em `src/auth/storage.ts`, trocar todas as operações de `localStorage` por `sessionStorage` para as chaves do token e do autor (TOKEN_KEY, AUTHOR_KEY): leitura em `loadFromStorage`, escrita em `setAuth`, remoção em `clear`.

## 2. Validação

- [x] 2.1 Validar no navegador: após login, fechar a aba ou o navegador e reabrir a aplicação; o usuário não deve estar logado e, ao acessar `/area-autor`, deve ser redirecionado para `/login`.
