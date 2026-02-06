# Change: Área de cadastro de autores com senha padrão

## Why

O Admin precisa de uma área clara para cadastrar novos autores: apenas e-mail e nome; a senha será sempre a padrão `senha123`, e o novo usuário deve alterá-la no primeiro acesso. Apenas o Admin pode criar novos autores e excluir autores existentes (já garantido pela área de Contas; este change explicita o fluxo de cadastro com senha padrão e ajusta o formulário/API para não exigir senha no cadastro).

## What Changes

- **API:** No endpoint de criação de usuário (POST /api/users), tornar o campo `password` opcional no body. Quando não informado ou vazio, usar a senha padrão `senha123` (ex.: reutilizar `SeedData.InitialAdminDefaultPassword` ou constante equivalente). Manter obrigatórios `email` e `author_name`. Apenas Admin pode criar e deletar (já implementado).
- **Frontend:** Na área de gestão de contas (Contas / cadastro de autores), o formulário de **novo autor** passa a solicitar apenas **e-mail** e **nome**; remover o campo de senha do formulário e enviar a senha padrão no payload (ou omitir e deixar a API usar o padrão). Exibir mensagem de que o novo autor deve trocar a senha no primeiro acesso (seção "Alterar minha senha" na área do autor). Reforçar na UI que apenas o Admin pode criar e excluir autores.
- **Documentação:** No README (e/ou na própria tela), deixar explícito que o cadastro de novos autores é feito pelo Admin com e-mail e nome; a senha inicial é `senha123` e deve ser alterada no primeiro acesso.

## Impact

- **Affected specs:** auth (fluxo de cadastro de autores com senha padrão; apenas Admin cria/deleta autores).
- **Affected code:** API `CreateUserRequest` e `UsersController.CreateUser`; frontend formulário em AreaContas (remover campo senha, usar padrão); README.
