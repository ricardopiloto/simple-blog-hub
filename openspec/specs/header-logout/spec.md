# header-logout Specification

## Purpose
TBD - created by archiving change add-header-logout-option. Update Purpose after archive.
## Requirements
### Requirement: Opção de logout no menu superior para usuários autenticados

O sistema **deve** (SHALL) exibir no menu superior (header) uma opção de **logout** quando o usuário estiver autenticado, permitindo desconectar a conta e encerrar a sessão. A opção **não** deve ser exibida quando o usuário não estiver autenticado.

#### Scenario: Usuário autenticado vê opção de Logout no header (desktop)

- **Dado** que o usuário está autenticado (`isAuthenticated === true`)
- **Quando** o header é renderizado em viewport desktop
- **Então** deve ser exibido um link ou botão de **Logout** (ex.: texto "Sair"), próximo ao link "Área do autor"
- **E** ao acionar essa opção, o sistema deve invocar a função de logout do contexto de autenticação (ex.: `logout()`)
- **E** o usuário pode ser redirecionado para a página inicial (`/`) após o logout

#### Scenario: Usuário autenticado vê opção de Logout no menu mobile

- **Dado** que o usuário está autenticado (`isAuthenticated === true`)
- **E** o menu mobile do header está aberto
- **Quando** o usuário visualiza o menu mobile
- **Então** deve existir uma ação de **Logout** (ex.: "Sair") junto aos itens autenticados (Área do autor, Contas se Admin)
- **E** ao acionar essa ação, o sistema deve chamar a função de logout e o menu mobile deve ser fechado; o usuário pode ser redirecionado para `/`

#### Scenario: Usuário não autenticado não vê opção de Logout

- **Dado** que o visitante **não** está autenticado
- **Quando** o header é renderizado
- **Então** não deve ser exibida nenhuma opção de Logout
- **E** deve ser exibido apenas o link/botão de **Login** para acesso à área logada

