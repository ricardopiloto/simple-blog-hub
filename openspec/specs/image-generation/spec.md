# image-generation Specification

## Purpose
TBD - created by archiving change add-image-generation. Update Purpose after archive.
## Requirements
### Requirement: Página de Geração de Imagem na Área do Autor (SHALL)

O sistema **DEVE** (SHALL) disponibilizar uma página de **Geração de Imagem** na rota **`/area-autor/geracao-imagem`**, acessível apenas a **utilizadores autenticados** (rota protegida). A navegação autenticada (header desktop e mobile) **DEVE** incluir um link **"Geração de Imagem"** visível a todos os autores logados, seguindo o mesmo padrão de descoberta do link **Contas**. A página **DEVE** conter: (1) campo de texto multilinha para o **prompt**, com placeholder descritivo em português; (2) botão **"Gerar Imagem"**; (3) área abaixo do prompt para exibir a imagem gerada ou o estado de carregamento.

#### Scenario: Autor autenticado acede à página via header

- **Dado** que o utilizador está autenticado como autor
- **Quando** visualiza o header (desktop ou mobile)
- **Então** vê o link "Geração de Imagem"
- **E** ao clicar navega para `/area-autor/geracao-imagem`

#### Scenario: Utilizador não autenticado não acede à rota

- **Dado** que o utilizador não está autenticado
- **Quando** tenta aceder a `/area-autor/geracao-imagem`
- **Então** é redirecionado para login (comportamento de `ProtectedRoute`)

---

### Requirement: Verificação de credenciais Cloudflare antes de gerar

Antes de exibir o formulário de geração, a página **DEVE** (SHALL) verificar se o autor possui **Account ID** Cloudflare preenchido **e** `hasCloudflareApiToken === true` (token guardado no servidor). Se as credenciais estiverem incompletas, a página **DEVE** exibir uma mensagem orientando o autor a configurar Account ID e API Token em **Contas**, com **link directo** para `/area-autor/contas`, e **NÃO** deve exibir o formulário de prompt.

#### Scenario: Autor sem credenciais vê aviso em vez do formulário

- **Dado** que sou um autor autenticado sem Account ID ou sem token Cloudflare configurado
- **Quando** acedo a `/area-autor/geracao-imagem`
- **Então** vejo uma mensagem de aviso sobre credenciais em falta
- **E** vejo um link para `/area-autor/contas`
- **E** não vejo o campo de prompt nem o botão "Gerar Imagem"

---

### Requirement: Geração de imagem via BFF e Cloudflare Workers AI

Com credenciais configuradas, ao clicar **"Gerar Imagem"** com prompt preenchido, o sistema **DEVE** (SHALL):

- O frontend **DEVE** enviar `POST /bff/image-generation/generate` com body `{ "prompt": "..." }` e header `Authorization: Bearer <jwt>`.
- O BFF **DEVE** obter credenciais e **modelo** do autor na API interna (`GET /api/image-generation/credentials/{authorId}` com `X-Api-Key`), incluindo `accountId`, `apiToken` e `imageModel`.
- O BFF **DEVE** chamar `POST https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{imageModel}` com o prompt, onde `{imageModel}` é o valor devolvido pela API (persistido ou default `@cf/black-forest-labs/flux-1-schnell`).
- O BFF **DEVE** devolver `{ "image": "<base64 string>" }` ao frontend.
- O frontend **DEVE** exibir a imagem com `<img src="data:image/png;base64,..." />`.
- Uma nova geração **DEVE** substituir a imagem anteriormente exibida.

#### Scenario: Geração bem-sucedida

- **Dado** que sou um autor autenticado com credenciais Cloudflare válidas
- **Quando** acedo a `/area-autor/geracao-imagem`, digito um prompt e clico "Gerar Imagem"
- **Então** vejo um indicador de carregamento na área da imagem
- **E** após a resposta vejo a imagem gerada abaixo do campo de prompt
- **E** o botão "Gerar Imagem" volta a ficar habilitado

#### Scenario: Endpoint exige JWT

- **Dado** que sou um utilizador não autenticado
- **Quando** envio `POST /bff/image-generation/generate` sem header `Authorization`
- **Então** recebo HTTP **401 Unauthorized**

### Requirement: Validação e UX de carregamento na geração

Durante a geração, o sistema **DEVE** (SHALL):

- Manter o botão **"Gerar Imagem"** **desabilitado** enquanto uma geração estiver em curso.
- O indicador de carregamento (spinner ou skeleton) **DEVE** aparecer na área da imagem durante a espera.
- Se o prompt estiver vazio, o frontend **DEVE** impedir o envio e exibir **"O prompt não pode estar vazio"** sem chamar o BFF.

#### Scenario: Prompt vazio bloqueado no cliente

- **Dado** que tenho credenciais configuradas
- **Quando** deixo o prompt vazio e clico "Gerar Imagem"
- **Então** vejo a mensagem "O prompt não pode estar vazio"
- **E** nenhum pedido é enviado ao BFF

---

### Requirement: Tratamento de erros de geração

O sistema **DEVE** (SHALL) tratar e exibir mensagens amigáveis em português para, no mínimo:

- **Credenciais em falta** (BFF 422 `no_credentials`): orientar a configurar em Contas.
- **Credenciais inválidas** (Cloudflare 401/403 → BFF 422 `invalid_credentials`): "Suas credenciais Cloudflare são inválidas. Verifique o Account ID e o API Token em Contas."
- **Timeout** (BFF 504 `timeout`): sugerir tentar novamente.
- **Erro genérico do provider** (BFF 502 `provider_error`): mensagem genérica sem expor detalhes técnicos internos.

#### Scenario: Token Cloudflare inválido

- **Dado** que tenho Account ID correcto mas API Token inválido
- **Quando** submeto um prompt válido
- **Então** vejo mensagem sobre credenciais inválidas com referência a Contas
- **E** nenhuma imagem é exibida

#### Scenario: Timeout na Cloudflare

- **Dado** que a chamada à Cloudflare excede o timeout configurado no BFF
- **Quando** aguardo a resposta
- **Então** vejo mensagem de timeout com sugestão de tentar novamente

---

### Requirement: Segurança na geração — token Cloudflare nunca exposto ao browser

O BFF **DEVE** (SHALL) ser o único componente no caminho browser→servidor que utiliza o API Token Cloudflare em texto claro (após desencriptação pela API). O frontend **NUNCA** deve receber o token em qualquer resposta JSON. O endpoint `POST /bff/image-generation/generate` **DEVE** exigir JWT válido.

#### Scenario: Respostas BFF não contêm o API Token

- **Dado** que tenho credenciais Cloudflare configuradas
- **Quando** inspecciono as respostas de `GET /bff/users/me` (ou equivalente) e de `POST /bff/image-generation/generate`
- **Então** o corpo JSON não contém o valor do API Token Cloudflare

### Requirement: Modelo Workers AI configurável por autor na geração

A geração de imagem **DEVE** (SHALL) usar o **model path** Cloudflare Workers AI configurado no perfil do autor autenticado, e não um modelo fixo no código do BFF.

- Constante de default do sistema: **`@cf/black-forest-labs/flux-1-schnell`**.
- O endpoint interno `GET /api/image-generation/credentials/{authorId}` **DEVE** devolver `imageModel`: valor de `Author.CloudflareImageModel` se preenchido, senão o default.
- O BFF **DEVE** chamar `POST https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{imageModel}` com o `imageModel` recebido da API.
- Autores **sem** valor guardado **DEVEM** continuar a gerar imagens com o default (comportamento idêntico ao de `add-image-generation` antes desta change).
- A API **DEVE** validar `cloudflare_image_model` ao gravar em Contas: trim, máximo 128 caracteres, formato **`^@cf/[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+$`**; caso contrário **400 Bad Request**.

#### Scenario: Geração com modelo default implícito

- **Dado** que sou um autor com Account ID e token configurados e **sem** `cloudflare_image_model` guardado
- **Quando** gero uma imagem com prompt válido
- **Então** o BFF chama a Cloudflare com modelo `@cf/black-forest-labs/flux-1-schnell`
- **E** a imagem é devolvida com sucesso (assumindo credenciais e quota válidas)

#### Scenario: Geração com modelo personalizado

- **Dado** que configurei **Modelo de imagem** em Contas como `@cf/black-forest-labs/flux-1-schnell` ou outro path válido diferente do que estava hardcoded antes
- **Quando** gero uma imagem
- **Então** o BFF usa exactamente o modelo guardado no perfil na URL `/ai/run/{imageModel}`
- **E** não usa um modelo fixo diferente no código

#### Scenario: Modelo inválido na Cloudflare

- **Dado** que configurei um modelo com formato válido mas inexistente ou sem permissão na minha conta Cloudflare
- **Quando** gero uma imagem
- **Então** vejo mensagem de erro amigável (ex.: erro genérico do provider ou orientação para rever o modelo em Contas)
- **E** nenhuma imagem é exibida

