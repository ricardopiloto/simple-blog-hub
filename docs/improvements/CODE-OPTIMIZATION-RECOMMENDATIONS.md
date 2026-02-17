# Recomendações de otimização de código

Este documento descreve uma **análise atualizada** de otimização de código (reaproveitamento, simplificação, estruturas partilhadas), complementar a [CODE-IMPROVEMENTS.md](CODE-IMPROVEMENTS.md) e ao spec **code-improvements**. **Nenhuma alteração de código é aplicada** neste documento; serve como referência para implementação futura em changes OpenSpec.

---

## 1. Estado atual

| Área | Implementado | Ficheiros |
|------|--------------|-----------|
| BFF – AuthorId partilhado | Helper `User.GetAuthorId()` (ClaimsPrincipal) em Extensions | `backend/bff/Extensions/AuthorClaimsExtensions.cs` |
| API – AuthorId partilhado | Base controller com `GetAuthorIdFromHeader()` | `backend/api/Controllers/AuthorizedApiControllerBase.cs` |
| API – Uso da base | PostsController, UsersController, DashboardController herdam ou usam o header; AuthorsController usa verificação direta | Vários controllers |
| Validação de uploads | Magic bytes no BFF | UploadsController |
| Rate limiting | Políticas Login e Uploads | Program.cs |

---

## 2. Itens pendentes (CODE-IMPROVEMENTS e spec)

- **Frontend – Cliente BFF unificado:** O spec code-improvements exige funções base `requestPublic` e `requestWithAuth` em `frontend/src/api/client.ts` que centralizem base URL, token, tratamento de 401 (clear auth + throw) e tratamento de respostas não-ok. As funções de domínio (fetchPosts, fetchPostBySlug, createPost, etc.) devem usar essas bases para evitar duplicação. **Estado:** Parcialmente feito (ex.: requestPublic/requestWithAuth podem já existir); verificar se todas as chamadas autenticadas passam por requestWithAuth e se a lógica de 401/erro é única.
- **API – Data Annotations e ModelState:** Os DTOs devem ter anotações (Required, EmailAddress, StringLength, RegularExpression para slug) e os endpoints que recebem body devem verificar ModelState.IsValid e retornar BadRequest(ModelState). **Estado:** Verificar cobertura em AuthDtos, UserDtos, PostDto e em todos os actions que recebem [FromBody].
- **API – Herança consistente:** Garantir que todos os controladores que precisam de X-Author-Id herdam de AuthorizedApiControllerBase (ou usam um único mecanismo) e não duplicam a constante ou o parse do header.

---

## 3. Novas recomendações (simplificação e estruturas)

- **Testes e dados de teste:** Se houver crescimento de testes no frontend ou na API, considerar factories ou builders para criar entidades (Post, User, Author) com valores por defeito, reduzindo duplicação nos testes.
- **Constantes partilhadas:** Agrupar constantes (ex.: nomes de headers, limites de tamanho, mensagens de erro comuns) em ficheiros ou classes partilhadas entre BFF e API quando fizer sentido (ex.: via projeto partilhado ou convenção de nomes).
- **Frontend – Hooks de API:** Consolidar chamadas ao BFF em hooks (ex.: usePosts já existe; useAuth, useEditablePosts) para que componentes não chamem client.ts diretamente com lógica repetida; os hooks podem encapsular requestWithAuth e tratamento de loading/erro.

---

## 4. Priorização

| Recomendação | Benefício | Esforço | Ordem |
|--------------|-----------|---------|-------|
| Completar requestPublic/requestWithAuth e uso em todas as chamadas | Consistência 401/erro, menos duplicação | Baixo a médio | 1 |
| Data Annotations + ModelState em todos os DTOs/endpoints da API | Validação consistente, menos bugs de input | Médio | 2 |
| Verificar herança AuthorizedApiControllerBase em todos os controllers que precisam de autor | Único ponto de verdade para X-Author-Id | Baixo | 3 |
| Hooks de API no frontend | Componentes mais simples, lógica centralizada | Médio | 4 |
| Factories/builders para testes | Testes mais legíveis e fáceis de manter | Baixo (incremental) | 5 |

---

Para o plano original de simplificação e reaproveitamento, ver [CODE-IMPROVEMENTS.md](CODE-IMPROVEMENTS.md). Requisitos formais: spec **code-improvements** em `openspec/specs/code-improvements/spec.md`.
