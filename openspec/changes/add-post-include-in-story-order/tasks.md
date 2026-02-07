# Tasks: add-post-include-in-story-order

## 1. Modelo e migração (API)

- [x] 1.1 No modelo `Post` em `backend/api/Models/Post.cs`, adicionar a propriedade `IncludeInStoryOrder` (bool, default `true`).
- [x] 1.2 Gerar migração EF Core para a nova coluna (default true) e aplicá-la localmente para validar.

## 2. DTOs e mapeamento (API)

- [x] 2.1 Em `PostDto` e em `CreateOrUpdatePostRequest` (backend/api/Models/PostDto.cs), adicionar a propriedade com nome JSON `include_in_story_order` (bool; em CreateOrUpdatePostRequest default true ou opcional tratado como true).
- [x] 2.2 No método que mapeia `Post` para `PostDto` (e no Create/Update que leem o request), preencher e persistir `IncludeInStoryOrder`.

## 3. Filtros e next-story-order (API)

- [x] 3.1 Em `GetPosts`, quando `order == "story"`, além de `Published == true`, filtrar por `IncludeInStoryOrder == true`.
- [x] 3.2 Em `GetNextStoryOrder`, calcular `max(StoryOrder)` apenas sobre posts com `IncludeInStoryOrder == true` (publicados e rascunho, para consistência com “próxima posição na história”).

## 4. BFF

- [x] 4.1 Confirmar que o BFF repassa o campo nas respostas da API (proxy) e que create/update de post enviam o campo à API; ajustar se o BFF transformar payloads.

## 5. Frontend: tipos e formulário

- [x] 5.1 Em `frontend/src/api/types.ts`, adicionar `include_in_story_order?: boolean` ao tipo `Post` e ao payload de criação/atualização usado no cliente.
- [x] 5.2 Em `PostEdit.tsx`, adicionar estado para o checkbox "Faz parte da ordem da história" (default true), exibir o checkbox no formulário e enviar o valor em create/update; ao carregar post para edição, inicializar o estado a partir de `post.include_in_story_order`.

## 6. Spec deltas

- [x] 6.1 O delta em `openspec/changes/add-post-include-in-story-order/specs/story-index/spec.md` está preenchido: requisito MODIFIED (lista do Índice apenas posts com include_in_story_order) e cenários. Revisar se necessário.
- [x] 6.2 O delta em `openspec/changes/add-post-include-in-story-order/specs/post-edit-form/spec.md` está preenchido: requisito ADDED (checkbox e comportamento). Revisar se necessário.

## 7. Validação

- [x] 7.1 Executar `openspec validate add-post-include-in-story-order --strict` e corrigir qualquer falha.
