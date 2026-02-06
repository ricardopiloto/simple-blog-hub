# Change: Opção de logout no menu superior quando o usuário está autenticado

## Why

Quando o usuário está autenticado na área logada, deve existir no menu superior (header) uma opção clara para **desconectar a conta** (logout), permitindo encerrar a sessão sem depender de outras telas ou comportamentos indiretos. Isso melhora a experiência do usuário e deixa explícito o estado de autenticação.

## What Changes

- **Comportamento**: No **menu superior** (header), quando o usuário **estiver autenticado** (`isAuthenticated === true`), o sistema deve exibir uma opção de **Logout** (ex.: botão ou link "Sair") ao lado ou próximo do link "Área do autor". Essa opção **não** deve aparecer quando o usuário não estiver autenticado (neste caso permanece apenas o link de Login).
- **Ação**: Ao acionar a opção de Logout, o sistema deve chamar a função de logout do contexto de autenticação (ex.: `logout()` do `AuthContext`), limpando token e estado de sessão, e pode redirecionar o usuário para a página inicial (`/`).
- **Desktop e mobile**: O mesmo comportamento deve estar disponível na navegação **desktop** e no **menu mobile** (quando o menu expansível estiver aberto), com a ação de Logout visível apenas quando autenticado.

**Nota:** Esta funcionalidade já está implementada no projeto (Header com botão "Sair", `handleLogout` que chama `logout()` e redireciona para `/`). Este change formaliza o requisito em proposta e spec; as tasks podem ser de verificação e documentação.

## Impact

- Affected specs: nova capability **header-logout** (requisito de exibir logout no header quando autenticado).
- Affected code: nenhum (comportamento já em `src/components/layout/Header.tsx`); opcionalmente documentação em README/project.md.
