# Design: Avaliações de segurança, código e imagens

## Escopo das avaliações

As três avaliações são **documentos de análise e recomendações**. Não incluem implementação; servem de entrada para changes futuras.

### 1. Segurança (follow-up)

- **Base:** SECURITY-HARDENING.md e SECURITY-REMEDIATION.md já cobrem fases 1–5 (XSS, CORS, headers, secrets, uploads, rate limiting, auditoria, Docker não-root). A apply-security-hardening e run-backend-containers-non-root já implementaram grande parte.
- **Follow-up:** Identificar o que ainda não está coberto ou pode ser reforçado: por exemplo Content-Security-Policy (CSP), auditoria periódica de dependências (NuGet/npm), revisão de logs para evitar vazamento de dados sensíveis, flags de cookies se no futuro se usar cookie para JWT, proteção contra CSRF se aplicável. Priorizar por impacto e esforço.

### 2. Otimização de código

- **Base:** CODE-IMPROVEMENTS.md e spec code-improvements. Já implementado: BFF `User.GetAuthorId()` (Extensions), API `AuthorizedApiControllerBase` com `GetAuthorIdFromHeader()`.
- **Pendente/novo:** (1) Frontend: refatorar `client.ts` para funções base `requestPublic` e `requestWithAuth` e reduzir duplicação. (2) API: garantir Data Annotations em todos os DTOs e ModelState em todos os endpoints que recebem body. (3) Novas estruturas que simplifiquem testes ou manutenção (ex.: factories, builders). O documento deve listar estado atual e recomendações priorizadas.

### 3. Otimização de imagens

- **Estado atual:** Upload em `UploadsController` grava o ficheiro tal como recebido (até 5 MB); magic bytes validados; sem redimensionamento nem compressão. Frontend usa `<img src={cover_image}>` sem `loading="lazy"`, sem `srcset`/`sizes`, sem múltiplas resoluções. Todas as páginas (lista, post, índice) pedem a mesma URL; em mobile pode estar a transferir imagens maiores que o necessário.
- **Objetivo:** Carregar a **menor quantidade possível de dados** para o utilizador final e melhorar tempo de leitura/carregamento.
- **Opções de desenho:**
  - **Compressão no upload:** No BFF (ou API), após validar o ficheiro, redimensionar e/ou comprimir (ex.: ImageSharp em .NET) antes de gravar. Guardar uma única versão “otimizada” (ex.: max 1200px de largura, qualidade JPEG 85%) ou múltiplas versões (thumbnail, medium, full).
  - **Compressão on-the-fly:** Servir imagens através de um endpoint que redimensiona/comprime sob pedido (ex.: query ?w=800). Requer mais infra (cache, processamento por pedido).
  - **Frontend:** Lazy loading (`loading="lazy"`) para imagens abaixo da dobra; `srcset` e `sizes` se o servidor passar a expor várias resoluções; preferência por WebP com fallback para JPEG/PNG quando o servidor suportar.
- **Recomendação no documento:** Priorizar (1) compressão/redimensionamento no upload (uma versão otimizada por capa) para reduzir tamanho armazenado e servido; (2) lazy loading no frontend; (3) opcionalmente múltiplas resoluções (thumbnail para listas) em fase posterior. Evitar enviar ficheiros de vários MB quando o contexto de exibição é um card pequeno.
