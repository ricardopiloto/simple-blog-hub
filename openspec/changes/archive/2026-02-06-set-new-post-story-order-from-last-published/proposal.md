# Change: Novo post com ordem sugerida a partir do último artigo publicado

## Why

No fluxo de criação de um novo artigo ("Novo post"), o campo **Ordem** (story_order) vem atualmente fixo em **1**. Isso obriga o autor a alterar manualmente a ordem se quiser que o novo post apareça depois do último na narrativa. O comportamento desejado é: ao abrir o formulário de novo post, o sistema **busca no banco qual o último artigo publicado** (maior `story_order` entre posts publicados) e **sugere a próxima ordem** (último + 1), deixando o valor editável pelo utilizador.

## What Changes

- **API**: Novo endpoint **GET /api/posts/next-story-order** (autenticado via `X-Author-Id`). Retorna um valor único: o próximo `story_order` sugerido, ou seja, `max(StoryOrder)` entre posts com `Published == true` + 1, ou **1** se não existir nenhum post publicado. Formato de resposta simples (ex.: `{ "next_story_order": number }`).
- **BFF**: Novo endpoint **GET /bff/posts/next-story-order** (protegido com JWT) que repassa o pedido à API e devolve o JSON.
- **Frontend**: No formulário de **Novo post** (`PostEdit` quando `isNew`), ao montar a página, obter o próximo `story_order` via o novo endpoint e usar esse valor como estado inicial do campo "Ordem". O campo continua editável; se o pedido falhar ou ainda não tiver carregado, manter o valor por defeito 1.
- **Spec**: Capability **post-edit-form**: ADDED requirement que o novo post tenha a ordem inicial sugerida com base no último artigo publicado (próxima posição), editável pelo utilizador.

## Impact

- Affected specs: **post-edit-form** (ADDED requirement).
- Affected code: `backend/api/Controllers/PostsController.cs` (novo action NextStoryOrder); `backend/bff` (novo endpoint GET next-story-order no ApiClient e BffPostsController); `src/api/client.ts` (função fetchNextStoryOrder); `src/api/types.ts` (tipo de resposta se necessário); `src/pages/PostEdit.tsx` (query para next-story-order quando isNew e atualização do estado storyOrder).
