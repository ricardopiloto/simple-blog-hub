# Tasks: add-security-code-and-image-optimization-assessments

## 1. Documento de segurança (follow-up)

- [x] 1.1 Criar **docs/security/SECURITY-ASSESSMENT-FOLLOW-UP.md** com: (1) resumo do que já está coberto pelo SECURITY-HARDENING e SECURITY-REMEDIATION e pelas changes aplicadas (sanitização, CORS, headers, secrets, uploads com magic bytes, rate limiting, auditoria, Docker não-root); (2) recomendações adicionais (ex.: Content-Security-Policy, auditoria de dependências NuGet/npm, revisão de logs, cookies seguros se aplicável); (3) priorização das recomendações (impacto vs. esforço). O documento não implementa alterações; serve de referência para changes futuras.

## 2. Documento de otimização de código

- [x] 2.1 Criar **docs/improvements/CODE-OPTIMIZATION-RECOMMENDATIONS.md** com: (1) estado atual (BFF já tem GetAuthorId partilhado; API já tem AuthorizedApiControllerBase com GetAuthorIdFromHeader); (2) itens pendentes do CODE-IMPROVEMENTS (refatoração do frontend client.ts com requestPublic/requestWithAuth; Data Annotations completos e ModelState na API); (3) recomendações para novas estruturas ou classes que simplifiquem e evitem duplicação; (4) priorização. O documento pode referenciar CODE-IMPROVEMENTS.md e o spec code-improvements.

## 3. Documento de otimização de imagens

- [x] 3.1 Criar **docs/improvements/IMAGE-OPTIMIZATION.md** com: (1) estado atual (upload sem compressão/redimensionamento; frontend usa img src único, sem lazy loading nem srcset); (2) objetivo (menor quantidade de dados ao utilizador, melhor tempo de carregamento); (3) recomendações: compressão e/ou redimensionamento no upload (ex.: dimensão máxima, qualidade); lazy loading no frontend para capas abaixo da dobra; opcionalmente múltiplas resoluções ou formato WebP; (4) priorização e dependências (ex.: biblioteca de imagem no BFF). O documento não implementa alterações; serve de referência para uma change futura de implementação.

## 4. Spec delta project-docs

- [x] 4.1 Em `openspec/changes/add-security-code-and-image-optimization-assessments/specs/project-docs/spec.md`, adicionar requisito ADDED: o repositório SHALL conter (ou referenciar) documentos de **avaliação e recomendações** para: (a) segurança (follow-up após hardening), (b) otimização de código (simplificação e reaproveitamento), (c) otimização de imagens (compactação no envio e no carregamento para o utilizador). Cada documento SHALL descrever o estado atual e recomendações acionáveis priorizadas. Cenário: quando um desenvolvedor ou operador consulta docs/security ou docs/improvements, encontra os documentos e pode usar as recomendações para planejar implementações.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-security-code-and-image-optimization-assessments --strict` e corrigir até passar.
