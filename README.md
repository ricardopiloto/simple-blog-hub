# 1noDado RPG

Blog de leitura para **contos e aventuras de RPG** (interface em português). Autores publicam capítulos em Markdown; leitores navegam por data ou ordem narrativa. A **Área do Autor** inclui dashboard, gestão de contas, agendamento de publicações e geração de imagens de capa.

**Repositório:** [github.com/ricardopiloto/simple-blog-hub](https://github.com/ricardopiloto/simple-blog-hub)

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite 5, React Router, Tailwind CSS, shadcn/ui, TanStack Query |
| **BFF** | .NET 8, JWT, rate limiting |
| **API** | .NET 8, Entity Framework Core, SQLite, Markdig (Markdown→HTML) |
| **Testes** | Vitest (frontend), xUnit (`backend/BlogBff.Tests`) |
| **Produção** | Docker, Caddy (reverse proxy) |

Arquitetura: **Frontend → BFF** (entrada pública) **→ API** (interna) **→ SQLite**. O browser nunca contacta a API directamente.

## Licença

O **código-fonte** deste repositório está sob a licença **[MIT](LICENSE)**.

O **conteúdo dos posts** (textos, capítulos) é responsabilidade dos respectivos autores. O ícone d20 do logo é de [Delapouite / game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html) (CC BY 3.0).

## Desenvolvimento local

### Requisitos

- [Node.js](https://nodejs.org/) e npm
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Arranque

```bash
# 1. Frontend
cd frontend && npm install && npm run dev

# 2. API (outro terminal)
cd backend/api && dotnet run

# 3. BFF (outro terminal)
cd backend/bff && dotnet run
```

Abrir o URL do Vite (ex.: `http://localhost:5173`). O frontend usa o BFF em `http://localhost:5000` por defeito (`VITE_BFF_URL` opcional).

**Primeiro login (desenvolvimento):** e-mail `admin@admin.com`, senha `senha123` — o sistema pede troca de senha no primeiro acesso.

### Comandos úteis

```bash
cd frontend && npm run test    # testes Vitest
cd frontend && npm run build   # build de produção
cd backend/bff && dotnet test ../BlogBff.Tests   # testes BFF
```

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Funcionalidades e APIs](docs/FUNCIONALIDADES.md) | Funcionalidades do sistema, contratos das APIs, arquitectura |
| [CHANGELOG](CHANGELOG.md) | Versionamento e histórico de releases |
| [Deploy Docker + Caddy](docs/deploy/DEPLOY-DOCKER-CADDY.md) | Instalação em produção |
| [Atualizar 2.6.3 → 2.6.6](docs/deploy/ATUALIZAR-2-6-3-PARA-2-6-6.md) | Upgrade desde a versão actual em PROD |
| [Integração n8n](docs/integrations/N8N-POST-INGEST.md) | Automação de posts via API de integração |
| [Índice da documentação](docs/README.md) | Todos os guias (segurança, base de dados, etc.) |

---

Interface inicial criada com [Lovable](https://lovable.dev).
