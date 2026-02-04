# Tasks: Cadastro de autores com senha padrão

## 1. API – senha opcional na criação de usuário

- [x] 1.1 No `CreateUserRequest`, tornar o campo `Password` opcional (nullable ou string opcional). No `UsersController.CreateUser`, quando `request.Password` for nulo ou vazio, usar a senha padrão (ex.: `SeedData.InitialAdminDefaultPassword` ou constante `"senha123"`) para gerar o hash. Manter `Email` e `AuthorName` obrigatórios.

## 2. Frontend – formulário apenas e-mail e nome

- [ ] 2.1 Na página de gestão de contas (AreaContas), no diálogo/modal de **nova conta** (cadastro de autor): remover o campo de senha do formulário. Ao enviar, usar senha padrão `senha123` no payload (ex.: `createUser({ email, author_name, password: 'senha123' })`) ou enviar sem senha se a API aceitar e usar padrão.
- [x] 2.2 No mesmo formulário ou na seção de contas, exibir uma mensagem informando que o novo autor receberá a senha padrão e deve alterá-la no primeiro acesso (seção "Alterar minha senha" na área do autor). Reforçar que apenas o Admin pode criar e excluir autores (ex.: texto na página ou no modal).

## 3. Documentação

- [x] 3.1 No README (ou na documentação da área logada): documentar que o cadastro de novos autores é feito pelo Admin na área **Contas**, informando apenas e-mail e nome; a senha inicial é `senha123` e o novo usuário deve alterá-la no primeiro acesso. Apenas o Admin pode criar e excluir autores.

## 4. Validação

- [x] 4.1 Build da API e do frontend. Validar: como Admin, abrir Contas, cadastrar novo autor apenas com e-mail e nome (sem campo senha); confirmar que o usuário foi criado e que o login com esse e-mail e `senha123` funciona; confirmar que apenas o Admin acessa a área e que a exclusão de autores também é restrita ao Admin.
