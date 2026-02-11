# Documentação do projeto

Estrutura da pasta **docs/**:

| Pasta | Conteúdo |
|-------|----------|
| **changelog/** | [CHANGELOG.md](changelog/CHANGELOG.md) — histórico de releases versionadas (v1.x, v2.0) |
| **deploy/** | Guias de deploy e atualização: DEPLOY-DOCKER-CADDY.md, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, Caddyfile.example, ATUALIZAR-1-9-PARA-1-10.md |
| **database/** | Base de dados no host: EXPOR-DB-NO-HOST.md |
| **security/** | SECURITY-HARDENING.md, PRODUCTION-CHECKLIST.md, TOKEN-STORAGE.md |
| **improvements/** | Avaliação de melhorias de código: CODE-IMPROVEMENTS.md |
| **local/** | Guias locais (atualização por versão, etc.) — **não versionados** (`.gitignore`) |

Os **ficheiros OpenSpec** (especificações, changes, `openspec/AGENTS.md`, etc.) permanecem nos **locais originais** (pasta `openspec/` na raiz) e não são movidos para `docs/`.

O **README** principal do repositório está na [raiz](../README.md).
