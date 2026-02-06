# auth (delta)

## ADDED Requirements

### Requirement: Senha do Admin recuperável por ficheiro de trigger no arranque da API

O sistema **deve** (SHALL) permitir repor a senha da conta **Admin** (utilizador cujo e-mail coincide com `Admin:Email`) para o valor padrão (ex.: `senha123`) através de um **ficheiro de trigger** no servidor. Na **inicialização da API**, se existir um ficheiro num caminho configurado (ex.: `Admin:PasswordResetTriggerPath` ou um caminho por defeito documentado), a API **deve** (SHALL): (1) localizar o utilizador Admin; (2) definir a sua senha para o valor padrão (em hash, ex.: BCrypt) e marcar `MustChangePassword = true`; (3) **apagar o ficheiro** de trigger. Assim, apenas quem tem acesso ao sistema de ficheiros do servidor pode solicitar o reset; não **deve** existir endpoint HTTP para este fim.

#### Scenario: Operador cria ficheiro de trigger e reinicia a API para repor senha do Admin

- **Dado** que o Admin esqueceu a senha e um operador tem acesso ao servidor
- **Quando** o operador cria o ficheiro de trigger no caminho configurado (ou no caminho por defeito documentado)
- **E** a API é iniciada (ou reiniciada)
- **Então** a API **deve** detetar o ficheiro, repor a senha do utilizador Admin para o valor padrão (ex.: `senha123`) e marcar que deve alterar a senha no próximo login
- **E** a API **deve** apagar o ficheiro de trigger após o reset
- **E** o Admin pode fazer login com a senha padrão e **deve** ser solicitado a alterar a senha (modal de troca obrigatória)

#### Scenario: Sem ficheiro de trigger o arranque não altera a senha do Admin

- **Quando** a API arranca e o ficheiro de trigger **não** existe no caminho configurado
- **Então** a API **não** deve alterar a senha de qualquer utilizador
- **E** o arranque prossegue normalmente
