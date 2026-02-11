# Tasks: apply-code-improvements

## 1. BFF — Helper partilhado para AuthorId

- [x] 1.1 Criar ficheiro partilhado (ex.: `backend/bff/Extensions/AuthorClaimsExtensions.cs`) com método de extensão `GetAuthorId(this ClaimsPrincipal user)` que leia o claim do author id (mesmo nome usado no JwtService), faça Guid.TryParse e retorne Guid?; retornar null se ausente ou inválido.
- [x] 1.2 Em BffPostsController, UsersController e AuthorsController, remover o método privado `GetAuthorId(ClaimsPrincipal)` e substituir chamadas por `User.GetAuthorId()` (ou equivalente).

## 2. API — Contexto de autor (X-Author-Id)

- [x] 2.1 Criar classe base (ex.: `AuthorizedApiControllerBase`) em `backend/api/Controllers/` com a constante do header X-Author-Id e método protegido que leia o header, valide com Guid.TryParse e retorne Guid? (ou bool TryGetAuthorId(out Guid)).
- [x] 2.2 Fazer PostsController, UsersController e AuthorsController herdarem dessa base e remover a duplicação de GetAuthorIdFromHeader() / TryGetAuthorId(); obter AuthorId via o método da base. Manter AuthController sem herdar (não usa X-Author-Id).

## 3. API — Data Annotations e ModelState

- [x] 3.1 Adicionar Data Annotations aos DTOs de entrada (LoginRequest, CreateUserRequest, UpdateUserRequest, CreateOrUpdatePostRequest ou equivalentes em AuthDtos, UserDtos, PostDto) onde aplicável: Required, EmailAddress, StringLength, MaxLength.
- [x] 3.2 Em cada action que recebe [FromBody], no início do método verificar `if (!ModelState.IsValid) return BadRequest(ModelState);` e remover ou reduzir validação manual redundante (string.IsNullOrWhiteSpace) quando coberta pelas anotações.

## 4. Frontend — Cliente BFF unificado

- [x] 4.1 Implementar `requestPublic<T>(path, options?)` e `requestWithAuth<T>(path, options?)` em `frontend/src/api/client.ts`: base URL via getBffBaseUrl(), Accept: application/json, requestWithAuth adiciona token e trata 401 (clear + throw), ambas tratam !res.ok (ler corpo, throw Error) e 204/empty como undefined.
- [x] 4.2 Refatorar as funções de domínio (fetchPosts, fetchPostsPage, fetchAllPostsForAuthorArea, createPost, updatePost, deletePost, fetchAuthors, fetchUsers, fetchCurrentUser, createUser, updateUser, deleteUser, resetUserPassword, fetchPostByIdForEdit, fetchNextStoryOrder, updateStoryOrder, addCollaborator, removeCollaborator, uploadCoverImage) para usar requestPublic ou requestWithAuth com path e options; manter fetchPostBySlug e login com lógica específica (null em 404 / null em falha) usando as bases ou wrappers.
- [x] 4.3 Remover duplicação de getBffBaseUrl(), tratamento de 401 e construção de URL nas funções que passarem a usar as bases; remover fetchJson e fetchWithAuth antigos se forem substituídos pelas novas funções base (ou renomear as bases para fetchJson/fetchWithAuth mantendo o comportamento unificado).

## 5. Validação

- [x] 5.1 Executar `openspec validate apply-code-improvements --strict` e corrigir falhas até passar.
