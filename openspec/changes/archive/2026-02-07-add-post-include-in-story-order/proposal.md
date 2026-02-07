# Proposal: Segregar posts fora da ordem da história (Include in story order)

## Summary

Adicionar uma opção por post para **excluir** o artigo da **ordem de leitura da história** (Índice da História). Hoje todos os posts publicados aparecem no Índice da História ordenados por `story_order`. A necessidade é permitir posts que **não fazem parte da cronologia** (ex.: conteúdo extra, one-shots, behind-the-scenes) que continuem publicados e visíveis na página inicial e na lista de artigos, mas **não** apareçam no menu "Índice da História" nem na navegação anterior/próximo da página do post.

Exemplo: Post 1, 2 e 3 fazem parte da história e aparecem na ordem; Post 4 não faz parte da história e não entra na ordem; Post 5 faz parte da história e aparece como número 4 na leitura.

## Goals

- **Segregação**: O autor pode marcar cada post como "faz parte da ordem da história" ou não. Apenas os marcados como parte da história aparecem no Índice da História (`/indice`) e na sequência anterior/próximo na página do artigo.
- **Compatibilidade**: Posts existentes permanecem na ordem (comportamento atual). O valor por defeito para novos posts é "faz parte da história" (checkbox marcado).
- **Consistência**: A API e o BFF filtram por este critério quando `order=story`; o endpoint de próxima ordem sugerida considera apenas posts que fazem parte da história.

## Scope

- **In scope**: (1) **Base de dados**: Nova coluna (ex.: `IncludeInStoryOrder`, boolean, default `true`) no modelo `Post`. (2) **API**: GET /api/posts com `order=story` devolve apenas posts publicados **e** com `IncludeInStoryOrder == true`. GET /api/posts/next-story-order calcula o próximo número como max(story_order) entre posts com `IncludeInStoryOrder == true` + 1. Create/Update post aceitam e persistem o novo campo. DTOs e frontend incluem o campo (ex.: `include_in_story_order`). (3) **Frontend**: No formulário de novo/editar post, checkbox "Faz parte da ordem da história" (ou equivalente), default marcado. (4) **Comportamento**: Página do post: links anterior/próximo usam a lista já filtrada (apenas posts na história); se o post atual não estiver na história, não há anterior/próximo na sequência. (5) **Spec deltas**: story-index (lista do índice só inclui posts na história); post-edit-form (campo para incluir/excluir da ordem).
- **Out of scope**: Alterar a lógica de reordenação no Índice (arrastar/editar número) além de operar apenas sobre os posts já filtrados; migração de dados para alterar posts existentes (mantém-se default true).

## Affected code and docs

- **backend/api/Models/Post.cs**: Nova propriedade `IncludeInStoryOrder` (bool, default true).
- **backend/api**: Nova migração EF Core para a coluna.
- **backend/api/Models/PostDto.cs**: Incluir `include_in_story_order` no PostDto e em CreateOrUpdatePostRequest.
- **backend/api/Controllers/PostsController.cs**: Em GetPosts, quando `order == "story"`, filtrar também por `IncludeInStoryOrder == true`. Em GetNextStoryOrder, calcular max sobre posts com `IncludeInStoryOrder == true`. Em CreatePost/UpdatePost, ler e gravar o novo campo.
- **backend/bff**: Garantir que o BFF repassa o parâmetro e que as respostas incluem o campo (proxy para a API).
- **frontend/src/api/types.ts**: Adicionar `include_in_story_order?: boolean` ao tipo Post (e ao payload de create/update).
- **frontend/src/pages/PostEdit.tsx**: Estado e checkbox "Faz parte da ordem da história"; enviar no create/update.
- **openspec/changes/add-post-include-in-story-order/specs/story-index/spec.md**: MODIFIED — lista do Índice só inclui posts com include_in_story_order; cenário.
- **openspec/changes/add-post-include-in-story-order/specs/post-edit-form/spec.md**: ADDED — requisito e cenário para o campo "incluir na ordem da história".

## Dependencies and risks

- **Migração**: Nova coluna com default true; posts existentes ficam automaticamente "na história". Nenhuma ação manual obrigatória.
- **Risco baixo**: Alteração localizada (modelo, DTOs, um filtro em GET, um cálculo em next-story-order, checkbox no formulário).

## Success criteria

- No formulário de post, o autor pode desmarcar "Faz parte da ordem da história"; o post deixa de aparecer no Índice da História e não tem anterior/próximo na sequência (na página do post).
- Posts marcados como parte da história aparecem em `/indice` na ordem correta; a reordenação (editar ordem) continua a funcionar apenas sobre essa lista.
- GET /api/posts?order=story e next-story-order refletem apenas posts com IncludeInStoryOrder == true.
- Spec deltas e `openspec validate add-post-include-in-story-order --strict` passam.
