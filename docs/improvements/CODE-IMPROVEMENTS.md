# Avaliação de melhorias para o código

Este documento descreve uma **avaliação** de melhorias para o simple-blog-hub em três eixos: **segurança**, **simplificação de código** e **reaproveitamento de estruturas** (convenções ou “mini-frameworks” internos). **Nenhuma alteração de código é aplicada** nesta proposta; serve como referência para implementação futura em changes OpenSpec incrementais.

---

## 1. Segurança

O projeto dispõe já de uma avaliação de segurança e de um plano priorizado em **[SECURITY-HARDENING.md](../security/SECURITY-HARDENING.md)** e no spec **security-hardening** (openspec). As melhorias de segurança devem seguir esse plano em fases:

- **Fase 1:** Proteção contra XSS (sanitização de HTML no backend e/ou frontend) e estratégia de armazenamento de tokens (sessionStorage vs cookies HttpOnly).
- **Fase 2:** CORS restritivo, headers de segurança HTTP e validação de secrets em produção.
- **Fase 3:** Validação robusta de uploads (magic bytes), validação de input (DTOs, senha, email/slug) e política de senha reforçada.
- **Fase 4:** Rate limiting e logs de auditoria.
- **Fase 5:** Hardening de infra (Docker não-root, Caddyfile versionado, documentação).

**Referência:** Requisitos formais em `openspec/specs/security-hardening/spec.md` (após arquivo da change correspondente). Prioridade: executar as fases na ordem indicada no SECURITY-HARDENING.md.

---

## 2. Simplificação de código

### 2.1 Padrões repetidos identificados

- **API (.NET):** Extração do identificador do autor a partir do header `X-Author-Id` está duplicada em vários controladores:
  - `PostsController`: `GetAuthorIdFromHeader()`, constante `AuthorIdHeader`.
  - `UsersController`: `TryGetAuthorId(out Guid authorId)`, mesma constante.
  - `AuthorsController`: leitura direta do header e validação.
  - **Proposta:** Middleware que valide o header e injete o AuthorId no contexto do request (ex.: `HttpContext.Items` ou serviço de request), ou classe base de controller que exponha `GetAuthorId()` uma única vez.

- **BFF (.NET):** Extração do AuthorId a partir do `ClaimsPrincipal` (JWT) está duplicada em:
  - `BffPostsController`: `GetAuthorId(User)`.
  - `UsersController`: `GetAuthorId(User)`.
  - `AuthorsController`: `GetAuthorId(User)`.
  - **Proposta:** Helper partilhado (ex.: classe estática ou extensão em `ClaimsPrincipal`) num módulo comum (ex.: `BlogBff/Extensions` ou `BlogBff/Helpers`) e uso em todos os controladores que precisem do autor.

- **API – Validação de input:** Os DTOs (`AuthDtos.cs`, `UserDtos.cs`, `PostDto.cs`, etc.) não usam Data Annotations (`[Required]`, `[EmailAddress]`, `[StringLength]`, `[RegularExpression]`). A validação é feita manualmente nos controladores (`string.IsNullOrWhiteSpace`, etc.), o que é inconsistente e propenso a esquecimentos.
  - **Proposta:** Adicionar Data Annotations aos DTOs e usar `ModelState.IsValid` (ou filtro de validação) em todos os endpoints que recebem corpo; padronizar validação de slug e email.

- **Frontend – Cliente BFF:** As funções `fetchJson` e `fetchWithAuth` em `frontend/src/api/client.ts` repetem lógica de base URL, tratamento de 401 (clear auth), e parsing de erros. Outras funções reimplementam parcialmente o mesmo padrão (ex.: `fetchPostBySlug` com branch para token).
  - **Proposta:** Centralizar num único “client” (ex.: funções `requestPublic` e `requestWithAuth`) que recebam path e options e tratem base URL, headers (Accept, Authorization), 401 (clear + throw) e resposta não-ok (mensagem de erro consistente); reduzir duplicação nas funções de domínio (fetchPosts, fetchPostBySlug, etc.).

### 2.2 Ficheiros relevantes (simplificação)

| Área   | Ficheiros |
|--------|-----------|
| API    | `backend/api/Controllers/PostsController.cs`, `UsersController.cs`, `AuthorsController.cs`, `backend/api/Models/AuthDtos.cs`, `UserDtos.cs`, `PostDto.cs` |
| BFF    | `backend/bff/Controllers/BffPostsController.cs`, `UsersController.cs`, `AuthorsController.cs` |
| Frontend | `frontend/src/api/client.ts` |

### 2.3 Prioridade sugerida (simplificação)

1. BFF: extrair `GetAuthorId(ClaimsPrincipal)` para um único helper e usar em todos os controladores (baixo risco, alto ganho de consistência).
2. API: introduzir Data Annotations nos DTOs e validação ModelState nos endpoints (médio esforço, reduz bugs de input).
3. API: middleware ou base controller para X-Author-Id (evita duplicação e erros de parse).
4. Frontend: refatorar cliente BFF para funções base reutilizáveis (melhora manutenção e tratamento de 401/erros).

---

## 3. Reaproveitamento de estruturas (“mini-frameworks”)

As propostas abaixo são convenções ou pequenos conjuntos de componentes reutilizáveis dentro do próprio projeto (sem necessidade de bibliotecas externas pesadas).

### 3.1 Contexto de autor na API

- **Problema:** Vários controladores leem e validam `X-Author-Id`; qualquer alteração (ex.: formato, logging) exige tocar em vários sítios.
- **Proposta:** Um **middleware** (ou **filtro**) que, para rotas que exijam autor: (1) leia o header `X-Author-Id`; (2) valide e parseie para `Guid`; (3) registe no `HttpContext.Items` (ex.: `"AuthorId"`) ou num serviço scoped “IRequestAuthorContext” que os controladores injetam. Rotas públicas (ex.: GET /api/posts sem editable) não precisam do middleware. Assim, os controladores deixam de duplicar `GetAuthorIdFromHeader()` e usam o contexto injetado.

### 3.2 Contexto de autor no BFF

- **Problema:** Vários controladores extraem AuthorId do JWT (`User` ClaimsPrincipal) com o mesmo código.
- **Proposta:** Um **helper estático** ou **método de extensão** `GetAuthorId(this ClaimsPrincipal user)` num módulo partilhado (ex.: `AuthorClaimsExtensions.cs`), usado por todos os controladores. Opcionalmente, um **filtro** que execute antes dos actions que precisam de autor e que defina o AuthorId em `HttpContext.Items` ou num serviço, para evitar chamar o helper em cada action.

### 3.3 Cliente HTTP do frontend (convenção)

- **Problema:** Múltiplas funções em `client.ts` constroem URL, token e tratam 401/erro de forma parecida mas não idêntica.
- **Proposta:** Definir duas funções base (ex.: `requestPublic<T>(path, options?)` e `requestWithAuth<T>(path, options?)`) que: (1) usem `getBffBaseUrl()` e montem a URL; (2) para auth, adicionem `Authorization: Bearer <token>` e, em 401, chamem `authStorage.clear()` e lancem; (3) em !res.ok, leiam corpo e lancem `Error` com mensagem consistente; (4) tratem 204 ou content-length 0 como `undefined`. As funções de domínio (`fetchPosts`, `fetchPostBySlug`, `login`, etc.) passam a chamar apenas essas bases com path e método, reduzindo duplicação e garantindo comportamento único para 401 e erros.

### 3.4 Pipeline de validação na API

- **Problema:** Validação manual e inconsistente nos controladores.
- **Proposta:** Adotar **Data Annotations** em todos os DTOs de entrada e verificar `ModelState.IsValid` no início de cada action que recebe body; em caso de inválido, retornar `BadRequest(ModelState)`. Para regras mais complexas (ex.: slug único, senha forte), considerar **FluentValidation** como passo seguinte, mantendo uma única “porta de entrada” para validação (ex.: filtro ou comportamento que rejeite antes de executar a action). Assim, o projeto ganha um “framework” de validação consistente sem duplicar `if (string.IsNullOrWhiteSpace(...))` em vários sítios.

### 3.5 Ficheiros relevantes (reaproveitamento)

| Área     | Onde implementar |
|----------|-------------------|
| API      | Novo middleware em `backend/api/` ou filtro; `Program.cs` para registar; opcional `IRequestAuthorContext` em Services. |
| BFF      | Novo ficheiro `Extensions/AuthorClaimsExtensions.cs` (ou Helpers); opcional filtro. |
| Frontend | Refatorar `frontend/src/api/client.ts` com `requestPublic` / `requestWithAuth`. |
| API      | `backend/api/Models/*.cs` (Data Annotations); opcional FluentValidation em Services. |

---

## 4. Prioridade geral sugerida

1. **Segurança:** Seguir o plano em [SECURITY-HARDENING.md](../security/SECURITY-HARDENING.md) (Fases 1–5), em especial sanitização XSS, CORS e headers, e validação de secrets em produção.
2. **Simplificação:** Helper GetAuthorId no BFF; Data Annotations e ModelState na API; depois middleware/base para X-Author-Id na API; por fim refatorar cliente frontend.
3. **Reaproveitamento:** Implementar em paralelo ou logo após a simplificação correspondente (contexto de autor na API/BFF, cliente frontend unificado, pipeline de validação na API).

As alterações devem ser feitas em **changes OpenSpec** separadas e pequenas, para facilitar revisão e rollback. Este documento e o spec **code-improvements** servem como contrato para essas implementações futuras.
