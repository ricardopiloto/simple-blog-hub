## MODIFIED Requirements

### Requirement: Navegação principal no header

O sistema **deve** (SHALL) exibir um header fixo no topo do site com navegação para as páginas principais e controles de sessão, adaptando o conteúdo conforme o estado de autenticação do usuário.

#### Scenario: Usuário não autenticado vê navegação pública e link de Login

- Dado que o visitante **não está autenticado**
- Quando o header é renderizado
- Então devem ser exibidos links para:
  - Início (`/`)
  - Artigos (`/posts`)
  - Índice da História (`/indice`)
- E deve existir um link/botão de **Login** (`/login`)
- E **não** deve ser exibido nenhum botão de **Logout**.

#### Scenario: Usuário autenticado vê Área do autor e botão de Logout no desktop

- Dado que o usuário está autenticado (`isAuthenticated === true`)
- Quando o header é renderizado em viewport desktop
- Então devem ser exibidos os links públicos:
  - Início (`/`)
  - Artigos (`/posts`)
  - Índice da História (`/indice`)
- E deve ser exibido um link para **Área do autor** (`/area-autor`)
- E deve ser exibido, próximo à Área do autor, um botão ou link de **Logout** (ex.: texto "Sair")
- E esse botão/ação de Logout deve:
  - Invocar a função `logout()` do contexto de autenticação
  - Opcionalmente redirecionar o usuário para a página inicial (`/`) após o logout.

#### Scenario: Usuário autenticado vê Logout no menu mobile

- Dado que o usuário está autenticado (`isAuthenticated === true`)
- E o menu mobile do header está aberto
- Quando o header é renderizado em viewport mobile
- Então devem ser exibidos os links públicos:
  - Início (`/`)
  - Artigos (`/posts`)
  - Índice da História (`/indice`)
- E devem ser exibidos os links autenticados (ex.: **Área do autor**, e **Contas** se o usuário for Admin)
- E deve existir uma ação de **Logout** no menu mobile
- E ao acionar essa ação:
  - A função `logout()` do contexto de autenticação deve ser chamada
  - O menu mobile deve ser fechado
  - Opcionalmente o usuário pode ser redirecionado para a página inicial (`/`).

