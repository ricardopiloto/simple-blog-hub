# 1noDado RPG

Blog de leitura para **contos e aventuras** de RPG. Interface em português. Os dados vêm do **BFF** (Backend-for-Frontend), que consome uma API interna .NET com persistência em **SQLite**.

**Repositório:** [https://github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

**Documentação:** Para **atualizar** o projeto após um pull (desenvolvimento local ou produção Docker), ver **[ATUALIZAR-SERVIDOR-DOCKER-CADDY.md](ATUALIZAR-SERVIDOR-DOCKER-CADDY.md)**. Para **instalação inicial** em servidor com Docker e Caddy, ver **[DEPLOY-DOCKER-CADDY.md](DEPLOY-DOCKER-CADDY.md)**. Os releases são versionados por tag (ex.: `v1.3`); o changelog das changes OpenSpec aplicadas está em **[CHANGELOG.md](CHANGELOG.md)** e pode ser usado na mensagem do commit de release. A documentação no repositório é **genérica** (sem domínios nem caminhos específicos); podes manter uma cópia local dos guias de deploy/atualização com os teus dados (domínio, caminhos) em ficheiros `*-local.md`, que não são commitados.

## Funcionalidades

- **Página inicial**: ordenada por **data de criação** — Destaque = último post criado (entre publicados), grid de artigos recentes na mesma ordem. Apenas posts **publicados** aparecem aqui e no Índice; rascunhos só na Área do autor.
- **Lista de posts**: visualização dos artigos em ordem de criação (somente publicados).
- **Post individual**: leitura por slug; conteúdo em HTML (convertido de Markdown no backend). No final da página: **descrição do autor** (configurável em Contas), quando existir, e **navegação anterior/próximo** (links para o post anterior e o próximo na ordem da história).
- **Índice da história** (`/indice`): posts em ordem narrativa (`story_order`), com **paginação** (6 itens por página), **filtro em tempo real** (por número da ordem ou título) e cards compactos (título e imagem, sem resumo). Utilizadores **autenticados** podem editar a ordem por **número** (input no card) ou **arrastando** os cards; "Salvar ordem" persiste no backend. Visitantes só visualizam a lista.
- **Tema**: alternância entre modo claro e escuro (persistido em `localStorage`).
- **Login** (`/login`): e-mail e senha; o BFF valida na API e retorna JWT. Por defeito (sem configuração), o admin é **admin@admin.com** com senha **senha123**; com `Seed:EnableDemoData` ativo existe também o utilizador de exemplo `ana@example.com` / `senha123`.
- **Troca obrigatória de senha**: no primeiro acesso com senha padrão (`senha123`), um **modal bloqueante** exige a alteração da senha antes de usar o restante da área logada.
- **Área do autor** (`/area-autor`): dashboard com todos os posts; botão "Novo post". O autor vê "Editar" nos posts em que é dono, colaborador ou Admin, e "Excluir" nos que é dono ou Admin.
- **Menu superior** (autenticado): link "Área do autor", link "Contas" e botão **Sair** (logout).
- **Contas** (`/area-autor/contas`): qualquer autor logado acessa. Autores não-Admin veem e editam apenas o **próprio perfil** (nome do autor, **descrição do autor**, senha). O **Admin** vê todas as contas e pode criar (e-mail e nome; senha padrão `senha123`), editar (nome, descrição, e-mail, senha), resetar senha e excluir usuários.
- **Critério mínimo de senha**: 6 caracteres, uma letra maiúscula e um número (aplicado ao definir ou alterar senha).
- **Edição de posts** (`/area-autor/posts/novo`, `/area-autor/posts/:id/editar`): título, slug, resumo, conteúdo em **Markdown**, capa, **Publicado** e ordem. Ao criar **novo post**, o campo **Ordem** é pré-preenchido com a próxima posição sugerida (último publicado + 1), editável pelo utilizador. Conteúdo armazenado em Markdown e convertido para HTML na leitura pública.
- **Permissões por post**: o **Admin** pode editar e excluir qualquer post; dono pode editar e excluir; colaborador pode apenas editar.
- **Recuperação da senha do Admin**: via **ficheiro de trigger** no servidor (criar ficheiro, reiniciar API, login com senha padrão e trocar novamente). Ver secção "Recuperar senha do Admin" mais abaixo.

## Arquitetura e estrutura dos serviços

Fluxo: **Frontend (React)** → **BFF** (único ponto de entrada público) → **API** (interna) → **SQLite**.

- **Frontend** chama apenas o BFF (`VITE_BFF_URL`, ex.: `http://localhost:5000`). Não acessa a API diretamente.
- **BFF** (.NET 8) repassa requisições para a API interna e emite JWT no login.
- **API** (.NET 8) acessa **SQLite** via Entity Framework Core; não é exposta à internet.

**Estrutura de pastas:**

- **Frontend** (`frontend/`): código React em `frontend/src/` (páginas, componentes, hooks, `frontend/src/api/` cliente BFF, `frontend/src/auth/`, `frontend/src/contexts/`). Comandos npm executam-se a partir de `frontend/`.
- **Backend API** (`backend/api/`): `Controllers/` (Auth, Authors, Posts, Users), `Data/` (DbContext, SeedData), `Models/`, `Services/` (Admin, Markdown, PasswordValidation), `Migrations/`. Ficheiro de dados SQLite: `blog.db` (gerado ao rodar).
- **Backend BFF** (`backend/bff/`): `Controllers/` (Auth, Authors, BffPosts, Users), `Services/` (ApiClient, JwtService), `Models/`.

**Estrutura de arquivos do projeto:**

```
simple-blog-hub/
├── frontend/                     # Frontend React (Vite + TypeScript)
│   ├── src/                      # Código fonte
│   │   ├── api/                  # Cliente BFF (client.ts, types.ts)
│   │   ├── auth/                 # Armazenamento de sessão (storage.ts)
│   │   ├── components/           # layout/, blog/, ui/ (shadcn), rotas, modais
│   │   ├── contexts/             # AuthContext, ThemeContext
│   │   ├── hooks/                # usePosts, use-toast, use-mobile
│   │   ├── lib/                  # Utilitários e constantes
│   │   ├── pages/                # Index, Login, Posts, PostPage, PostEdit, AreaAutor, AreaContas, StoryIndex
│   │   ├── test/                 # Testes Vitest (setup, example)
│   │   ├── App.tsx, main.tsx, index.css
│   │   └── vite-env.d.ts
│   ├── public/                   # Assets estáticos (dice-icon.svg, placeholder.svg, robots.txt)
│   ├── index.html, package.json, vite.config.ts, tailwind.config.ts, tsconfig.*.json
│   └── ...
├── backend/
│   ├── api/                      # API .NET 8 (SQLite)
│   │   ├── Controllers/          # Auth, Authors, Posts, Users
│   │   ├── Data/                 # BlogDbContext, SeedData
│   │   ├── Migrations/           # EF Core migrations
│   │   ├── Models/               # Author, Post, User, DTOs
│   │   ├── Services/             # Admin, Markdown, PasswordValidation
│   │   ├── Program.cs
│   │   └── appsettings.json
│   └── bff/                      # BFF .NET 8
│       ├── Controllers/          # Auth, Authors, BffPosts, Users
│       ├── Models/               # AuthModels
│       ├── Services/             # ApiClient, JwtService
│       ├── Program.cs
│       └── appsettings.json
├── openspec/                     # Especificações e changes (OpenSpec)
│   ├── project.md
│   ├── specs/
│   └── changes/
└── README.md
```

## Stack de desenvolvimento

- **Frontend**: Node.js, npm, **Vite 5**, **React 18**, **TypeScript**, React Router DOM, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, TanStack React Query. Cliente BFF em `frontend/src/api/client.ts`; tipos em `frontend/src/api/types.ts`; hooks em `frontend/src/hooks/usePosts.ts`. Comandos npm executam-se a partir de **`frontend/`**.
- **Backend**: **.NET 8 SDK**. API: Entity Framework Core, SQLite, BCrypt (senhas), Markdig (Markdown→HTML). BFF: JWT para autenticação, HttpClient para a API.
- **Testes**: Vitest, Testing Library, jsdom (`npm run test`, `npm run test:watch` a partir de `frontend/`).
- **Lint**: ESLint 9 (`npm run lint` a partir de `frontend/`).

**Comandos de build:**

- Frontend: em `frontend/`, `npm run build` (produz `frontend/dist/`).
- API: `dotnet build` em `backend/api`.
- BFF: `dotnet build` em `backend/bff`.

**Scripts principais (em `frontend/`):** `npm run dev` (frontend em desenvolvimento), `npm run build`, `npm run test`, `npm run lint`, `npm run preview` (servir o build).

## Requisitos

- **Node.js** e **npm** (frontend) — [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
- **.NET 8 SDK** (backend) — [download](https://dotnet.microsoft.com/download/dotnet/8.0).

## Configuração passo a passo

Seguir esta ordem para pôr o projeto a funcionar do zero até ao primeiro acesso (e opcionalmente ao reset de senha do Admin).

1. **Clonar e instalar dependências do frontend**  
   Entrar na pasta do frontend e instalar: `cd frontend && npm install`.

2. **Build e execução do backend**  
   - Build: `dotnet build` em `backend/api` e em `backend/bff`.  
   - Executar a **API** (porta 5001, SQLite em `backend/api/blog.db`): `cd backend/api && dotnet run`.  
   - Noutro terminal, executar o **BFF** (porta 5000): `cd backend/bff && dotnet run`.

3. **Executar o frontend**  
   Em `frontend/`: `cd frontend && npm run dev`. Abrir no navegador o endereço indicado (em geral `http://localhost:5173` ou a porta configurada no Vite). O frontend usa por padrão `http://localhost:5000` como BFF.

4. **Configurar o Admin (opcional)**  
   Sem configuração, a API usa por defeito o admin **admin@admin.com** (criado na primeira execução com senha `senha123`). Para usar outro e-mail, definir `Admin:Email` em `backend/api/appsettings.json` ou a variável `Admin__Email`; reiniciar a API para criar essa conta.

5. **Primeiro acesso**  
   No frontend, ir a Login e entrar com o e-mail do Admin (por defeito **admin@admin.com**) e senha **senha123**. O sistema exibe um **modal obrigatório** para troca de senha; concluir a alteração. A partir daí pode usar a Área do autor e Contas. Por defeito o banco não tem dados de demonstração (apenas o admin); para carregar autores e posts de exemplo, definir `Seed:EnableDemoData: true` em `backend/api/appsettings.json` e reiniciar a API.

6. **(Opcional) Recuperar senha do Admin**  
   Se o Admin esquecer a senha: no servidor onde a API corre, criar um ficheiro **`admin-password-reset.trigger`** no **diretório de execução da API** (ex.: `backend/api` ao fazer `dotnet run` a partir daí). Reiniciar a API. A API repõe a senha do utilizador com e-mail `Admin:Email` para `senha123`, define "troca obrigatória no próximo login" e apaga o ficheiro. Fazer login com `senha123` e alterar a senha no modal. O caminho do ficheiro pode ser alterado com `Admin:PasswordResetTriggerPath` (appsettings) ou `Admin__PasswordResetTriggerPath` (variável de ambiente).

## Variáveis de ambiente (opcional)

| Variável        | Onde   | Descrição |
|-----------------|--------|-----------|
| `VITE_BFF_URL`  | Frontend | URL do BFF (padrão: `http://localhost:5000`) |
| `API__BaseUrl`  | BFF    | URL da API interna (padrão em appsettings: `http://localhost:5001`) |
| `API__InternalKey` | API e BFF | **Chave partilhada BFF–API**: o BFF envia este valor no header `X-Api-Key`; a API só aceita pedidos com o mesmo valor. Definir o **mesmo** valor em ambos (appsettings ou variável). Em produção usar um valor forte e único. **Não é exposta ao frontend.** Se não configurada, a API aceita todos os pedidos (útil em desenvolvimento). |
| `Jwt:Secret`    | BFF    | Chave para assinar o JWT (alterar em produção) |
| Connection string | API  | SQLite (padrão: `Data Source=blog.db`) |
| `Admin__Email`  | API    | E-mail da conta Admin. Se não definido, usa **admin@admin.com**. Na primeira execução cria a conta com senha `senha123`. |
| `Seed:EnableDemoData` | API | Se `true`, cria autores e posts de exemplo. Por defeito `false` (banco "zerado", só o admin). |
| `Admin__PasswordResetTriggerPath` | API | (Opcional) Caminho do ficheiro de trigger para recuperar a senha do Admin. Por defeito: `admin-password-reset.trigger` no diretório de execução da API. |
| `Cors__AllowedOrigins` | BFF | (Opcional) Lista de origens permitidas para CORS, separadas por `;`. Se definida, só essas origens podem chamar o BFF a partir do browser; definir **apenas no servidor** (não commitar domínios no repositório). Se não definida, qualquer origem é permitida (útil em desenvolvimento e quando o frontend e o BFF estão no mesmo domínio). |

**CORS:** Com **deploy same-origin** (frontend e BFF no mesmo domínio, ex.: Caddy a servir a SPA e a fazer proxy de `/bff` para o BFF), **não é necessária configuração de domínio no CORS** para a aplicação funcionar; o browser trata os pedidos como same-origin. Em desenvolvimento local (frontend e BFF em portas diferentes), CORS aplica-se e a política atual do BFF permite esses pedidos.

O projeto **roda sem `.env`**: o frontend usa padrão em código para o BFF; a API e o BFF usam `appsettings.json` e variáveis de ambiente do processo. O **`.env` em `frontend/` é opcional** e é lido apenas pelo Vite para `VITE_*`; a única usada é `VITE_BFF_URL`. O backend não lê o `.env` do frontend.

## Instalação em ambientes de nuvem (Linux)

Para instalar e executar a aplicação num servidor Linux (ou VM em cloud):

1. **Instalar dependências no servidor**  
   Node.js e npm (ex.: [nvm](https://github.com/nvm-sh/nvm) ou pacote do distro) e [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

2. **Clonar o repositório**  
   `git clone <url-do-repo>` e entrar na pasta do projeto.

3. **Build**  
   Em `frontend/`: `cd frontend && npm install` e `npm run build` (produz `frontend/dist/`).  
   Em `backend/api`: `dotnet build`.  
   Em `backend/bff`: `dotnet build`.

4. **Configuração**  
   Definir variáveis de ambiente ou editar `appsettings.json` na API e no BFF: connection string da API (SQLite, ex.: `Data Source=blog.db`), no BFF `API__BaseUrl` com o URL da API (ex.: `http://localhost:5001`). Para produção, definir `Jwt:Secret` no BFF e a **chave partilhada BFF–API** (`API__InternalKey`) com o **mesmo** valor na API e no BFF (valor forte e único; não é exposta ao frontend). Opcionalmente `Admin__Email` na API. Por defeito o banco inicia sem dados de demonstração; para carregar exemplos, definir `Seed:EnableDemoData: true` na API.

5. **Executar a API**  
   Em `backend/api`: `dotnet run` (ou publicar com `dotnet publish` e executar o binário). A API escuta na porta 5001 (ou a configurada). Garantir que o ficheiro SQLite (ex.: `blog.db`) tem permissões de escrita.

6. **Executar o BFF**  
   Em `backend/bff`: `dotnet run` (ou publicar e executar). O BFF escuta na porta 5000 e deve conseguir alcançar a API (API__BaseUrl).

7. **Servir o frontend**  
   Copiar o conteúdo da pasta `frontend/dist/` para um servidor web (ex.: nginx) configurado como raiz do site, ou usar um reverse proxy que sirva os estáticos e faça proxy de `/bff` para o BFF. Configurar no frontend a URL do BFF (variável de ambiente `VITE_BFF_URL` no build em `frontend/`, ou valor em código).

8. **Primeiro acesso**  
   Abrir no browser a URL do frontend. Em Login, usar **admin@admin.com** e senha **senha123** (ou o e-mail configurado em `Admin__Email`). Concluir a **troca obrigatória de senha** no modal. A partir daí o admin pode usar a Área do autor e Contas.

Por defeito, o banco não tem dados de demonstração e o admin padrão é **admin@admin.com** quando `Admin__Email` não está definido.

## Recuperar senha do Admin (detalhe)

Se o Admin esquecer a senha:

1. No servidor onde a API corre, crie o ficheiro **`admin-password-reset.trigger`** no **diretório de execução da API** (ex.: `backend/api` quando corre `dotnet run` a partir daí). Pode usar outro caminho com `Admin:PasswordResetTriggerPath` ou `Admin__PasswordResetTriggerPath`.
2. Reinicie a API. Na inicialização, a API localiza o utilizador com e-mail `Admin:Email`, repõe a senha para `senha123`, define troca obrigatória no próximo login e **apaga o ficheiro** de trigger.
3. O Admin faz login com `senha123`; o modal de troca de senha é exibido e deve alterar a senha.

**Se a API falhar com "no such column: p.IncludeInStoryOrder" (ou similar):** a base de dados em uso não tem colunas adicionadas por migrações recentes. Ver secção **Troubleshooting** em [backend/api/README.md](backend/api/README.md) para aplicar a migração (reconstruir e reiniciar a API, ou executar o script SQL indicado).

## Outros comandos

Todos os comandos npm abaixo executam-se a partir da pasta **`frontend/`** (ex.: `cd frontend && npm run build`).

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run build`    | Build de produção do frontend (`frontend/dist/`) |
| `npm run preview`  | Servir o build localmente    |
| `npm run test`     | Rodar testes do frontend (Vitest) |
| `npm run test:watch` | Testes em modo watch      |
| `npm run lint`     | Verificar código com ESLint  |

## Verificar que a aplicação funciona

Após clonar o repositório ou após alterações de estrutura ou dependências, use estes passos para confirmar que não há regressões:

1. **Build do frontend** — Na pasta do frontend: `cd frontend && npm install && npm run build`. Deve produzir `frontend/dist/` sem erros.
2. **Testes do frontend** — `cd frontend && npm run test`. Todos os testes devem passar.
3. **Build do backend** — Em `backend/api`: `dotnet build`. Em `backend/bff`: `dotnet build`. Ambos devem concluir com sucesso (requer .NET 8 SDK).
4. **Executar a aplicação** — Num terminal: `cd backend/api && dotnet run`. Noutro: `cd backend/bff && dotnet run`. Noutro: `cd frontend && npm run dev`. Abrir no browser o URL do frontend (ex.: `http://localhost:5173`).
5. **Smoke check no browser** — Carregar a página inicial, ir a Login, entrar com o e-mail do Admin (ex.: **admin@admin.com**) e senha **senha123** (ou a configurada). Confirmar que a Área do autor ou outra chamada ao BFF funciona (ex.: listar posts). Concluir a troca de senha no modal se for o primeiro acesso.

Se todos os passos forem bem-sucedidos, a aplicação está a funcionar corretamente após a estrutura de pastas (`frontend/`, `backend/`).

---

O frontend foi criado com [Lovable](https://lovable.dev).
