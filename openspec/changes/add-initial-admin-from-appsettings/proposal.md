# Change: Conta inicial automática a partir do e-mail em appsettings

## Why

Para configuração inicial do sistema, o operador define o e-mail do Admin em `appsettings.json` (ou `Admin__Email` no ambiente). O sistema deve criar automaticamente a conta (Author + User) para esse e-mail com senha padrão `senha123`, para que o usuário possa fazer o primeiro acesso e trocar a senha em seguida (via "Alterar minha senha" na área do autor).

## What Changes

- **API – seed / inicialização:** Após o seed existente, garantir que exista um usuário para o e-mail configurado em `Admin:Email`. Se `Admin:Email` estiver definido e não existir nenhum `User` com esse e-mail, criar um `Author` (nome pode ser derivado do e-mail ou fixo, ex.: "Admin") e um `User` com esse e-mail e senha em hash para `senha123`. Senha padrão fixa (ex.: constante `"senha123"`) apenas para essa criação automática.
- **Documentação:** No README (e/ou em `backend/api`), explicar que, na configuração inicial, o e-mail em `Admin:Email` (appsettings ou env) é usado para criar automaticamente a conta com senha padrão `senha123`; o usuário deve trocar a senha no primeiro acesso (seção "Alterar minha senha" na área do autor).

## Impact

- **Affected specs:** auth (comportamento de bootstrap da conta Admin); project-docs (documentação da configuração inicial).
- **Affected code:** `backend/api/Data/SeedData.cs` (ou novo passo de inicialização), `backend/api/Program.cs` (chamada ao passo que garante o admin inicial); README e/ou `backend/api/README.md`.
