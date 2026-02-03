# Design: Área logada, autenticação e permissões para autores

## Context

O blog hoje é somente leitura (público). Desejamos uma área logada onde autores se autentiquem, publiquem e editem artigos em colaboração. O conteúdo será armazenado em Markdown e exibido em formato rico (HTML) ao leitor. Apenas o dono do post pode excluí-lo; colaboradores (convidados) podem apenas editar.

## Goals / Non-Goals

- **Goals**: Autenticação de autores (login); área protegida (dashboard) para criar/editar posts; conteúdo em Markdown no armazenamento, conversão para HTML na exibição pública; permissões por post (dono vs colaborador): dono pode editar e deletar, colaborador só editar; BFF e API suportando auth e escritas.
- **Non-Goals**: Registro público de novos autores (admins criam autores/usuários); OAuth externo (Google/GitHub); revisão por pares ou workflow de aprovação; comentários.

## Decisions

### 1. Autenticação

- **Usuário e autor**: Tabela `User` (Id, Email, PasswordHash, AuthorId FK, CreatedAt). Relação 1:1 com `Author`: cada autor que pode logar tem um User. Login por email/senha.
- **Token**: BFF expõe `POST /bff/auth/login` (email, password); valida contra API; retorna JWT (ou cookie de sessão). Opção escolhida: **JWT** no header `Authorization: Bearer <token>` para simplificar e permitir chamadas do frontend sem cookie. O BFF valida o JWT em rotas protegidas e repassa a identidade (AuthorId/UserId) para a API nas requisições de escrita.
- **API**: Endpoint interno `POST /api/auth/login` retorna token e dados do autor; ou a API não emite token e o BFF faz a validação contra a API e emite o próprio JWT. Decisão: **BFF emite JWT** após validar credenciais com a API (API expõe validação de login); payload do JWT contém UserId/AuthorId e email.

### 2. Permissões por post

- **Dono (owner)**: autor que criou o post (`Post.AuthorId`). Pode editar e **deletar**.
- **Colaborador (convidado)**: autor com permissão explícita para editar aquele post. Pode **editar**, **não pode deletar**.
- **Modelo**: Tabela `PostCollaborator` (PostId, AuthorId), PK composta. Se o usuário logado é o `AuthorId` do post, é dono; se existe linha em PostCollaborator para (PostId, AuthorId), é colaborador. Caso contrário, sem acesso de escrita.
- **Listagem na área logada**: o autor vê posts dos quais é dono ou colaborador (API: lista filtrada por “posts que eu posso editar”).

### 3. Conteúdo em Markdown

- **Armazenamento**: O campo `Post.Content` passa a armazenar **Markdown**. Migração: existente conteúdo HTML pode ser tratado como markdown “cru” ou convertido/importado; novos posts só em markdown.
- **Leitura pública**: Na resposta de `GET /api/posts/{slug}` (e BFF), o conteúdo enviado ao frontend para **exibição ao leitor** é **HTML** (convertido a partir do Markdown no backend). Assim o frontend continua exibindo HTML (ex.: `dangerouslySetInnerHTML` ou fragmento seguro).
- **Edição**: Na área logada, o editor envia e recebe **Markdown**. Endpoints de GET (para edição) e POST/PUT de post retornam/aceitam `content` em Markdown; a API converte Markdown → HTML apenas ao montar o DTO de leitura pública.
- **Biblioteca de conversão**: Backend .NET usa uma lib Markdown → HTML (ex.: Markdig). Frontend não converte para leitura pública; opcionalmente usa um renderer Markdown no editor (preview).

### 4. Área logada no frontend

- **Rotas protegidas**: ex.: `/area-autor` (ou `/admin`) para dashboard; `/area-autor/posts/novo`, `/area-autor/posts/:id/editar`. Rotas acessíveis apenas com token válido; senão redirecionar para `/login`.
- **Login**: página `/login` (email, senha); ao sucesso, guardar token (ex.: em memória + localStorage ou só memória); redirecionar para a área autoral.
- **Dashboard**: listar posts que o autor pode editar (dono ou colaborador); botão “novo post”; por post: “editar” sempre que tiver permissão, “excluir” só se for dono.
- **Formulário de post**: título, slug (editável/gerado), excerpt, conteúdo (editor Markdown), capa, publicado, story_order. Salvar envia Markdown para o BFF.

### 5. API e BFF – novos endpoints

- **Auth**: API `POST /api/auth/login` (email, password) → valida e retorna dados do User/Author (sem token; ou retorna um token interno). BFF `POST /bff/auth/login` → chama API, gera JWT, retorna token + autor. BFF valida JWT em rotas protegidas.
- **Posts (escrita)**: API: `GET /api/posts` (para área autoral, com filtro “by permission” quando usuário autenticado), `POST /api/posts`, `PUT /api/posts/{id}`, `DELETE /api/posts/{id}`. Todos os de escrita exigem identidade (BFF envia header ou API confia no BFF). Verificação de permissão: delete só se AuthorId == usuário logado; create atribui AuthorId = usuário; update exige ser dono ou colaborador.
- **BFF**: Expõe `POST /bff/auth/login`; `GET /bff/posts` (público, já existe); `GET /bff/posts/editable` (protegido, lista para área autoral); `GET /bff/posts/{id}` para edição (protegido, retorna markdown); `POST /bff/posts`, `PUT /bff/posts/{id}`, `DELETE /bff/posts/{id}` (protegidos). Para GET público de post por slug, BFF/API continua retornando conteúdo em HTML (convertido).

## Risks / Trade-offs

- **Segurança**: Senhas com hash (ex.: ASP.NET Identity ou BCrypt); JWT com expiração e secret forte. BFF não expor endpoints de escrita sem auth.
- **Migração de conteúdo**: Posts atuais têm Content em HTML; pode-se manter um flag “content_is_markdown” ou migrar tudo para markdown (HTML existente tratado como bloco markdown raw). Proposta inicial: considerar conteúdo existente como Markdown (HTML é válido em blocos de código/markdown); novos posts só markdown.

## Migration Plan

1. Backend: criar modelo User, PostCollaborator; migration; endpoints de auth e de escrita de posts com checagem de permissão; conversão Markdown→HTML na leitura pública.
2. BFF: login, emissão de JWT, endpoints protegidos que repassam para a API com identidade.
3. Frontend: tela de login, rotas protegidas, dashboard, formulário de post (markdown), exibição pública continuando a receber HTML da API.
