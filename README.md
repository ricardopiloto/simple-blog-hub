# 1noDado RPG

Blog de leitura para **contos e aventuras** de RPG. Interface em português, com página inicial, lista de posts, post por slug e índice em ordem de história. Os dados vêm do **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**.

## Arquitetura

- **Frontend** (React, Vite) → chama apenas o **BFF** (`VITE_BFF_URL`, ex.: `http://localhost:5000`).
- **BFF** (.NET 8) → único ponto de entrada público; repassa requisições para a API interna.
- **API** (.NET 8) → acesso a **SQLite** via Entity Framework Core; não exposta à internet.

## O que o projeto faz

- **Página inicial**: destaque do post mais recente e grid de artigos recentes.
- **Lista de posts**: visualização dos artigos em ordem de publicação.
- **Post individual**: leitura por slug (ex.: `/post/o-inicio-da-jornada`); conteúdo exibido em HTML (convertido de Markdown no backend).
- **Índice**: posts ordenados por ordem narrativa (`/indice`).
- **Tema**: alternância entre modo claro e escuro (persistido em `localStorage`).
- **Área logada (autores)**:
  - **Login** (`/login`): e-mail e senha; o BFF valida na API e retorna JWT. Usuário de exemplo no seed: `ana@example.com` / `senha123`.
  - **Área do autor** (`/area-autor`): dashboard com posts que o autor pode editar (dono ou colaborador); botão "Novo post"; por post: "Editar" (quem tem permissão), "Excluir" (apenas dono do post).
  - **Edição de posts** (`/area-autor/posts/novo`, `/area-autor/posts/:id/editar`): formulário com título, slug, resumo, conteúdo em **Markdown**, capa, publicado e ordem. O conteúdo é armazenado em Markdown e convertido para HTML na leitura pública.
  - **Permissões**: dono (autor que criou o post) pode editar e excluir; colaborador (autor adicionado ao post) pode apenas editar.

## Requisitos

- **Node.js** e **npm** (frontend) — [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
- **.NET 8 SDK** (backend) — [download](https://dotnet.microsoft.com/download/dotnet/8.0).

## Como executar

### 1. Backend (API + BFF)

```sh
# Terminal 1: API (porta 5001, SQLite em backend/api/blog.db)
cd backend/api
dotnet run

# Terminal 2: BFF (porta 5000)
cd backend/bff
dotnet run
```

### 2. Frontend

```sh
# Na raiz do repositório
npm install
npm run dev
```

Abra no navegador o endereço indicado (em geral `http://localhost:5173`). O frontend usa por padrão `http://localhost:5000` como BFF; se o BFF não estiver rodando, a UI exibirá mensagem de erro ao carregar os posts.

### Variáveis de ambiente (opcional)

| Variável        | Onde   | Descrição |
|-----------------|--------|-----------|
| `VITE_BFF_URL`  | Frontend | URL do BFF (padrão: `http://localhost:5000`) |
| `API:BaseUrl`   | BFF    | URL da API interna (padrão em `appsettings.json`: `http://localhost:5001`) |
| `Jwt:Secret`    | BFF    | Chave para assinar o JWT (alterar em produção) |
| Connection string | API  | SQLite (padrão: `Data Source=blog.db`) |
| `Admin__Email`  | API    | E-mail da conta **Admin**. Apenas essa conta pode criar, alterar e excluir outras contas; os demais autores só podem alterar a própria senha. Exemplo: `Admin__Email=ac.ricardosobral@gmail.com` (definir no ambiente ao rodar a API, ex.: `Admin__Email=... dotnet run` ou em `appsettings.Development.json`). |

Para identificar qual usuário é o Admin, configure o e-mail em `Admin:Email` (appsettings) ou `Admin__Email` (variável de ambiente). **Configuração inicial:** na primeira execução da API, se `Admin:Email` estiver definido e não existir usuário com esse e-mail, a conta é criada automaticamente com senha padrão `senha123`. O usuário deve trocar a senha no primeiro acesso (seção **"Alterar minha senha"** na área do autor). O usuário com esse e-mail terá acesso à área **Contas** (gestão de usuários); os outros autores só conseguem alterar a própria senha na área do autor.

### Sobre o arquivo .env

O projeto **roda sem `.env`**: o frontend usa por padrão `http://localhost:5000` para o BFF; a API e o BFF usam `appsettings.json` e variáveis de ambiente do processo. O arquivo **`.env` na raiz é opcional** e é lido apenas pelo **Vite** (frontend) para variáveis `VITE_*`; a única usada no código é `VITE_BFF_URL`. O backend **não lê o `.env` da raiz**; variáveis como `Admin__Email` devem ser definidas no ambiente ao rodar a API (ex.: `Admin__Email=ac.ricardosobral@gmail.com dotnet run` ou em `appsettings.Development.json`). Variáveis **Supabase** (`VITE_SUPABASE_*`) **não são utilizadas** pelo projeto atual; se existirem no seu `.env` local, podem ser removidas.

### Outros comandos

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run build`    | Build de produção do frontend (`dist/`) |
| `npm run preview`  | Servir o build localmente    |
| `npm run test`     | Rodar testes do frontend (Vitest) |
| `npm run test:watch` | Testes em modo watch      |
| `npm run lint`     | Verificar código com ESLint  |

## Tecnologias

- **Frontend**: Vite 5, React 18, TypeScript, React Router DOM, Tailwind CSS, shadcn/ui, Framer Motion, TanStack React Query. Dados via `src/api/` (cliente BFF) e `src/hooks/usePosts.ts`.
- **Backend**: .NET 8 — API em `backend/api` (EF Core + SQLite, modelos User/Author/Post/PostCollaborator, auth por e-mail/senha com BCrypt, CRUD de posts com permissões, Markdown→HTML com Markdig); BFF em `backend/bff` (login com JWT, endpoints protegidos que repassam identidade para a API).
- **Testes**: Vitest, Testing Library, jsdom.
- **Lint**: ESLint 9.

---

Este projeto foi criado com [Lovable](https://lovable.dev).
