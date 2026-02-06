# Tasks: Recuperação da senha do Admin por ficheiro de trigger

## 1. API – lógica de reset no arranque

- [x] 1.1 Adicionar configuração opcional para o caminho do ficheiro de trigger (ex.: `Admin:PasswordResetTriggerPath` em appsettings; ou variável de ambiente `Admin__PasswordResetTriggerPath`). Se não definido, usar um caminho por defeito (ex.: ficheiro `admin-password-reset.trigger` no diretório da aplicação ou no mesmo diretório que `blog.db`).
- [x] 1.2 Implementar um passo de inicialização (ex.: método estático em `SeedData` ou extensão) que: (1) resolve o caminho do ficheiro de trigger (absoluto ou relativo ao diretório de trabalho/app); (2) se o ficheiro existir, obtém o e-mail do Admin de `Admin:Email`, localiza o `User` com esse e-mail, atualiza `PasswordHash` para o hash da senha padrão (ex.: `SeedData.InitialAdminDefaultPassword`) e define `MustChangePassword = true`, grava no banco; (3) apaga o ficheiro de trigger após sucesso. Se o ficheiro não existir, não fazer nada. Tratar exceções de I/O de forma segura (log e não falhar o arranque).
- [x] 1.3 Em `Program.cs`, após `EnsureInitialAdminUserAsync`, invocar o novo passo (passando `IConfiguration` e `BlogDbContext` ou scope adequado).

## 2. Documentação

- [x] 2.1 Atualizar `openspec/project.md` (secção Gestão de contas ou Important Constraints): descrever o procedimento de **recuperação da senha do Admin**: criar no servidor o ficheiro de trigger (caminho configurado em `Admin:PasswordResetTriggerPath` ou o valor por defeito documentado); reiniciar a API (ou garantir que o passo de startup rode); a API repõe a senha do Admin para o valor padrão e remove o ficheiro; o Admin faz login com a senha padrão e altera a senha na área do autor.
- [x] 2.2 Atualizar o README com as mesmas instruções (ex.: secção "Recuperar senha do Admin" ou subsecção em configuração), incluindo o nome/caminho por defeito do ficheiro de trigger.

## 3. Validação

- [x] 3.1 Build da API. Validar manualmente: definir `Admin:Email`, criar o utilizador Admin (primeira execução), alterar a senha e fazer logout; criar o ficheiro de trigger no caminho configurado; reiniciar a API; confirmar que o ficheiro foi apagado e que o login com a senha padrão funciona e que o modal de troca de senha é exibido.
