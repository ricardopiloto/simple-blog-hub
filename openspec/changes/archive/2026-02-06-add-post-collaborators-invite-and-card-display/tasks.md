# Tasks: Convite de colaboradores e exibição no card

## 1. Backend API – DTO e lista de colaboradores

- [x] 1.1 Estender PostDto com campo opcional `collaborators` (lista de { id, name } ou AuthorDto resumido) para respostas da área autoral.
- [x] 1.2 No ToDto para editáveis e para GET edit/{id}, carregar Post.Collaborators (Include) e preencher `collaborators` com os autores (excluindo o dono da lista). Manter `author` como autor original (dono).

## 2. Backend API – endpoints de autores e colaboradores

- [x] 2.1 GET /api/authors (protegido por X-Author-Id): retornar lista de autores (id, name, avatar, bio) para uso no seletor de convite.
- [x] 2.2 POST /api/posts/{id}/collaborators com body { author_id }: apenas dono do post; adicionar PostCollaborator se autor existir e não for o dono e ainda não for colaborador; retornar 204 ou 400/404.
- [x] 2.3 DELETE /api/posts/{id}/collaborators/{authorId}: apenas dono do post; remover PostCollaborator; 204.

## 3. BFF – novos endpoints

- [x] 3.1 GET /bff/authors (protegido): repassar para API com X-Author-Id; retornar lista de autores.
- [x] 3.2 POST /bff/posts/{id}/collaborators e DELETE /bff/posts/{id}/collaborators/{authorId} (protegidos): repassar para API com identidade do token.

## 4. Frontend – tipos e cliente API

- [x] 4.1 Estender tipo Post com `collaborators?: { id: string; name: string }[]` (ou equivalente).
- [x] 4.2 Cliente: fetchAuthors(), addCollaborator(postId, authorId), removeCollaborator(postId, authorId).

## 5. Frontend – card na área do autor

- [x] 5.1 No card de cada post na área do autor: exibir “Autor: [author.name]” (autor original). Se post.collaborators existir e tiver itens, exibir “Colaboradores: [nomes]” ou lista de nomes/chips.

## 6. Frontend – gestão de colaboradores na edição

- [x] 6.1 Na página PostEdit, se o usuário for dono do post: exibir seção “Colaboradores” com lista atual (nome + botão remover) e controle para adicionar (seletor de autor via fetchAuthors, depois addCollaborator). Colaborador não vê a seção de gestão.
- [x] 6.2 Ao adicionar/remover colaborador, invalidar query do post editável para atualizar lista no dashboard.

## 7. Validação

- [x] 7.1 Build API e BFF; build frontend; verificar fluxo: dono adiciona/remove colaborador, card mostra autor original e colaboradores.
