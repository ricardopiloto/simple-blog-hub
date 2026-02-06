# Tasks: Admin e gestão de contas

## 1. API – configuração e verificação Admin

- [x] 1.1 Adicionar configuração `Admin:Email` na API (ex.: em `appsettings.json` como vazio ou exemplo; valor efetivo via variável de ambiente `Admin__Email`). Exemplo de valor: `ac.ricardosobral@gmail.com`.
- [x] 1.2 Implementar verificação “is admin” na API: dado o AuthorId (header X-Author-Id), obter o User e comparar `User.Email` com `Admin:Email` (case-insensitive, trim). Expor como serviço ou método reutilizável nos controllers que precisarem.

## 2. API – endpoints de usuários

- [x] 2.1 GET /api/users (protegido por X-Author-Id): apenas se o chamador for Admin; retornar lista de usuários (id, email, authorId, author name ou equivalente).
- [x] 2.2 POST /api/users (protegido; apenas Admin): body { email, password, authorName }; criar Author (novo) e User com senha em hash (BCrypt); e-mail único; retornar 201 com dados do usuário criado ou 400/409 em caso de conflito.
- [x] 2.3 PUT /api/users/{id} (protegido): se chamador é Admin, permitir alterar email e/ou password do usuário alvo; se chamador é o próprio usuário (mesmo id), permitir apenas alterar password. Body { email?, password? }.
- [x] 2.4 DELETE /api/users/{id} (protegido; apenas Admin): remover o User (e opcionalmente o Author se não tiver posts/colaborações, ou definir política de Author órfão); retornar 204 ou 404.
- [x] 2.5 Incluir no response do POST /api/auth/login um campo `is_admin` (boolean) indicando se o e-mail do usuário coincide com `Admin:Email`.

## 3. BFF – endpoints de usuários e login

- [x] 3.1 Repassar para a API os novos endpoints: GET /bff/users, POST /bff/users, PUT /bff/users/{id}, DELETE /bff/users/{id} (todos protegidos por JWT; enviar X-Author-Id).
- [x] 3.2 Garantir que o POST /bff/auth/login repasse ou enriqueça a resposta com `is_admin` (conforme retorno da API).

## 4. Frontend – tipos e cliente API

- [x] 4.1 Estender o tipo/objeto de autor (ex.: no retorno do login) com `is_admin?: boolean`. Tipos para lista de usuários (id, email, authorId, authorName ou equivalente) e payloads de criar/atualizar usuário.
- [x] 4.2 Cliente: fetchUsers(), createUser(payload), updateUser(id, payload), deleteUser(id) (todos com auth). Login já deve retornar is_admin para uso no contexto de auth.

## 5. Frontend – área Admin e alterar senha

- [x] 5.1 Rota protegida por “admin” (ex.: `/area-autor/contas`): visível apenas quando o usuário logado tem `is_admin === true`; listar usuários, formulário de criar conta (email, senha, nome do autor), editar usuário (admin: email e/ou senha; próprio usuário em outra tela: só senha) e excluir (admin). Usar ProtectedRoute ou equivalente que verifique is_admin.
- [x] 5.2 Seção “Alterar minha senha” acessível a qualquer autor logado (ex.: na área do autor ou em página de perfil): formulário (senha atual, nova senha) que chama PUT /bff/users/{id} com body { password: newPassword } (e opcionalmente validar senha atual na API se já existir endpoint para isso; senão apenas PUT com nova senha).

## 6. Documentação

- [x] 6.1 No README.md, adicionar na seção de variáveis de ambiente (ou criar subseção “Configuração do Admin”) a variável que define o e-mail do Admin (ex.: na API: `Admin__Email`; exemplo de valor `ac.ricardosobral@gmail.com`). Explicar que apenas essa conta poderá criar, alterar e excluir outras contas; as demais só podem alterar a própria senha.

## 7. Validação

- [x] 7.1 Build da API e do BFF; build do frontend. Validar fluxo: login como Admin exibe área de contas; criar/editar/excluir usuário; login como autor comum não exibe área de contas; autor altera própria senha.
