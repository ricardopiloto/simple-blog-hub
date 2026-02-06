# Change: Área logada, autenticação e colaboração entre autores

## Why

Permitir que autores se autentiquem e colaborem na criação e edição de artigos: área logada para postar e editar, conteúdo em Markdown (armazenamento e edição) com exibição em formato rico (HTML) ao leitor, e permissões simples por post (dono pode editar e deletar; colaborador convidado só pode editar).

## What Changes

- **Autenticação**: Modelo User (email, hash de senha, vínculo 1:1 com Author); login via BFF (JWT); rotas protegidas no BFF e frontend (área autoral).
- **Permissões por post**: Dono = autor que criou o post (Post.AuthorId); colaborador = autor com permissão na tabela PostCollaborator. Dono pode editar e deletar; colaborador pode apenas editar. API e BFF checam permissão em toda escrita e em delete (apenas dono).
- **Conteúdo em Markdown**: Post.Content armazenado em Markdown; conversão para HTML no backend ao servir leitura pública; editor na área logada envia/recebe Markdown.
- **Backend**: Novos modelos User, PostCollaborator; migrations; endpoints de auth (login) e de CRUD de posts com auth e permissões; conversão Markdown→HTML (ex.: Markdig) na montagem do DTO de leitura.
- **BFF**: POST /bff/auth/login (retorna JWT); endpoints protegidos para listar posts editáveis, criar, atualizar e deletar post (repasse para API com identidade do token).
- **Frontend**: Página de login; rotas protegidas (ex.: /area-autor, /area-autor/posts/novo, /area-autor/posts/:id/editar); dashboard com lista de posts editáveis (editar para todos, excluir só para dono); formulário de post com editor Markdown; leitura pública continua recebendo HTML da API.

## Impact

- Affected specs: novas capacidades de **auth**, **post-permissions** e **content-markdown**; **project-docs** e possivelmente **content-source** atualizados.
- Affected code: backend/api (modelos, migrations, controllers de auth e posts, serviço de markdown); backend/bff (auth, endpoints protegidos); frontend (login, rotas protegidas, dashboard, editor, cliente API com token). Leitura pública de posts mantém contrato (HTML); apenas a origem do conteúdo passa a ser Markdown no banco.
