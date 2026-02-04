# Change: Área de administração de contas e conta Admin

## Why

Permitir que um único usuário (Admin) gerencie as contas do sistema: criar, alterar e excluir outras contas. Os demais autores só podem alterar a própria senha. Isso exige identificar qual conta é a Admin (via configuração) e expor uma área restrita a ela para CRUD de usuários, além de permitir que qualquer autor altere sua senha.

## What Changes

- **Configuração**: O e-mail da conta Admin será definido via variável de ambiente (ex.: `Admin__Email` na API). Valor de exemplo: `ac.ricardosobral@gmail.com`. Documentar no README como configurar.
- **API**: Novo endpoint para saber se o usuário é admin (ou incluir no login); endpoints para listar usuários (admin), criar usuário (admin), alterar usuário (admin pode alterar qualquer conta; autor só pode alterar a própria senha), excluir usuário (admin). A API lê o e-mail Admin da configuração e compara com o identity do chamador (X-Author-Id / e-mail do User).
- **BFF**: Repassar os novos endpoints de usuários com autenticação e identidade.
- **Frontend**: Nova área acessível apenas pelo Admin (ex.: `/area-autor/contas` ou `/area-admin`) para listar, criar, editar e excluir contas. Qualquer autor logado pode alterar a própria senha (ex.: seção "Alterar minha senha" na área do autor ou em perfil).
- **README**: Seção ou tabela explicando como configurar o e-mail do Admin (variável no ambiente da API) para o sistema identificar a conta com permissão de administrador.

## Impact

- **Affected specs:** auth (novo requisito de Admin e gestão de contas); project-docs (README com config do Admin).
- **Affected code:** API (config, UsersController ou equivalente, DTOs); BFF (endpoints de users); Frontend (rotas protegidas por admin, página de gestão de contas, formulário de alterar própria senha); README.md.
