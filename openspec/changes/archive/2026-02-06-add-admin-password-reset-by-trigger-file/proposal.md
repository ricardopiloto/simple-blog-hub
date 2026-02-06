# Change: Recuperação da senha do Admin por ficheiro de trigger

## Why

Se o administrador do sistema esquecer a senha de acesso à conta Admin, não existe forma de recuperação sem acesso direto à base de dados. É necessário um mecanismo seguro e simples para **reiniciar a senha do Admin** para o valor padrão (ex.: `senha123`), exigindo depois a troca obrigatória no próximo login. A solução baseada em **ficheiro no servidor** evita expor um endpoint de reset na rede: apenas quem tem acesso ao sistema de ficheiros do servidor pode pedir o reset.

## What Changes

- **Mecanismo**: Na **inicialização da API** (após migrações e seed/Admin inicial), a API **deve** verificar se existe um **ficheiro de trigger** num caminho configurável (ex.: `Admin:PasswordResetTriggerPath`). Se o ficheiro existir, a API **deve**: (1) localizar o utilizador cujo e-mail coincide com `Admin:Email`; (2) definir a senha desse utilizador para o valor padrão (ex.: `senha123`), em hash (BCrypt), e marcar `MustChangePassword = true`; (3) **apagar o ficheiro** de trigger. Assim, o operador com acesso ao servidor **cria** o ficheiro para solicitar o reset; na próxima arrancada (ou num passo de startup) a API executa o reset e **apaga** o ficheiro.
- **Configuração**: Opção no appsettings (e/ou variável de ambiente) para o caminho do ficheiro de trigger (ex.: caminho absoluto ou relativo ao diretório da aplicação). Se não configurado, pode usar um nome fixo num diretório conhecido (ex.: `admin-password-reset.trigger` no diretório da aplicação ou junto a `blog.db`), documentado para o operador.
- **Segurança**: O reset só ocorre se o ficheiro existir no arranque; não é exposto qualquer endpoint HTTP para este fim. Apenas quem tem acesso ao sistema de ficheiros do servidor pode criar o ficheiro.
- **Spec**: Extensão da capability **auth**: novo requisito que exige que a senha do Admin possa ser reposta para o valor padrão através da presença de um ficheiro de trigger no arranque da API, com o ficheiro a ser removido após o reset.

## Impact

- Affected specs: **auth** (ADDED requirement).
- Affected code: `backend/api/Program.cs` (após `EnsureInitialAdminUserAsync`, chamar um novo passo que verifique o ficheiro de trigger e, se existir, reponha a senha do Admin e apague o ficheiro); possivelmente `SeedData.cs` ou um novo helper/service para o reset; configuração em `appsettings.json` (ex.: `Admin:PasswordResetTriggerPath`); `openspec/project.md` e README (documentar o procedimento de recuperação da senha do Admin).
