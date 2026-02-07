# Design: Include in story order (segregar posts fora da cronologia)

## Contexto

O Índice da História (`/indice`) mostra hoje **todos** os posts publicados, ordenados por `story_order`. A navegação "anterior / próximo" na página do artigo usa essa mesma lista. Alguns artigos (extras, one-shots, behind-the-scenes) não fazem parte da cronologia da história e não devem aparecer nessa ordem de leitura.

## Decisão: flag por post

Introduzir um campo booleano por post, por exemplo **IncludeInStoryOrder** (na API; no frontend/JSON: `include_in_story_order`):

- **true**: o post faz parte da ordem da história → aparece no Índice da História e na sequência anterior/próximo.
- **false**: o post não faz parte da ordem → continua publicado (visível na página inicial e na lista de artigos), mas **não** aparece no Índice da História nem nos links anterior/próximo.

**Default**: `true`, para manter o comportamento atual para todos os posts existentes e para novos posts até o autor desmarcar.

## Comportamento por componente

1. **GET /api/posts?published=true&order=story**  
   Filtrar também por `IncludeInStoryOrder == true`. Assim, a lista usada no Índice e para anterior/próximo contém apenas os posts "na história".

2. **GET /api/posts/next-story-order**  
   Calcular o próximo número como `max(StoryOrder)` entre posts com `IncludeInStoryOrder == true` + 1 (considerando todos os posts, publicados e rascunho, para alinhar com a lógica de "próxima posição disponível" na história). Assim, a sugestão de ordem continua a ser a próxima posição na cronologia.

3. **PUT /api/posts/story-order**  
   Sem alteração de contrato: o frontend envia apenas os posts que estão no Índice (já filtrados), portanto apenas posts com `IncludeInStoryOrder == true`. A API continua a atualizar `StoryOrder` pelos ids recebidos.

4. **Página do post (anterior/próximo)**  
   O frontend usa `usePostsByStoryOrder()` (GET posts com order=story), que passará a devolver só posts "na história". Se o post atual não estiver na história, `currentIndex` será -1 e não haverá anterior/próximo — comportamento esperado.

5. **Formulário de post**  
   Checkbox "Faz parte da ordem da história", default marcado. No create/update, enviar e persistir `include_in_story_order`.

## Modelo de dados

- **Post**: `IncludeInStoryOrder` (bool, default true). Migração EF Core adiciona a coluna com default true.
- **DTOs**: incluir o campo em PostDto (leitura) e em CreateOrUpdatePostRequest (escrita). Em JSON: `include_in_story_order`.

Nenhuma alteração à estrutura de colaboradores, publicação ou slugs.
