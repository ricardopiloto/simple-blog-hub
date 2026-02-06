# Tasks: Ordenar página inicial por data/hora de criação

## 1. API

- [x] 1.1 Em `PostsController.cs`, no branch de listagem pública de posts (quando não é `editable` nem `forAuthorArea`), alterar a ordenação para `order=date`: de `OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)` para `OrderByDescending(p => p.CreatedAt)`, de forma que a lista de posts publicados seja ordenada por data/hora de criação (mais recente primeiro).
- [x] 1.2 Manter o branch `order=story` inalterado (ordenação por `StoryOrder`).

## 2. Documentação

- [x] 2.1 Em `openspec/project.md`, na secção "Páginas" (ou "Domain Context"), atualizar a descrição do Início para: ordenação por data/hora de **criação**; Destaque = último post criado (entre publicados); Artigos recentes = mesma ordem decrescente.

## 3. Validação

- [x] 3.1 Build da API e do frontend. Testar manualmente: criar dois posts publicados em sequência; confirmar que na página inicial o Destaque é o último criado e que "Artigos recentes" segue a ordem decrescente de criação. Opcionalmente alterar `PublishedAt` de um post (via edição/publicação) e confirmar que a ordem na página inicial continua por criação, não por publicação.
