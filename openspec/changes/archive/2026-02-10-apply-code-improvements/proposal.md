# Aplicar melhorias de código (simplificação e reaproveitamento)

## Why

A change **add-code-improvements-evaluation** e o documento [CODE-IMPROVEMENTS.md](../../../docs/improvements/CODE-IMPROVEMENTS.md) identificaram melhorias em três eixos: **segurança** (já coberta pela change apply-security-hardening), **simplificação de código** (redução de duplicação de extração de AuthorId, validação consistente na API, tratamento de erros no frontend) e **reaproveitamento de estruturas** (contexto de autor na API e no BFF, cliente HTTP do frontend unificado, pipeline de validação na API). Esta change **implementa** as melhorias de simplificação e reaproveitamento na aplicação, alinhada ao spec **code-improvements**. As melhorias de segurança continuam a ser implementadas pela change **apply-security-hardening**.

## What Changes

1. **BFF — Helper partilhado para AuthorId:** Extrair a lógica `GetAuthorId(ClaimsPrincipal)` para um único módulo reutilizável (ex.: método de extensão em `Extensions/AuthorClaimsExtensions.cs` ou classe estática em `Helpers/`). Os controladores BffPostsController, UsersController e AuthorsController passam a usar esse helper em vez de cada um definir o seu próprio `GetAuthorId(User)`. O claim usado (ex.: `"author_id"` ou nome configurável) fica num único sítio.

2. **API — Contexto de autor (X-Author-Id):** Centralizar a leitura e validação do header `X-Author-Id` para que os controladores não dupliquem `GetAuthorIdFromHeader()` / `TryGetAuthorId()`. Opções: (a) **middleware** que leia o header, valide como Guid e registe em `HttpContext.Items["AuthorId"]` (ou chave equivalente) para rotas que exijam autor; (b) ou **classe base** de controller com método protegido `GetAuthorId()` que leia do header (mantendo um único lugar para a constante e o parse). Os controladores PostsController, UsersController e AuthorsController passam a obter o AuthorId via esse mecanismo (HttpContext.Items ou base controller).

3. **API — Data Annotations e ModelState:** Adicionar Data Annotations (`[Required]`, `[EmailAddress]`, `[StringLength]`, `[MaxLength]`, etc.) aos DTOs de entrada (AuthDtos, UserDtos, PostDto/CreateOrUpdatePostRequest, etc.). Em cada action que recebe body, verificar `ModelState.IsValid` no início e retornar `BadRequest(ModelState)` quando inválido. Reduzir validação manual redundante (`string.IsNullOrWhiteSpace` dispersa). (Se a change apply-security-hardening já tiver implementado isto, esta tarefa pode ser omitida ou apenas alinhar nomes; caso contrário, implementar aqui.)

4. **Frontend — Cliente BFF unificado:** Refatorar `frontend/src/api/client.ts` para expor duas funções base: **requestPublic** e **requestWithAuth**. Ambas devem: usar `getBffBaseUrl()` e montar a URL completa; definir `Accept: application/json`; em caso de `!res.ok`, ler o corpo e lançar `Error` com mensagem consistente. **requestWithAuth** deve ainda: obter o token (authStorage.getToken()), adicionar `Authorization: Bearer <token>`; em 401, chamar `authStorage.clear()` e lançar; tratar 204 ou content-length 0 como ausência de corpo. As funções de domínio (fetchPosts, fetchPostsPage, fetchPostBySlug, fetchAllPostsForAuthorArea, createPost, updatePost, etc.) passam a chamar apenas essas bases com path, method e body quando aplicável, eliminando duplicação de base URL, token e tratamento de 401/erro. Casos especiais (ex.: login que retorna null em falha, fetchPostBySlug que retorna null em 404) podem usar requestPublic/requestWithAuth com opções ou wrappers finos.

## Goals

- BFF: um único helper (extensão ou estático) para obter AuthorId do ClaimsPrincipal; todos os controladores que precisam do autor usam-no.
- API: um único mecanismo (middleware que popula HttpContext.Items ou base controller) para obter AuthorId do header X-Author-Id; controladores não duplicam parse nem constante.
- API: DTOs com Data Annotations e validação ModelState.IsValid nos endpoints que recebem body.
- Frontend: requestPublic e requestWithAuth como únicas funções que constroem URL, token e tratam 401/erro; funções de domínio delegam nessas bases.
- `openspec validate apply-code-improvements --strict` passa.

## Out of scope

- Implementar melhorias de segurança (sanitização, CORS, headers, uploads, rate limiting, etc.); essas pertencem a apply-security-hardening.
- Introduzir FluentValidation ou filtros globais de validação na API (pode ser change futura); nesta change basta Data Annotations + ModelState no início de cada action.
- Alterar a estrutura de claims do JWT (apenas extrair o AuthorId para um helper reutilizável).

## Success criteria

- BffPostsController, UsersController e AuthorsController (BFF) usam um helper partilhado para GetAuthorId(ClaimsPrincipal).
- PostsController, UsersController e AuthorsController (API) obtêm AuthorId via HttpContext.Items (middleware) ou base controller, sem duplicar código de header.
- DTOs da API têm Data Annotations; actions com body verificam ModelState.IsValid e retornam BadRequest quando inválido.
- client.ts expõe requestPublic e requestWithAuth; fetchPosts, fetchWithAuth-based calls e demais funções de domínio utilizam-nas.
- Validação OpenSpec em modo strict passa.
