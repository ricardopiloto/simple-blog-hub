# Reduzir exposição de informações de login na internet

## Why

Uma análise do código e da documentação mostrou que **informações de login estão expostas** de formas que podem ser acedidas pela internet ou por quem tem acesso ao repositório:

1. **Documentação pública (README, docs/deploy):** O e-mail e a senha padrão do Admin (**admin@admin.com** / **senha123**) aparecem em texto claro no README e em DEPLOY-DOCKER-CADDY.md. Qualquer pessoa com acesso ao repositório (ou ao site publicado da documentação) fica a saber as credenciais por defeito. Em produção, se o operador não configurar `Admin__Email` ou não alterar a senha no primeiro acesso, o sistema fica vulnerável.

2. **Configuração versionada (appsettings.json):** O ficheiro `backend/api/appsettings.json` pode conter um e-mail real em `Admin:Email` (ex.: ac.ricardosobral@gmail.com). Se este ficheiro for commitado, o e-mail do administrador fica exposto no repositório.

3. **Frontend (bundle servido ao cliente):** O comentário em `frontend/src/api/types.ts` contém a string literal da senha padrão (**senha123**). Consoante o processo de build, comentários podem ser removidos; se forem mantidos ou se a string aparecer noutro código, o bundle JavaScript servido aos utilizadores pode expor essa senha a quem inspeciona o código da página.

4. **Backend (constantes em código):** A API tem em `SeedData.cs` as constantes `DefaultAdminEmail`, `InitialAdminDefaultPassword` e `SeedUserPassword`. São necessárias para seed e reset de senha, mas o valor literal fica no código-fonte (e no binário). Não é viável removê-las; a mitigação é garantir que a documentação e as boas práticas de deploy exijam alteração em produção.

5. **Comportamento do login (já correto):** A API e o BFF devolvem o mesmo `401 Unauthorized` para "utilizador não encontrado" e "senha incorreta", sem distinguir os casos. O frontend mostra uma mensagem genérica ("E-mail ou senha incorretos."). Isto evita enumeração de utilizadores e deve ser formalizado como requisito.

Para reduzir o risco, é necessário: (a) não expor a senha padrão em documentação acessível à internet (usar placeholder ou referência genérica e exigir alteração em produção); (b) garantir que ficheiros de configuração versionados não contenham credenciais reais; (c) remover a string literal da senha padrão do código/comentários do frontend; (d) formalizar em spec os requisitos de não exposição e de resposta genérica no login.

## What Changes

1. **Documentação (README, docs/deploy, docs/database):** Em todos os sítios onde aparece a senha padrão em texto claro (**senha123**), substituir por uma referência genérica (ex.: "senha padrão inicial", "default password") e indicar que **em produção** o operador **deve** configurar `Admin__Email` e **deve** alterar a senha no primeiro acesso; não escrever a senha literal em documentação versionada acessível à internet. O e-mail por defeito (**admin@admin.com**) pode ser referido como "e-mail padrão do Admin quando não configurado", com aviso de que em produção se deve configurar `Admin__Email`. Manter a informação necessária para desenvolvimento local e recuperação de senha (ex.: em guia local não versionado ou em documento que exija explicitamente "apenas para desenvolvimento/local").

2. **appsettings.json (backend/api):** Garantir que o ficheiro versionado **não** contém e-mails ou credenciais reais. Usar um placeholder (ex.: `admin@example.com`) ou remover a chave `Admin:Email` do exemplo commitado; documentar que em produção a configuração deve vir de variáveis de ambiente (ex.: `Admin__Email`) ou de ficheiro não versionado.

3. **Frontend (types.ts):** Remover do comentário em `CreateUserPayload` a string literal da senha padrão. Substituir por texto genérico (ex.: "quando omitido, a API usa uma senha inicial padrão; o utilizador deve alterá-la no primeiro acesso").

4. **Spec security-hardening (delta ADDED):** Adicionar requisitos que exijam: (a) a documentação versionada e acessível à internet **não** deve conter a senha padrão em texto claro; (b) a documentação de produção **deve** exigir configuração de `Admin__Email` e alteração da senha no primeiro acesso; (c) ficheiros de configuração versionados (ex.: appsettings.json) **não** devem conter credenciais ou e-mails reais de produção; (d) o frontend **não** deve incluir a senha padrão em código nem em comentários que possam ser servidos ao cliente; (e) os endpoints de login **devem** devolver a mesma resposta genérica (ex.: 401) para "utilizador inexistente" e "senha incorreta", sem revelar qual falhou. Cenários verificáveis para cada um.

5. **Tarefas:** Incluir em tasks.md as alterações à documentação, ao appsettings, ao frontend e ao spec; validação com `openspec validate --strict`.

## Goals

- Nenhuma ocorrência da senha padrão em texto claro na documentação versionada (README, docs/deploy, docs/database).
- appsettings.json (ou equivalente versionado) sem e-mails/credenciais reais.
- Frontend sem a string literal da senha padrão em comentários ou código servido ao cliente.
- Spec security-hardening com requisitos ADDED sobre não exposição de credenciais e resposta genérica no login.
- `openspec validate harden-login-credentials-exposure --strict` passa.

## Out of scope

- Alterar as constantes no backend (SeedData) necessárias para seed e reset de senha; a mitigação é documentação e práticas de deploy.
- Implementar rate limiting ou auditoria no login (já previstos noutras changes).
- Alterar o fluxo de recuperação de senha do Admin (trigger file); apenas não expor a senha em docs versionados.

## Success criteria

- README e docs de deploy/database não contêm a senha em texto claro; referem "senha padrão" ou equivalente e exigem alteração em produção.
- backend/api/appsettings.json (versionado) usa placeholder ou não contém Admin:Email real.
- frontend/src/api/types.ts não contém a string literal da senha padrão.
- openspec/changes/harden-login-credentials-exposure/specs/security-hardening/spec.md existe com requisitos ADDED e cenários.
- Validação OpenSpec em modo strict passa.
