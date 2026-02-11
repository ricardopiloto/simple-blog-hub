# security-hardening — delta for harden-login-credentials-exposure

## ADDED Requirements

### Requirement: Documentação versionada não expõe senha padrão (SHALL)

A documentação versionada e acessível à internet (README, docs/deploy, docs/database e equivalentes) **não deve** (SHALL NOT) conter a senha padrão do Admin ou de utilizadores em texto claro. Referências à senha inicial **devem** ser genéricas (ex.: "senha padrão inicial", "default password") com indicação de que o utilizador deve alterá-la no primeiro acesso. A documentação **deve** indicar que em produção o operador **deve** configurar `Admin__Email` (ou equivalente) e **deve** alterar a senha no primeiro acesso; a senha literal **não** deve aparecer em ficheiros commitados que sejam servidos ou visíveis publicamente.

#### Scenario: Leitor da documentação não vê a senha em texto claro

- **Quando** um utilizador consulta o README ou os guias em docs/deploy e docs/database
- **Então** não encontra a senha padrão escrita em texto claro
- **E** vê referência genérica à "senha padrão" ou "default password" e instrução para alterar em produção e configurar Admin__Email

---

### Requirement: Configuração versionada não contém credenciais reais (SHALL)

Os ficheiros de configuração commitados no repositório (ex.: appsettings.json, appsettings.Development.json) **não devem** (SHALL NOT) conter e-mails reais de produção nem credenciais (senhas, chaves) de ambientes reais. Valores de exemplo **devem** usar placeholders (ex.: admin@example.com). A documentação **deve** indicar que em produção a configuração (Admin__Email, connection strings, etc.) deve vir de variáveis de ambiente ou de ficheiros não versionados (.env, api.env, ficheiros fora do repositório).

#### Scenario: appsettings versionado usa apenas placeholders

- **Quando** um desenvolvedor abre o ficheiro appsettings.json (ou equivalente) versionado no repositório
- **Então** não encontra e-mails ou credenciais reais de produção
- **E** valores de exemplo são placeholders (ex.: admin@example.com) ou a chave sensível está ausente com indicação na documentação

---

### Requirement: Frontend não inclui senha padrão em código servido ao cliente (SHALL)

O código e os recursos do frontend que são servidos ao browser (bundle JavaScript, HTML, assets) **não devem** (SHALL NOT) conter a string literal da senha padrão (ex.: em comentários, constantes ou strings). Comentários em código-fonte que descrevem o comportamento "senha omitida = API usa padrão" **devem** usar texto genérico (ex.: "senha inicial padrão") sem escrever a senha. Isto reduz o risco de a senha aparecer no bundle servido à internet.

#### Scenario: Bundle do frontend não contém a senha literal

- **Quando** o frontend é construído (npm run build) e o bundle resultante é inspecionado (ex.: pesquisa por ocorrências da senha padrão)
- **Então** a string literal da senha **não** aparece no código servido ao cliente
- **E** comentários ou mensagens referem apenas "senha padrão" ou equivalente

---

### Requirement: Login devolve resposta genérica em caso de falha (SHALL)

Os endpoints de autenticação (login) da API e do BFF **devem** (SHALL) devolver a **mesma** resposta (ex.: HTTP 401 Unauthorized, sem corpo detalhado ou com mensagem genérica) tanto quando o utilizador não existe como quando a senha está incorreta. O sistema **não deve** revelar, na resposta ou em tempos de resposta significativamente diferentes, qual dos casos ocorreu, de forma a evitar enumeração de utilizadores.

#### Scenario: Resposta de login é idêntica para utilizador inexistente e senha incorreta

- **Dado** um endpoint POST de login (ex.: /bff/auth/login ou /api/auth/login)
- **Quando** o cliente envia credenciais com e-mail inexistente
- **Então** a resposta é 401 (ou equivalente) com mensagem genérica ou sem corpo que indique "utilizador não encontrado"
- **E** quando o cliente envia e-mail válido e senha incorreta, a resposta é a mesma (401, sem distinguir "senha incorreta")
- **E** o frontend mostra uma única mensagem genérica (ex.: "E-mail ou senha incorretos.") em ambos os casos
