# Tasks: apply-security-code-and-image-optimization

## 1. Segurança — CSP e documentação

- [x] 1.1 Adicionar pacote ou usar API nativa para headers; no BFF (Program.cs), após o middleware de security headers existente, adicionar lógica que lê `Security:CspHeader` e, se não vazio, adiciona o header `Content-Security-Policy` (ou `Content-Security-Policy-Report-Only` se `Security:CspReportOnly` for true). Se CspHeader estiver vazio, não enviar header CSP.
- [x] 1.2 Documentar auditoria de dependências: no README ou em docs/security (ex.: secção em SECURITY-ASSESSMENT-FOLLOW-UP ou referência) os comandos `dotnet list package --vulnerable` (backend/api e backend/bff) e `npm audit` (frontend), e referência à revisão de logs (não registar senhas/tokens).

## 2. Segurança — Documento de configuração (docs/deploy)

- [x] 2.1 Criar **docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md** com: (1) passado para CSP (Security:CspHeader, Security:CspReportOnly; exemplos; variáveis de ambiente; testar em Report-Only primeiro); (2) passado para processamento de imagens (Uploads:MaxWidth, Uploads:JpegQuality; comportamento antes/depois); (3) comandos de auditoria de dependências e referência aos documentos de avaliação; (4) nota opcional sobre copiar para docs/local.

## 3. API — Data Annotations e ModelState

- [x] 3.1 Em PostDto.cs: AddCollaboratorRequest — adicionar `[Required]` em AuthorId; StoryOrderItemRequest — adicionar `[Required]` em Id e, se desejado, validação em StoryOrder (ex.: Range). Em UserDtos.cs: CreateUserRequest — adicionar `[Required]` em Password.
- [x] 3.2 Em PostsController: UpdateStoryOrder — no início do action, se request for null ou inválido, verificar ModelState.IsValid e retornar BadRequest(ModelState) quando aplicável; AddCollaborator — verificar ModelState.IsValid antes da lógica e retornar BadRequest(ModelState) quando inválido.

## 4. BFF — Processamento de imagens no upload

- [x] 4.1 Adicionar pacote **SixLabors.ImageSharp** ao projeto backend/bff (BlogBff.csproj).
- [x] 4.2 Em UploadsController: após validação por magic bytes, em vez de copiar o ficheiro diretamente para disco, abrir o stream com ImageSharp, redimensionar (largura máxima a partir de configuração Uploads:MaxWidth, default 1200), codificar com qualidade (Uploads:JpegQuality para JPEG, default 85; equivalente para PNG/WebP). Gravar o ficheiro resultante no mesmo path (GUID + extensão). Manter extensão original (jpg/png/webp). Tratar exceções de ImageSharp (imagem corrompida) e devolver BadRequest se falhar.
- [x] 4.3 Adicionar em appsettings (exemplo) as keys Uploads:MaxWidth e Uploads:JpegQuality; ler em UploadsController via IConfiguration.

## 5. Frontend — Lazy loading de capas

- [x] 5.1 Em PostCard.tsx: adicionar `loading="lazy"` ao `<img>` da capa.
- [x] 5.2 Em Posts.tsx (lista de cards): garantir que as imagens de capa nos cards usam `loading="lazy"` (se o componente de card for reutilizado, pode já estar coberto por 5.1; senão, adicionar no componente usado na lista).
- [x] 5.3 Em StoryIndex.tsx: adicionar `loading="lazy"` aos dois `<img>` de capa (lista arrastável e grelha de cards). Não alterar PostPage.tsx nem FeaturedPost.tsx (manter eager para capa principal e destaque).

## 6. Spec deltas

- [x] 6.1 Em **openspec/changes/apply-security-code-and-image-optimization/specs/security-hardening/spec.md**: ADDED requirement — o BFF MAY enviar o header Content-Security-Policy (ou Report-Only) quando configurado (ex.: Security:CspHeader); quando não configurado, o header não é enviado. Cenário: com Security:CspHeader definido, a resposta inclui o header; com valor vazio, não inclui.
- [x] 6.2 Em **openspec/changes/apply-security-code-and-image-optimization/specs/post-cover-display/spec.md**: ADDED — após validação do upload, o BFF MAY redimensionar e comprimir a imagem antes de gravar (dimensão máxima e qualidade configuráveis); o frontend MAY usar loading="lazy" para imagens de capa em listas e índices (abaixo da dobra), mantendo eager para a capa principal do artigo e destaque na home. Cenários: upload produz ficheiro otimizado; lazy em PostCard/StoryIndex/Posts; eager em PostPage e FeaturedPost.
- [x] 6.3 Em **openspec/changes/apply-security-code-and-image-optimization/specs/project-docs/spec.md**: ADDED — o repositório SHALL conter um documento em docs/deploy que descreva o passado para as configurações de CSP, processamento de imagens no upload e auditoria de dependências (ex.: CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md). Cenário: operador consulta docs/deploy e encontra o guia com as novas chaves e comandos.

## 7. Validação

- [x] 7.1 Executar `openspec validate apply-security-code-and-image-optimization --strict` e corrigir até passar.
