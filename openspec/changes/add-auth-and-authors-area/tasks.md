# Tasks: Área logada, autenticação e colaboração entre autores

## 1. Backend API – modelos e autenticação

- [x] 1.1 Criar modelo `User` (Id, Email, PasswordHash, AuthorId FK, CreatedAt) e relação 1:1 com `Author`
- [x] 1.2 Criar modelo `PostCollaborator` (PostId, AuthorId) com PK composta
- [x] 1.3 Adicionar migration e atualizar `BlogDbContext` e seed (criar pelo menos um User vinculado ao Author existente)
- [x] 1.4 Implementar hash de senha (ex.: BCrypt ou ASP.NET Identity) e endpoint `POST /api/auth/login` (email, password) que valida credenciais e retorna dados do User/Author (sem emitir token)
- [x] 1.5 Garantir que a API aceite identidade do chamador (header ou confiança no BFF) para uso em endpoints de escrita

## 2. Backend API – posts e permissões

- [x] 2.1 Implementar verificação de permissão: dono = Post.AuthorId; colaborador = existe em PostCollaborator; dono pode editar e deletar, colaborador só editar
- [x] 2.2 Endpoint `GET /api/posts` com suporte a filtro “editáveis por autor” quando identidade presente
- [x] 2.3 Endpoints `POST /api/posts`, `PUT /api/posts/{id}`, `DELETE /api/posts/{id}` exigindo identidade e checando permissão (delete apenas para dono)
- [x] 2.4 Endpoint GET de post para edição (área autoral) retornando conteúdo em Markdown; GET público (por slug) mantendo contrato atual com conteúdo em HTML

## 3. Backend API – conteúdo em Markdown

- [x] 3.1 Garantir que `Post.Content` armazene Markdown; migração ou convenção para conteúdo existente
- [x] 3.2 Adicionar conversão Markdown → HTML (ex.: Markdig) ao montar DTO de leitura pública em `GET /api/posts/{slug}` (e listagens que exponham conteúdo resumido)
- [x] 3.3 Endpoints de escrita (POST/PUT) aceitarem e persistirem `content` em Markdown

## 4. BFF – autenticação e JWT

- [x] 4.1 Expor `POST /bff/auth/login` (email, password); chamar API para validar credenciais; emitir JWT (payload com UserId/AuthorId e email) e retornar token + dados do autor
- [x] 4.2 Validar JWT em rotas protegidas e repassar identidade (UserId/AuthorId) para a API nas requisições de escrita
- [x] 4.3 Documentar ou configurar secret e expiração do JWT

## 5. BFF – endpoints protegidos de posts

- [x] 5.1 `GET /bff/posts/editable` (protegido): lista de posts que o autor pode editar (dono ou colaborador)
- [x] 5.2 `GET /bff/posts/{id}` para edição (protegido): retornar post com conteúdo em Markdown
- [x] 5.3 `POST /bff/posts`, `PUT /bff/posts/{id}`, `DELETE /bff/posts/{id}` (protegidos): repassar para API com identidade do token
- [x] 5.4 Manter `GET /bff/posts` e `GET /bff/posts/{slug}` públicos retornando conteúdo em HTML para leitura

## 6. Frontend – login e rotas protegidas

- [x] 6.1 Página de login (`/login`) com formulário email/senha; ao sucesso, armazenar token (ex.: localStorage ou memória) e redirecionar para área autoral
- [x] 6.2 Rotas protegidas: `/area-autor` (dashboard), `/area-autor/posts/novo`, `/area-autor/posts/:id/editar`; sem token válido redirecionar para `/login`
- [x] 6.3 Cliente API (`src/api/client.ts`) enviar `Authorization: Bearer <token>` em chamadas que exigem autenticação
- [x] 6.4 Tratar 401 nas chamadas protegidas (ex.: redirecionar para login ou renovar token)

## 7. Frontend – área autoral e editor

- [x] 7.1 Dashboard em `/area-autor`: listar posts que o autor pode editar; botão “Novo post”; por post: ação “Editar” (quando tiver permissão), “Excluir” apenas se for dono
- [x] 7.2 Formulário de post (novo/editar): título, slug (editável/gerado), excerpt, conteúdo (editor Markdown), capa, publicado, story_order; enviar e receber conteúdo em Markdown
- [x] 7.3 Leitura pública de posts continua consumindo HTML do BFF (sem alteração de contrato para o leitor)
- [x] 7.4 (Opcional) Preview Markdown no editor na área autoral

## 8. Documentação e validação

- [x] 8.1 Atualizar `README.md` e `openspec/project.md` com: área logada, auth, permissões por post, conteúdo em Markdown e fluxo BFF/API
- [x] 8.2 Validar: build da API e do BFF; build e testes do frontend; fluxo de login e listagem editável manualmente ou com teste E2E se existir
