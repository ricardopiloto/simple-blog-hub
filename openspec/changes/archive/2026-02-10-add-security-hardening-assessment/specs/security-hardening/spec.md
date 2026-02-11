# security-hardening — delta for add-security-hardening-assessment

## ADDED Requirements

### Requirement: Conteúdo HTML de posts MUST ser sanitizado para mitigar XSS

O conteúdo HTML exibido na leitura pública de posts (gerado a partir de Markdown ou pass-through de HTML) **DEVE** (SHALL) ser sanitizado antes de ser devolvido ao cliente ou antes de ser injetado no DOM, de forma a eliminar scripts e atributos perigosos (XSS). A sanitização **DEVE** cobrir o caso em que o conteúdo começa com HTML bruto (pass-through no MarkdownService) e o resultado da conversão Markdown→HTML. A implementação pode ser no backend (ex.: HtmlSanitizer no MarkdownService) e/ou no frontend (ex.: DOMPurify antes de dangerouslySetInnerHTML).

#### Scenario: Conteúdo com script malicioso não é executado

- **Dado** que um post contém HTML com `<script>alert(1)</script>` ou equivalente
- **Quando** o conteúdo é exibido na página do post (leitura pública)
- **Então** o script **não** é executado no browser
- **E** apenas marcação segura (ex.: texto, tags permitidas) é apresentada

#### Scenario: Pass-through HTML no MarkdownService é sanitizado

- **Dado** que o conteúdo armazenado começa com `<` (tratado como HTML pass-through)
- **Quando** o backend devolve o conteúdo para leitura pública
- **Então** o HTML é sanitizado antes de ser enviado (ou o frontend sanitiza antes de injetar)
- **E** elementos e atributos perigosos (script, on*, javascript:) são removidos

### Requirement: CORS SHALL be configurado de forma restritiva em produção

O BFF **DEVE** (SHALL) aplicar uma política CORS que **não** permita qualquer origem em ambiente de produção. Em produção, a configuração **DEVE** exigir uma lista explícita de origens permitidas (ex.: `Cors:AllowedOrigins`); se essa lista estiver vazia ou não configurada em produção, o arranque **DEVE** falhar (ou a política **NÃO** deve usar AllowAnyOrigin).

#### Scenario: Produção sem origens CORS configuradas falha ao arrancar

- **Dado** que a aplicação está em ambiente de produção (ex.: ASPNETCORE_ENVIRONMENT=Production)
- **E** Cors:AllowedOrigins está vazio ou não definido
- **Quando** o BFF arranca
- **Então** o arranque falha com mensagem clara ou a política CORS não usa AllowAnyOrigin
- **E** o operador é obrigado a configurar origens permitidas

#### Scenario: Apenas origens configuradas são aceites

- **Dado** que Cors:AllowedOrigins está definido com uma ou mais origens (ex.: https://meusite.com)
- **Quando** um pedido é feito de uma origem não listada
- **Então** a resposta não inclui Access-Control-Allow-Origin para essa origem (ou CORS rejeita)
- **E** pedidos de origens listadas são aceites

### Requirement: Headers de segurança HTTP SHALL be aplicados

As respostas da API e do BFF (ou do proxy reverso que os expõe, ex.: Caddy) **DEVEM** (SHALL) incluir headers de segurança que reduzam riscos de clickjacking, MIME sniffing e divulgação de referrer. Pelo menos os seguintes **DEVEM** estar presentes quando aplicável: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (ou SAMEORIGIN conforme política), `Referrer-Policy` (ex.: no-referrer ou strict-origin). Em produção com HTTPS, **DEVE** ser configurado `Strict-Transport-Security`. Uma política mínima de Content-Security-Policy **PODE** ser aplicada para restringir fontes de script e recursos.

#### Scenario: Resposta inclui X-Content-Type-Options e X-Frame-Options

- **Quando** um cliente faz um pedido a um endpoint do BFF (ou à API)
- **Então** a resposta inclui o header `X-Content-Type-Options: nosniff`
- **E** a resposta inclui o header `X-Frame-Options` com valor DENY ou SAMEORIGIN
- **E** a resposta inclui um header `Referrer-Policy` adequado

#### Scenario: HSTS em produção com HTTPS

- **Dado** que o ambiente é produção e o tráfego é servido por HTTPS
- **Quando** o servidor responde
- **Então** a resposta inclui o header `Strict-Transport-Security` com max-age adequado
- **E** o browser pode impor upgrade para HTTPS em pedidos subsequentes

### Requirement: Secrets e chave interna SHALL be validados em produção

Em ambiente de produção, o BFF **DEVE** (SHALL) validar que `Jwt:Secret` (ou equivalente) está configurado e tem tamanho/entropia mínimos (ex.: pelo menos 32 caracteres); caso contrário, o arranque **DEVE** falhar. A API **DEVE** validar que `API:InternalKey` (ou equivalente) está configurado em produção; se não estiver, o arranque **DEVE** falhar, de forma a que a API não fique acessível sem autenticação interna. Valores reais de secrets **NÃO** devem estar em ficheiros versionados (appsettings.json de produção); **DEVEM** ser fornecidos via variáveis de ambiente ou secret store.

#### Scenario: BFF não arranca em produção sem JWT secret forte

- **Dado** que ASPNETCORE_ENVIRONMENT=Production (ou equivalente)
- **E** Jwt:Secret está vazio, ausente ou tem menos de 32 caracteres
- **Quando** o BFF tenta arrancar
- **Então** o arranque falha com mensagem indicando que o secret é obrigatório ou insuficiente
- **E** o servidor não serve pedidos até a configuração ser corrigida

#### Scenario: API não arranca em produção sem chave interna

- **Dado** que a API está em ambiente de produção
- **E** API:InternalKey está vazio ou não configurado
- **Quando** a API tenta arrancar
- **Então** o arranque falha ou a API recusa pedidos sem o header da chave
- **E** não é possível aceder à API sem configurar a chave partilhada com o BFF

### Requirement: Uploads de imagens MUST be validados por assinatura de ficheiro

O endpoint de upload de imagens (ex.: capa de post) **DEVE** (MUST) validar o tipo de ficheiro não apenas pelo header Content-Type, mas pela assinatura do ficheiro (magic bytes) para os formatos permitidos (ex.: JPEG, PNG, WebP). Ficheiros cuja assinatura não corresponda a um tipo permitido **DEVEM** ser rejeitados. Opcionalmente, **PODE** ser aplicada validação de dimensões ou tamanho máximo para mitigar DoS ou ficheiros mal formados.

#### Scenario: Ficheiro com Content-Type de imagem mas magic bytes inválidos é rejeitado

- **Dado** que o cliente envia um ficheiro com Content-Type: image/png
- **E** os primeiros bytes do ficheiro não correspondem à assinatura de PNG (ou de outro tipo permitido)
- **Quando** o BFF processa o upload
- **Então** o pedido é rejeitado (ex.: 400 Bad Request)
- **E** o ficheiro não é guardado no sistema de ficheiros público

#### Scenario: Apenas formatos permitidos são aceites

- **Quando** o cliente envia um ficheiro cujos magic bytes correspondem a um tipo permitido (ex.: JPEG, PNG)
- **Então** o upload é aceite e o ficheiro é guardado com extensão segura
- **E** tipos não permitidos (ex.: executável disfarçado com extensão .jpg) são rejeitados quando os magic bytes não forem de imagem permitida

### Requirement: Validação de input e política de senha SHALL be reforçadas

Os DTOs da API **DEVEM** (SHALL) usar anotações de validação (ex.: Required, EmailAddress, StringLength) onde aplicável, e a API **DEVE** validar o modelo (ModelState ou equivalente) antes de processar. O slug de posts **DEVE** ser validado com uma expressão restritiva (ex.: apenas caracteres seguros para URL). A política de senha **DEVE** exigir um mínimo de 8 caracteres (ou superior), com critérios de complexidade (maiúsculas, minúsculas, dígitos, etc.) e, quando viável, verificação contra listas de senhas comuns. O email **DEVE** ser validado quanto ao formato (ex.: EmailAddress).

#### Scenario: DTO sem campos obrigatórios preenchidos é rejeitado

- **Dado** que um endpoint aceita um DTO com campos [Required]
- **Quando** o cliente envia um pedido com esses campos em branco ou inválidos
- **Então** a API responde com 400 Bad Request
- **E** a mensagem ou ModelState indica os campos em erro

#### Scenario: Senha fraca é rejeitada

- **Dado** que a política de senha exige mínimo 8 caracteres e complexidade
- **Quando** o utilizador ou Admin tenta definir uma senha com menos de 8 caracteres ou sem os critérios
- **Então** a API rejeita o pedido e a senha não é alterada
- **E** o cliente recebe indicação do requisito não cumprido

### Requirement: Rate limiting SHALL be aplicado em endpoints sensíveis

O BFF (ou o proxy reverso) **DEVE** (SHALL) aplicar rate limiting a endpoints sensíveis, em particular: login (autenticação), upload de ficheiros e endpoints administrativos (gestão de utilizadores, reset de senha). Os limites **DEVEM** ser configuráveis e **DEVEM** rejeitar pedidos em excesso (ex.: 429 Too Many Requests) para mitigar brute force e abuso de recursos.

#### Scenario: Muitos pedidos de login no mesmo período são limitados

- **Dado** que o rate limiting para o endpoint de login está configurado (ex.: N tentativas por minuto por IP)
- **Quando** um cliente excede esse número de pedidos no período
- **Então** o servidor responde com 429 Too Many Requests (ou equivalente)
- **E** pedidos subsequentes no mesmo período são rejeitados até expirar a janela

#### Scenario: Uploads em excesso são limitados

- **Quando** um cliente autenticado faz um número de pedidos de upload acima do limite configurado
- **Então** o servidor responde com 429 ou rejeita o upload
- **E** o limite protege contra abuso de armazenamento e banda

### Requirement: Logs de auditoria SHALL existir para ações administrativas

O sistema **DEVE** (SHALL) registar em log (auditoria) as ações administrativas e sensíveis: criação de utilizadores, exclusão de utilizadores, alteração de senha (própria ou reset por Admin), publicação e remoção de posts quando feitas por Admin ou com impacto global. Os logs **NÃO** devem incluir senhas, tokens ou dados sensíveis em texto claro. O formato **DEVE** permitir identificar quem (identificador do autor ou utilizador), o quê (ação) e quando.

#### Scenario: Criação de utilizador é registada em log

- **Dado** que o Admin cria um novo utilizador (email, nome)
- **Quando** a API processa o pedido com sucesso
- **Então** um log de auditoria é escrito com a ação (ex.: "UserCreated"), identificador do autor da ação e timestamp
- **E** a senha ou dados sensíveis não aparecem no log

#### Scenario: Reset de senha é registado

- **Quando** o Admin reseta a senha de um utilizador para o valor padrão
- **Então** um log de auditoria é escrito indicando a ação e o utilizador alvo (ex.: por id ou email)
- **E** o valor da senha nunca é logado

### Requirement: Hardening de infra e documentação de segurança SHALL be aplicados

Os Dockerfiles da API e do BFF **DEVEM** (SHALL) executar o processo como utilizador não-root (ex.: USER com UID/GID não privilegiados). O repositório **DEVE** dispor de documentação (ou ficheiro versionado) que descreva as variáveis de ambiente e configurações obrigatórias para produção, recomendações de firewall e permissões no host, e um Caddyfile de exemplo (ou equivalente) que inclua redirecionamento HTTP→HTTPS e os headers de segurança referidos no requisito de headers. A pasta de dados (ex.: `data/` com SQLite) **DEVE** ter permissões restritivas no host.

#### Scenario: Container não corre como root

- **Quando** a imagem da API ou do BFF é executada (ex.: docker run)
- **Então** o processo principal do container **não** corre com UID 0 (root)
- **E** o Dockerfile declara USER com um utilizador não privilegiado

#### Scenario: Documentação de produção existe

- **Quando** um operador consulta o repositório para preparar um deploy em produção
- **Então** existe documentação (ex.: SECURITY-HARDENING.md, DEPLOY, ou docs/) que lista variáveis obrigatórias (Jwt:Secret, API:InternalKey, Cors:AllowedOrigins, etc.)
- **E** existe referência a HTTPS, headers de segurança e, quando aplicável, um Caddyfile de exemplo versionado

#### Scenario: Caddyfile de exemplo inclui segurança

- **Dado** que existe um Caddyfile de exemplo no repositório (ou em docs)
- **Quando** o operador o utiliza como base
- **Então** o ficheiro inclui redirecionamento de HTTP para HTTPS
- **E** inclui configuração para os headers de segurança (X-Content-Type-Options, X-Frame-Options, etc.) ou indica que devem ser aplicados no BFF/API
