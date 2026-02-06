## 1. Backend – estado de senha e reset pelo Admin

- [x] 1.1 Adicionar/confirmar campo de estado (ex.: `MustChangePassword` ou equivalente) na entidade de usuário, com valor `true` para contas criadas ou resetadas com senha padrão `senha123`.
- [x] 1.2 Garantir que a criação automática do Admin inicial (a partir de `Admin:Email` / `Admin__Email`) marque `MustChangePassword = true`.
- [x] 1.3 Garantir que a criação de novos autores pelo Admin (área Contas / POST /api/users) marque `MustChangePassword = true` quando usar a senha padrão.
- [x] 1.4 Implementar endpoint de **reset de senha** (ex.: `POST /api/users/{id}/reset-password`), protegido para Admin, que redefine a senha do usuário alvo para `senha123` e marca `MustChangePassword = true`.
- [x] 1.5 Ajustar o fluxo de login na API para incluir um campo `must_change_password` na resposta, derivado do estado do usuário.

## 2. BFF – propagação de estado de senha

- [x] 2.1 Atualizar o endpoint de login no BFF para repassar (ou enriquecer) o campo `must_change_password` vindo da API.
- [x] 2.2 Expor endpoint de reset de senha no BFF (ex.: `POST /bff/users/{id}/reset-password`), protegido por Admin, que delega ao endpoint equivalente da API.

## 3. Frontend – gestão de contas e modal de troca obrigatória

- [x] 3.1 Estender os tipos de autenticação (ex.: contexto de Auth) com `must_change_password?: boolean`.
- [x] 3.2 Na área de gestão de contas (`/area-autor/contas`), adicionar ação de **reset de senha** por usuário, visível apenas para Admin, chamando `POST /bff/users/{id}/reset-password` e exibindo feedback na UI.
- [x] 3.3 Implementar um modal bloqueante de "Trocar senha obrigatoriamente" exibido logo após o login quando `must_change_password === true`, impedindo o uso do restante da área logada até que a senha seja alterada com sucesso.
- [x] 3.4 Após a troca de senha, garantir que o frontend atualize o estado de auth limpando `must_change_password` (false) e feche o modal.

## 4. Documentação e validação

- [x] 4.1 Atualizar a documentação (README e/ou docs da área logada) descrevendo que: (a) o Admin cria contas com senha padrão `senha123`; (b) o primeiro acesso com senha padrão sempre exige troca de senha em modal obrigatório; (c) o Admin pode resetar a senha de um usuário para `senha123`, reativando a troca obrigatória no próximo login.
- [x] 4.2 Build da API, BFF e frontend. Validar fluxos: (a) Admin inicial faz login com `senha123` e é forçado a trocar senha via modal; (b) novo autor criado pelo Admin entra com `senha123` e vê o mesmo modal obrigatório; (c) Admin reseta a senha de um autor, que volta a usar `senha123` e é novamente obrigado a trocar a senha no primeiro acesso após o reset.
