# code-improvements — delta for apply-code-improvements

## ADDED Requirements

### Requirement: Implementação das melhorias de simplificação e reaproveitamento (SHALL)

As melhorias de **simplificação de código** e **reaproveitamento de estruturas** definidas no spec **code-improvements** e no documento CODE-IMPROVEMENTS.md **devem** (SHALL) ser implementadas na aplicação através das tarefas da change **apply-code-improvements**: (1) BFF com helper partilhado para obter AuthorId do ClaimsPrincipal; (2) API com mecanismo único (base controller ou middleware) para obter AuthorId do header X-Author-Id; (3) API com Data Annotations nos DTOs e validação ModelState nos endpoints que recebem body; (4) Frontend com funções base requestPublic e requestWithAuth e funções de domínio a utilizá-las. A implementação **deve** cumprir os cenários dos requisitos existentes do spec code-improvements (API não duplica X-Author-Id, BFF usa helper partilhado, API valida DTOs com ModelState, frontend usa funções base).

#### Scenario: BFF usa helper partilhado para AuthorId

- **Quando** as tarefas da secção 1 (BFF helper) da change apply-code-improvements estão concluídas
- **Então** existe um único ficheiro (ex.: Extensions/AuthorClaimsExtensions.cs) que define GetAuthorId(ClaimsPrincipal)
- **E** BffPostsController, UsersController e AuthorsController usam esse helper e não definem GetAuthorId privado
- **E** qualquer novo controlador que precise do autor pode usar o mesmo helper

#### Scenario: API obtém AuthorId via base ou contexto

- **Quando** as tarefas da secção 2 (API contexto de autor) estão concluídas
- **Então** a constante do header X-Author-Id e o parse para Guid existem num único sítio (classe base ou middleware)
- **E** PostsController, UsersController e AuthorsController obtêm o AuthorId através desse mecanismo
- **E** não há duplicação de GetAuthorIdFromHeader ou TryGetAuthorId em vários controladores

#### Scenario: Frontend usa requestPublic e requestWithAuth

- **Quando** as tarefas da secção 4 (frontend cliente) estão concluídas
- **Então** client.ts expõe requestPublic e requestWithAuth que centralizam base URL, token, 401 e tratamento de erros
- **E** as funções de domínio (fetchPosts, fetchAllPostsForAuthorArea, createPost, etc.) chamam essas bases
- **E** o comportamento de 401 (clear auth e throw) e de mensagens de erro é consistente em todas as chamadas autenticadas
