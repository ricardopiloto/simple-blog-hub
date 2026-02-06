# Design: Convite de colaboradores e exibição no card

## Context

O modelo PostCollaborator já existe; apenas o dono pode deletar, colaboradores podem editar. Não há hoje como o dono adicionar/remover colaboradores nem como a UI mostrar autor original vs colaboradores na listagem da área do autor.

## Goals / Non-Goals

- **Goals**: Dono pode convidar autores (adicionar como colaborador) e remover colaboradores; lista de autores disponíveis para convite; na área do autor, cada card mostra autor original e lista de colaboradores; só o dono vê e usa a gestão de colaboradores na edição do post.
- **Non-Goals**: Notificações por e-mail ao ser convidado; níveis de permissão além de “pode editar”; aprovação do convite pelo colaborador.

## Decisions

### 1. API – DTO e endpoints

- **PostDto para área autoral**: Incluir `collaborators` (lista de objetos com id e name dos autores colaboradores) nas respostas de GET editáveis e GET por id para edição. O autor original já está em `author` e `author_id`; colaboradores são os autores vinculados via PostCollaborator para aquele post (excluindo o próprio dono da lista para evitar duplicata).
- **Listar autores**: GET /api/authors (protegido, exige X-Author-Id) retorna lista de autores (id, name, avatar, bio) para preencher o seletor de “convidar”. Pode filtrar para não incluir o próprio usuário ou incluir todos; incluir todos e no frontend não permitir adicionar a si mesmo como colaborador.
- **Adicionar colaborador**: POST /api/posts/{id}/collaborators com body { author_id }. Apenas dono do post; retorna 204 ou o post atualizado. Não adicionar se já for colaborador ou se for o próprio dono.
- **Remover colaborador**: DELETE /api/posts/{id}/collaborators/{authorId}. Apenas dono do post; 204.

### 2. BFF

- Repassar GET /api/authors com X-Author-Id (protegido).
- Repassar POST e DELETE de collaborators com identidade. Incluir `collaborators` no DTO quando o BFF chama API e monta resposta de posts editáveis / post para edição (ou a API já retorna e o BFF só repassa).

### 3. Frontend – card na área do autor

- No card de cada post: linha “Autor: [nome do autor original]”. Se houver colaboradores, linha “Colaboradores: [nome1, nome2]” ou lista em chips/badges. Manter “Editar” para quem pode editar e “Excluir” só para dono.

### 4. Frontend – gestão de colaboradores na edição

- Na página de edição do post (/area-autor/posts/:id/editar), se o usuário for o dono, exibir seção “Colaboradores”: lista dos atuais com botão remover; campo/seletor para adicionar autor (chamada a GET authors, depois POST collaborators). Colaborador não vê essa seção.
