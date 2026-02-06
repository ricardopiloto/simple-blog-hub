# Design: Admin e gestão de contas

## Context

- O sistema já tem User (e-mail, senha, AuthorId) e Author; login via API/BFF com JWT.
- É necessário uma única conta “Admin” que possa criar, alterar e excluir outras contas; autores comuns só podem alterar a própria senha.
- A identificação do Admin deve ser por configuração (e-mail), não por flag no banco, para facilitar deploy e evitar alteração acidental no banco.

## Goals / Non-Goals

- **Goals:** (1) Identificar Admin por e-mail em configuração (ex.: env). (2) Apenas Admin pode listar/criar/alterar/excluir outras contas. (3) Qualquer autor pode alterar apenas a própria senha. (4) Documentar no README como configurar o e-mail do Admin.
- **Non-Goals:** Múltiplos níveis de permissão (roles além de admin/autor); gestão de perfil completo (nome, avatar) nesta mudança (pode vir depois).

## Decisions

1. **Identificação do Admin:** O Admin é o usuário cujo e-mail coincide com o valor da configuração `Admin:Email` na API (ex.: variável de ambiente `Admin__Email`). A API lê essa configuração e, em cada requisição que exige admin, compara o e-mail do chamador (obtido via User vinculado ao AuthorId do header `X-Author-Id`) com esse valor. Sem configuração, nenhuma conta é considerada Admin.
2. **Onde verificar Admin:** Na API. O BFF repassa identidade (AuthorId/UserId/Email conforme contrato). A API resolve User por AuthorId, obtém o e-mail e compara com `Admin:Email`.
3. **Contratos da API para usuários:**  
   - **GET /api/users** (header X-Author-Id): retorna lista de usuários (id, email, authorId, author name) — apenas Admin.  
   - **POST /api/users** (admin): body { email, password, authorName } — cria Author (se necessário) e User; senha em hash.  
   - **PUT /api/users/{id}**: body { email?, password? }. Se chamador é Admin: pode alterar email e/ou senha de qualquer usuário. Se chamador é o próprio usuário: pode alterar apenas password.  
   - **DELETE /api/users/{id}**: apenas Admin; remove User (e opcionalmente Author se não tiver posts/colaborações, ou deixar Author órfão conforme política).  
4. **Login retornando isAdmin:** O login (API e BFF) pode retornar um campo `is_admin` (boolean) derivado da comparação do e-mail com `Admin:Email`, para o frontend esconder ou exibir a área de gestão de contas.
5. **Frontend:** Rota protegida por “admin” (ex.: `/area-autor/contas`) que lista usuários, formulário de criar conta, editar (email/senha conforme permissão) e excluir (admin). Seção “Alterar minha senha” acessível a qualquer autor logado (ex.: na área do autor ou modal).

## Risks / Trade-offs

- **Admin sem e-mail configurado:** Nenhum usuário será admin; a área de gestão de contas não estará disponível. Mitigação: documentar no README e, se desejado, log de aviso na API ao iniciar.
- **Alteração do e-mail do Admin no banco:** Se o Admin mudar seu e-mail no sistema e a config não for atualizada, perde privilégios. Mitigação: documentar; opcionalmente impedir que o Admin altere o próprio e-mail ou avisar na UI.

## Migration Plan

1. Adicionar `Admin:Email` na configuração da API (appsettings e/ou env).
2. Implementar verificação “is admin” na API e endpoints de users.
3. Ajustar login (API/BFF) para retornar `is_admin`.
4. BFF: novos endpoints de users repassando identidade.
5. Frontend: cliente (fetchUsers, createUser, updateUser, deleteUser); rota admin-only; página de gestão; seção alterar própria senha.
6. Atualizar README com a variável do Admin.

Sem migração de dados obrigatória: o primeiro Admin é quem tiver o e-mail configurado em `Admin:Email`.
