# Tasks: Novo post com ordem sugerida a partir do último publicado

## 1. API

- [x] 1.1 Adicionar endpoint **GET /api/posts/next-story-order** no `PostsController`: requer `X-Author-Id` (autenticado). Calcular `next = (max StoryOrder entre posts com Published == true) + 1`; se não houver posts publicados, `next = 1`. Retornar JSON com uma propriedade (ex.: `next_story_order`) com esse valor.
- [x] 1.2 Garantir que o endpoint não exige permissão além de utilizador autenticado (qualquer autor pode criar post e precisa saber a próxima ordem sugerida).

## 2. BFF

- [x] 2.1 No `ApiClient`, adicionar método que chama **GET api/posts/next-story-order** com `X-Author-Id`. No `BffPostsController`, adicionar **GET /bff/posts/next-story-order** (protegido com `[Authorize]`) que invoca o método e devolve o conteúdo da resposta da API.

## 3. Frontend

- [x] 3.1 Em `src/api/client.ts`, adicionar função `fetchNextStoryOrder()` que chama GET `/bff/posts/next-story-order` com token e retorna o número (next_story_order). Em `src/api/types.ts`, adicionar tipo de resposta se necessário (ex.: `{ next_story_order: number }`).
- [x] 3.2 Em `PostEdit.tsx`, quando `isNew`: usar `useQuery` (ex.: queryKey `['posts', 'next-story-order']`, queryFn `fetchNextStoryOrder`, enabled: `isNew`) e, quando os dados estiverem disponíveis, definir o estado do campo "Ordem" (`setStoryOrder`) com o valor retornado. Manter valor por defeito 1 até a resposta chegar ou em caso de erro. O campo "Ordem" continua editável pelo utilizador.

## 4. Validação

- [x] 4.1 Build da API, BFF e frontend. Validar manualmente: com zero posts publicados, abrir "Novo post" e confirmar que a Ordem é 1; publicar um post com ordem 1, depois abrir "Novo post" e confirmar que a Ordem sugerida é 2; alterar o valor no formulário e guardar, confirmando que o valor escolhido é persistido.
