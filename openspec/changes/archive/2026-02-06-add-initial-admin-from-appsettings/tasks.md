# Tasks: Conta inicial automática a partir do e-mail em appsettings

## 1. API – garantir conta inicial do Admin

- [x] 1.1 Definir senha padrão para a conta inicial (ex.: constante `"senha123"`) em um único lugar (ex.: em `SeedData` ou em configuração).
- [x] 1.2 Após o seed existente (`EnsureSeedAsync`), executar um passo que leia `Admin:Email` da configuração da API. Se estiver definido (não vazio) e não existir `User` com esse e-mail, criar um `Author` (nome ex.: "Admin" ou derivado do e-mail) e um `User` vinculado com esse e-mail e senha em hash (BCrypt) da senha padrão. Persistir no banco.
- [x] 1.3 Garantir que o passo seja executado na inicialização da API (ex.: em `Program.cs`, após `EnsureSeedAsync`, usando `IConfiguration` para ler `Admin:Email` e chamar o novo método de garantia da conta inicial).

## 2. Documentação

- [x] 2.1 No README (e/ou em `backend/api/README.md`): documentar que, na configuração inicial, o e-mail definido em `Admin:Email` (appsettings ou variável `Admin__Email`) é usado para criar automaticamente a conta com senha padrão `senha123`; o usuário deve trocar a senha no primeiro acesso (seção "Alterar minha senha" na área do autor).

## 3. Validação

- [x] 3.1 Com `Admin:Email` definido em appsettings e banco vazio (ou sem usuário com esse e-mail), iniciar a API e confirmar que o usuário foi criado; fazer login com esse e-mail e senha `senha123` e alterar a senha pela área do autor.
