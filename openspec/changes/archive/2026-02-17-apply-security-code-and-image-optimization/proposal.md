# Proposal: Implementar recomendações das avaliações (segurança, código, imagens)

## Summary

Este change **implementa** as alterações de configuração e código recomendadas nos três documentos de avaliação produzidos pela change **add-security-code-and-image-optimization-assessments**: (1) **Segurança** — Content-Security-Policy configurável no BFF, documentação de auditoria de dependências e de revisão de logs; (2) **Otimização de código** — completar Data Annotations e ModelState na API onde faltam (AddCollaboratorRequest, StoryOrderItemRequest, CreateUserRequest.Password; ModelState em UpdateStoryOrder e AddCollaborator); (3) **Otimização de imagens** — compressão e redimensionamento no upload no BFF (ImageSharp, dimensão máxima e qualidade configuráveis) e lazy loading de capas abaixo da dobra no frontend. Inclui um **documento de configuração e passado** (em docs/deploy, versionado) que descreve as novas opções (CSP, parâmetros de processamento de imagens, comandos de auditoria de dependências).

## Why

- **Avaliações já existem:** Os documentos SECURITY-ASSESSMENT-FOLLOW-UP.md, CODE-OPTIMIZATION-RECOMMENDATIONS.md e IMAGE-OPTIMIZATION.md listam recomendações acionáveis; este change concretiza-as em código e configuração.
- **Segurança:** CSP reduz superfície de XSS; documentar auditoria de dependências e logs permite que operadores e desenvolvedores apliquem as práticas de forma repetível.
- **Código:** Validação consistente na API (ModelState e anotações em todos os DTOs de entrada) reduz bugs e alinha ao spec code-improvements.
- **Imagens:** Redimensionar e comprimir no upload reduz dados transferidos ao utilizador e melhora tempo de carregamento; lazy loading reduz carga inicial em listas e índices.

## What Changes

- **BFF:** (1) Header Content-Security-Policy (ou Report-Only) configurável via `Security:CspHeader` / `Security:CspReportOnly`; se vazio, o header não é enviado. (2) Upload de capa: após validação por magic bytes, redimensionar (largura máxima configurável, ex.: 1200 px) e comprimir (qualidade JPEG/configurável); gravar apenas a versão otimizada. Dependência **SixLabors.ImageSharp** no BFF. Configuração: `Uploads:MaxWidth`, `Uploads:JpegQuality` (e equivalente para PNG/WebP se aplicável).
- **API:** Data Annotations em AddCollaboratorRequest (AuthorId Required), StoryOrderItemRequest (Id Required, StoryOrder válido); CreateUserRequest.Password com [Required]; endpoints UpdateStoryOrder e AddCollaborator passam a verificar ModelState.IsValid e retornar BadRequest(ModelState) quando inválido.
- **Frontend:** Adicionar `loading="lazy"` nas imagens de capa em PostCard, lista de posts (Posts), StoryIndex (cards); manter eager na capa principal da página do artigo (PostPage) e no destaque da home (FeaturedPost).
- **Documentação:** (1) README ou secção em docs: comandos para auditoria de dependências (`dotnet list package --vulnerable`, `npm audit`) e referência à revisão de logs (não registar senhas/tokens). (2) **docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md** (ou equivalente em docs/local para cópia local) — passado para as novas configurações: descrição de Security:CspHeader, Security:CspReportOnly, Uploads:MaxWidth, Uploads:JpegQuality; como ativar CSP em report-only primeiro; comandos de auditoria; referência aos documentos de avaliação.

## Goals

- CSP aplicável em produção de forma configurável, sem quebrar a aplicação; operadores podem começar em Report-Only.
- Todas as imagens de capa enviadas pelo autor são otimizadas no servidor; o utilizador final recebe ficheiros menores.
- Capas em listas e índices usam lazy loading; capa principal do artigo e destaque da home mantêm carregamento imediato.
- API valida de forma consistente todos os DTOs de entrada com ModelState e Data Annotations.
- Operadores e desenvolvedores dispõem de um documento em docs/deploy que explica as novas opções de configuração e como migrar (podem copiar para docs/local para personalizar).

## Scope

- **In scope:** CSP configurável no BFF; ImageSharp no BFF para resize/compressão no upload; configuração Uploads:MaxWidth e Uploads:JpegQuality; lazy loading nos componentes indicados; Data Annotations e ModelState nos DTOs/endpoints indicados; documento docs/local; referência a auditoria de dependências e revisão de logs na documentação.
- **Out of scope:** Implementar múltiplas resoluções (thumbnail/medium/full) ou srcset nesta change; WebP obrigatório para entrega; limite global de request body na API; alteração do Caddyfile (CSP pode ficar no BFF); CI automático para npm audit/dotnet vulnerable (apenas documentar comandos).

## Affected code and docs

- **backend/bff:** Program.cs (middleware CSP), UploadsController.cs (processamento com ImageSharp), novo pacote SixLabors.ImageSharp; appsettings (exemplo de keys).
- **backend/api:** PostDto.cs (AddCollaboratorRequest, StoryOrderItemRequest com anotações), UserDtos.cs (CreateUserRequest.Password [Required]), PostsController.cs (ModelState em UpdateStoryOrder e AddCollaborator), UsersController (já tem ModelState em Create/Update).
- **frontend:** PostCard.tsx, Posts.tsx (lista), StoryIndex.tsx (dois locais de img de capa) — adicionar loading="lazy"; PostPage.tsx e FeaturedPost.tsx — manter sem lazy (ou documentar que são above the fold).
- **docs:** docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md (novo, versionado) com passado para CSP, imagens e auditoria; README ou docs/security — secção curta sobre auditoria de dependências e revisão de logs.
- **openspec:** specs/security-hardening (delta CSP), specs/post-cover-display (delta upload otimizado e lazy loading), specs/project-docs (delta documento docs/deploy).

## Success criteria

- Com Security:CspHeader configurado, as respostas do BFF incluem o header CSP; com valor vazio, não incluem.
- Upload de capa produz ficheiro redimensionado (até MaxWidth) e comprimido (JpegQuality); imagens já pequenas não são ampliadas.
- PostCard, lista em Posts e cards em StoryIndex usam loading="lazy"; PostPage e FeaturedPost não.
- AddCollaborator e UpdateStoryOrder validam ModelState; DTOs têm anotações; CreateUserRequest exige Password.
- docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md existe e descreve as novas configurações e o passado para elas (operadores podem copiar trechos para docs/local se quiserem guias locais).
- `openspec validate apply-security-code-and-image-optimization --strict` passa.
