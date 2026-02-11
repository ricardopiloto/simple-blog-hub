# code-improvements — delta for add-code-improvements-evaluation

## ADDED Requirements

### Requirement: Melhorias de segurança SHALL seguir o plano SECURITY-HARDENING

As melhorias de **segurança** do projeto **devem** (SHALL) ser implementadas de acordo com o plano definido em **SECURITY-HARDENING.md** e com os requisitos do spec **security-hardening**. As fases (proteção XSS e tokens, CORS e headers e secrets, uploads e validação de input, rate limiting e auditoria, hardening de infra) **devem** ser priorizadas na ordem indicada nesse documento. Qualquer change que implemente um item de segurança **deve** alinhar-se ao requisito correspondente no spec security-hardening (sanitização de HTML, CORS restritivo, headers de segurança, validação de secrets, validação de uploads, validação de input e senha, rate limiting, auditoria, infra).

#### Scenario: Implementação de segurança referencia o plano e o spec

- **Quando** uma change OpenSpec implementa uma melhoria de segurança (ex.: sanitização de HTML, CORS, headers)
- **Então** a proposta ou tarefas referenciam o SECURITY-HARDENING.md e o requisito correspondente no spec security-hardening
- **E** o comportamento implementado cumpre o cenário definido nesse requisito

#### Scenario: Prioridade das fases de segurança é respeitada

- **Quando** a equipa planeia implementações de segurança
- **Então** a Fase 1 (XSS e tokens) é tratada antes de fases posteriores, salvo justificação explícita
- **E** o documento CODE-IMPROVEMENTS.md e o SECURITY-HARDENING.md são a referência para a ordem das fases

### Requirement: Simplificação de código SHALL reduzir duplicação de extração de AuthorId e de validação

O projeto **deve** (SHALL) reduzir a duplicação de lógica de **extração do identificador do autor** no backend e de **validação de input** na API. Na **API**, a leitura e validação do header `X-Author-Id` **devem** ser centralizadas (ex.: middleware que popule o contexto do request, ou classe base de controller com um único método `GetAuthorId()`), em vez de repetir a mesma lógica em PostsController, UsersController e AuthorsController. No **BFF**, a extração do AuthorId a partir do `ClaimsPrincipal` (JWT) **deve** ser feita através de um **helper partilhado** (ex.: método de extensão ou classe estática) usado por todos os controladores que precisem do autor, em vez de duplicar o mesmo código em BffPostsController, UsersController e AuthorsController. Na **API**, os DTOs de entrada **devem** usar **Data Annotations** (ex.: Required, EmailAddress, StringLength) e os endpoints que recebem corpo **devem** validar com **ModelState** (ou equivalente) e retornar BadRequest quando inválido, de forma consistente.

#### Scenario: API não duplica lógica de X-Author-Id em vários controladores

- **Dado** que a API exige o header X-Author-Id em endpoints protegidos
- **Quando** um desenvolvedor adiciona um novo endpoint que precisa do autor
- **Então** o AuthorId é obtido através de um único mecanismo (middleware, base controller ou serviço de contexto)
- **E** não é necessário copiar código de leitura/parse do header em cada controlador

#### Scenario: BFF usa helper partilhado para AuthorId do JWT

- **Dado** que o BFF expõe endpoints que precisam do autor autenticado (JWT)
- **Quando** um controlador precisa do AuthorId do utilizador
- **Então** usa um helper ou extensão partilhada (ex.: GetAuthorId(ClaimsPrincipal))
- **E** o mesmo helper é usado em BffPostsController, UsersController e AuthorsController (ou equivalentes)

#### Scenario: API valida DTOs com Data Annotations e ModelState

- **Quando** um endpoint da API recebe um corpo (ex.: LoginRequest, CreateUserRequest, PostDto)
- **Então** o DTO tem anotações de validação (Required, EmailAddress, etc.) onde aplicável
- **E** o action verifica ModelState.IsValid e retorna BadRequest(ModelState) quando inválido
- **E** a validação manual redundante (string.IsNullOrWhiteSpace em vários sítios) é removida ou reduzida

### Requirement: Reaproveitamento de estruturas SHALL oferecer contexto de autor e cliente HTTP unificado

O projeto **deve** (SHALL) dispor de **estruturas reutilizáveis** para: (1) **contexto de autor na API** — middleware ou serviço que exponha o AuthorId validado (a partir de X-Author-Id) para os controladores, de forma a evitar repetição e erros de parse; (2) **contexto de autor no BFF** — helper ou extensão que extraia o AuthorId do ClaimsPrincipal de forma única e consistente; (3) **cliente HTTP do frontend** — funções base (ex.: requestPublic e requestWithAuth) que centralizem a construção da URL do BFF, o envio do token, o tratamento de 401 (clear auth e throw) e o tratamento de respostas não-ok, de forma a que as funções de domínio (fetchPosts, fetchPostBySlug, etc.) reutilizem essa base e não dupliquem lógica. Estas estruturas **podem** ser implementadas incrementalmente (ex.: primeiro BFF helper, depois API middleware, depois frontend client).

#### Scenario: Frontend usa funções base para chamadas ao BFF

- **Quando** o frontend faz uma chamada autenticada ao BFF (ex.: listar posts editáveis, criar post)
- **Então** a chamada usa uma função base (ex.: requestWithAuth) que adiciona o token, trata 401 limpando a sessão e reutiliza a mesma lógica de erro
- **E** as funções de domínio em client.ts não duplicam o código de base URL, Authorization e tratamento de 401

#### Scenario: API expõe AuthorId via contexto ou base

- **Quando** um controlador da API precisa do AuthorId do caller (header X-Author-Id)
- **Então** o valor está disponível através de um mecanismo centralizado (HttpContext.Items, IRequestAuthorContext, ou método único numa base controller)
- **E** os controladores não implementam cada um a sua própria leitura e parse do header
