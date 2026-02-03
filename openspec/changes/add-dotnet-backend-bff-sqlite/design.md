# Design: Backend .NET Core + SQLite e BFF

## Context

O Simple Blog Hub hoje usa apenas dados mock no frontend. Desejamos persistência real (SQLite) e um backend em .NET Core, com uma camada BFF (Backend-for-Frontend) exposta à internet para proteger a API interna de ataques diretos.

## Goals / Non-Goals

- **Goals**: Backend em .NET Core; persistência em SQLite; API interna (backend) não exposta; BFF como único ponto de entrada público que chama o backend; frontend consome apenas o BFF; documentação atualizada (README, openspec/project.md).
- **Non-Goals**: Autenticação de usuários (blog é leitura pública); deploy em produção (apenas estrutura e execução local); migração de dados históricos além do seed equivalente ao mock atual.

## Decisions

### 1. Arquitetura em duas camadas (BFF + API)

- **BFF (Backend-for-Frontend)**: Aplicação .NET Core exposta publicamente (ex.: porta 5000 ou 7000). O frontend faz todas as requisições apenas para o BFF. Responsável por: agregar respostas, validar entrada, rate limiting opcional, e encaminhar para a API interna. Não acessa o banco diretamente; consome a API interna.
- **API (Backend)**: Aplicação .NET Core interna (ex.: porta 5001 ou 7001), não exposta à internet. Expõe endpoints REST para posts e autores. Acessa SQLite via Entity Framework Core. Só é chamada pelo BFF (em desenvolvimento pode ser localhost; em produção apenas rede interna ou localhost).
- **Benefício**: Ataques (DDoS, exploração de endpoints, scraping) atingem o BFF; a API e o banco ficam atrás da BFF, com possibilidade de restringir acesso por rede.

### 2. SQLite como banco

- Um arquivo `.db` (ex.: `backend/api/blog.db` ou em pasta `data/`) para simplicidade e portabilidade. Schema: tabelas `Authors` e `Posts` (post tem `AuthorId` FK). Migrations via EF Core.
- Seed inicial: conteúdo equivalente aos atuais `mockPosts` (mesmos 5 posts e autor “Ana Silva”) para substituir o mock sem perder o conteúdo.

### 3. Modelo de dados (alinhado ao frontend)

- **Author**: Id (Guid), Name, AvatarUrl (nullable), Bio (nullable), CreatedAt, UpdatedAt.
- **Post**: Id (Guid), Title, Slug (unique), Excerpt (nullable), Content, CoverImageUrl (nullable), Published (bool), PublishedAt (nullable), CreatedAt, UpdatedAt, StoryOrder (int), AuthorId (FK). Resposta da API/BFF inclui objeto author aninhado (name, avatar, bio) para compatibilidade com o tipo `Post` atual no frontend.

### 4. Endpoints

- **API (interno)**:
  - `GET /api/posts` — lista posts (filtro opcional por published); ordenação por data ou story_order conforme query.
  - `GET /api/posts/{slug}` — post por slug (inclui author).
  - `GET /api/authors/{id}` — autor por id (se necessário).
- **BFF (público)**:
  - `GET /bff/posts` — lista posts publicados (ordenados por data ou story_order); repassa para a API.
  - `GET /bff/posts/{slug}` — post por slug; repassa para a API.
  - O BFF não expõe escritas nem endpoints administrativos nesta fase (somente leitura).

### 5. Estrutura de pastas no repositório

- **backend/**:
  - **api/** — projeto .NET Core da API interna (EF Core, controllers, modelos, migrations, SQLite).
  - **bff/** — projeto .NET Core do BFF (HttpClient para a API, controllers que delegam ao backend).
- **Frontend**: continua na raiz; `src/api/` contém o cliente HTTP que chama apenas a base URL do BFF (ex.: `VITE_BFF_URL`). Hooks (`usePosts`) passam a usar esse cliente em vez de mock.

### 6. Variáveis de ambiente

- **Frontend**: `VITE_BFF_URL` (opcional em dev; default pode ser `http://localhost:5000` ou a porta do BFF).
- **BFF**: URL da API interna (ex.: `API__BaseUrl=http://localhost:5001`).
- **API**: Connection string do SQLite (ex.: `Data Source=blog.db`).

## Risks / Trade-offs

- **BFF como single point of failure**: Se o BFF cair, o frontend perde dados. Mitigação: BFF simples e estável; monitoramento em produção.
- **Latência extra (Frontend → BFF → API)**: Um hop a mais. Aceitável para blog de leitura; BFF e API podem rodar na mesma máquina em produção para reduzir latência.

## Migration Plan

1. Implementar API .NET Core + SQLite + EF Core + endpoints de leitura; seed com dados do mock.
2. Implementar BFF .NET Core que chama a API; expor `/bff/posts` e `/bff/posts/{slug}`.
3. No frontend: implementar cliente em `src/api/` (fetch para BFF); alterar hooks para usar o cliente; manter tipo `Post` compatível (author aninhado).
4. Remover uso de `mockPosts` nos hooks (e opcionalmente manter arquivo para fallback ou testes); configurar `VITE_BFF_URL` onde necessário.
5. Atualizar README e `openspec/project.md`: como rodar API, BFF e frontend; documentar arquitetura BFF + API e SQLite.

## Open Questions

- Portas definitivas para API e BFF (ex.: 5001 e 5000) podem ser fixadas na documentação e em `.env.example`.
- Ordenação: endpoints podem aceitar query `?order=date|story` para listar por data ou por story_order.
