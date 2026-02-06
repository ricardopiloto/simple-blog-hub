# Change: Ordenar página inicial por data/hora de criação

## Why

Na página inicial, o **Destaque** e os **Artigos recentes** devem refletir a ordem em que os posts foram criados: o Destaque deve ser sempre o **último post feito** (mais recente por data/hora de criação) e a secção "Artigos recentes" deve seguir a mesma ordem decrescente por data de criação. Atualmente a API ordena a lista pública com `order=date` por `PublishedAt ?? CreatedAt` (data de publicação ou, se nula, data de criação), o que pode fazer com que o Destaque não seja o post mais recentemente criado quando há republicações ou datas de publicação diferentes.

## What Changes

- **API**: No `PostsController`, quando o pedido de lista pública de posts usa `order=date` (ou equivalente), a ordenação **deve** ser por **data/hora de criação** (`CreatedAt`) em ordem **decrescente**, em vez de `PublishedAt ?? CreatedAt`. Assim, o primeiro elemento da lista é sempre o post criado mais recentemente (entre os publicados).
- **BFF**: Sem alteração; continua a repassar `order=date` à API.
- **Frontend**: Sem alteração; a página inicial (`Index.tsx`) já usa `usePublishedPosts()` (GET /bff/posts?order=date), toma o primeiro post como Destaque e `slice(1, 7)` como Artigos recentes. Com a API a devolver por `CreatedAt` desc, o Destaque passa a ser o último post criado e os recentes respeitam essa ordem.
- **Documentação**: Atualizar `openspec/project.md` na secção "Páginas" para indicar que o Início ordena por data/hora de **criação** (Destaque = último post criado; Artigos recentes = mesma ordem decrescente).
- **Spec**: Nova capability **home-page**: ADDED requirement que a página inicial exiba destaque e artigos recentes ordenados por data/hora de criação (decrescente), com o Destaque sempre igual ao último post criado.

## Impact

- Affected specs: **home-page** (nova capability com um ADDED requirement).
- Affected code: `backend/api/Controllers/PostsController.cs` (alterar ordenação do branch `order=date` para `OrderByDescending(p => p.CreatedAt)`); `openspec/project.md` (uma frase na descrição do Início). A lista em `/posts` também passa a ser por criação, alinhada com o pedido.
