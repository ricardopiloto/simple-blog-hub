% Change: Botão de logout no header (apenas usuário autenticado)

## Why

Atualmente o header exibe links de navegação pública (`Início`, `Artigos`, `Índice da História`) e, para usuários autenticados, um link para a **Área do autor** (e, no menu mobile, a rota **Contas** para Admin). Porém, não há um controle de **logout** visível no menu superior: o usuário precisa depender de outras telas/comportamentos para encerrar a sessão.

Ter um botão de **Sair**/logout direto no header melhora a experiência do usuário e torna mais claro quando ele está autenticado, mantendo o comportamento consistente entre desktop e mobile.

## What Changes

- **Header (desktop)**:
  - Quando o usuário **não** estiver autenticado, o header mantém o link de **Login**.
  - Quando o usuário estiver **autenticado**, o header deve exibir:
    - Link para **Área do autor** (`/area-autor`), como hoje.
    - Um botão ou link de **Logout** logo ao lado (ex.: texto "Sair" ou ícone+texto), que:
      - Chama a função `logout()` do `AuthContext` para limpar o estado/auth storage.
      - Opcionalmente redireciona o usuário para a página inicial (`/`) após o logout.
- **Header (mobile)**:
  - Dentro do menu mobile, quando `isAuthenticated` for verdadeiro, deve existir uma ação de **Logout** juntamente com os links autenticados (Área do autor / Contas).
  - Essa ação também deve chamar `logout()` e fechar o menu; o redirecionamento padrão pode ser para `/` ou manter a navegação padrão após o logout.
- **Visibilidade**:
  - O botão/ação de logout **só deve aparecer** quando o usuário estiver autenticado (`isAuthenticated === true`).
  - Usuários não autenticados continuam vendo apenas o link **Login** (sem Logout).

## Impact

- Affected specs: **project-docs** (seção de navegação/header e comportamento de sessão), possivelmente specs futuras de **auth-ux**.
- Affected code:
  - `src/components/layout/Header.tsx`: uso de `logout` do `AuthContext`, novos botões/links de Logout em desktop e mobile, condicionais com `isAuthenticated`.
  - (Opcional) testes de componentes de layout ou de fluxo de auth se existirem/spec forem criados futuramente.

