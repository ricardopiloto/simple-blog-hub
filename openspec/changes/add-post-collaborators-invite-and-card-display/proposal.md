# Change: Convite de colaboradores no post e exibição no card da área do autor

## Why

A aplicação já possui o modelo PostCollaborator e a regra de que apenas o dono pode excluir o post; colaboradores podem editar. Falta permitir que o **autor original (dono)** convide outros autores para colaborar em um post e que a **área do autor** exiba claramente quem é o autor original e quem são os colaboradores em cada card, mantendo a regra de que só o dono pode deletar.

## What Changes

- **API**: Incluir lista de colaboradores (authors) nas respostas de post quando for para a área autoral (GET editáveis e GET por id para edição). Novos endpoints: listar autores disponíveis para convite (ex.: GET /api/authors); adicionar colaborador a um post (POST /api/posts/{id}/collaborators com author_id); remover colaborador (DELETE /api/posts/{id}/collaborators/{authorId}). Apenas o dono do post pode adicionar ou remover colaboradores.
- **BFF**: Repassar os novos endpoints (lista de colaboradores no DTO de post quando aplicável; GET authors; POST/DELETE collaborators) com autenticação e identidade.
- **Frontend**: No card da área do autor, exibir **autor original** (dono) e **colaboradores** (lista de nomes). Na tela de edição do post, permitir ao dono **convidar** autores (adicionar como colaborador) e **remover** colaboradores; exibir lista de colaboradores atuais. Só o dono vê a seção de gestão de colaboradores.

## Impact

- Affected specs: **post-permissions** (MODIFIED: adicionar requisitos de convite e de exibição autor/colaboradores), nova capacidade **post-collaborators-display** ou extensão da existente.
- Affected code: backend/api (PostDto com lista collaborators, endpoints authors e posts/{id}/collaborators); backend/bff (novos endpoints e repasse); frontend (AreaAutor card com autor original + colaboradores; PostEdit com seção de colaboradores para o dono).
