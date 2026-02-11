# Design: Aplicação das melhorias de código

## 1. BFF — Helper GetAuthorId(ClaimsPrincipal)

- **Decisão:** Método de extensão em `ClaimsPrincipal` num ficheiro partilhado (ex.: `Extensions/AuthorClaimsExtensions.cs`). O claim que guarda o author id no JWT é definido no JwtService (ex.: `"author_id"` ou `ClaimTypes.NameIdentifier`); o helper lê esse claim e faz Guid.TryParse. Retorna `Guid?` (null se ausente ou inválido).
- **Uso:** BffPostsController, UsersController e AuthorsController removem o método privado `GetAuthorId(User)` e passam a chamar `User.GetAuthorId()` (ou nome equivalente). O ficheiro de extensão deve ser o único que conhece o nome do claim.

## 2. API — Contexto de autor (X-Author-Id)

- **Opção A — Middleware:** Middleware que, para rotas que exijam autor (ex.: todas exceto GET /api/posts públicos e /api/auth/login), lê o header X-Author-Id, valida com Guid.TryParse e regista em HttpContext.Items["AuthorId"] (tipo Guid?). Se o header estiver ausente ou inválido em rota protegida, responder 401. Controllers obtêm com `(Guid?)HttpContext.Items["AuthorId"]`. Requer definir quais rotas são "protegidas por autor" (pode ser por convenção de prefixo ou atributo).
- **Opção B — Base controller:** Classe abstrata (ex.: `AuthorizedApiControllerBase`) com constante AuthorIdHeader e método protegido `Guid? GetAuthorIdFromHeader()` (ou bool TryGetAuthorId(out Guid)). Controllers que precisam do autor herdam dessa base. Mantém um único sítio para o nome do header e o parse; não exige middleware.
- **Recomendação:** Base controller é mais simples e evita tocar no pipeline de rotas; middleware é mais "limpo" para APIs maiores. Para este projeto, **base controller** com método protegido GetAuthorIdFromHeader() (ou TryGetAuthorId) permite que PostsController, UsersController e AuthorsController herdem dela e removam a duplicação sem adicionar middleware. A constante AuthorIdHeader fica na base.

## 3. API — Data Annotations e ModelState

- **Onde:** AuthDtos.cs (LoginRequest: Email, Password Required; opcional EmailAddress em Email), UserDtos.cs (CreateUserRequest, UpdateUserRequest: Required e StringLength onde aplicável), PostDto ou CreateOrUpdatePostRequest (Title, Slug, etc.). Em cada action que recebe [FromBody], primeira linha após entrada: `if (!ModelState.IsValid) return BadRequest(ModelState);`.
- **Coordenação:** A change apply-security-hardening task 3.2 já prevê "Data Annotations nos DTOs e ModelState.IsValid". Se apply-security-hardening for aplicada primeiro, esta tarefa pode limitar-se a rever consistência; se não, implementar aqui para que apply-code-improvements seja independente.

## 4. Frontend — requestPublic e requestWithAuth

- **requestPublic(path, options?):** path é relativo à base do BFF (ex.: "bff/posts?order=date"). Monta URL = getBffBaseUrl() + "/" + path. fetch com options, headers incluem Accept: application/json. Se !res.ok: ler res.text(), lançar new Error(mensagem). Se res.ok: res.json(). Tratar 204 ou content-length 0 como undefined.
- **requestWithAuth(path, options?):** igual mas adiciona Authorization: Bearer token; se !token, authStorage.clear() e throw. Se res.status === 401, authStorage.clear() e throw. Depois mesmo tratamento de !res.ok e corpo.
- **Funções de domínio:** fetchPosts → requestPublic("bff/posts?order=" + encodeURIComponent(order)). fetchAllPostsForAuthorArea → requestWithAuth("bff/posts/author-area"). createPost → requestWithAuth("bff/posts", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }). login e fetchPostBySlug são especiais: login retorna null em !res.ok (não throw); fetchPostBySlug retorna null em 404. Podem usar requestPublic com um wrapper que capture 404/null ou manter lógica mínima própria que chame requestPublic/requestWithAuth com flag ou opção.
- **Compatibilidade:** Manter assinaturas públicas das funções exportadas (fetchPosts, fetchPostBySlug, login, etc.) para não quebrar chamadores; apenas a implementação interna passa a usar as bases.
