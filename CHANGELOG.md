# Changelog

Todas as alterações notáveis deste projeto estão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e o projeto usa [versionamento semântico](https://semver.org/lang/pt-BR/).

**Versão actual:** **2.6.9** (`frontend/package.json` — exibida no rodapé do site após build).

## Histórico completo

O histórico detalhado por release (v1.x → v2.6.9) está em **[docs/changelog/CHANGELOG.md](docs/changelog/CHANGELOG.md)**.

## [2.6.9] — 2026-06-15

### Adicionado

- **enforce-cover-art-style-tags:** Prompts de capa no formulário de post incluem sempre **`Grimdark fantasy`** e **`Photographic`** (normalização BFF em «Gerar prompt» e «Gerar capa»).

## [2.6.8] — 2026-06-15

### Adicionado

- **add-moderation-safe-cover-art-prompt:** Prompt DeepSeek com regras de moderação (system + user) para reduzir bloqueios BFL/Flux; erro **«Request Moderated»** mapeado para mensagem PT (`content_moderated`).

## [2.6.7] — 2026-06-26

### Corrigido

- **fix-deepseek-apikey-config-fallback:** `GetConfiguredApiKey()` faz fallback para `DEEPSEEK__APIKEY` quando `Integrations:DeepSeek:ApiKey` está vazio no `appsettings.json` (corrige **503** em produção com env configurada).

## [2.6.6] — 2026-06-15

### Adicionado

- **add-post-cover-art-prompt:** Prompt de arte via **DeepSeek** (`generate-cover-art-prompt`) e capa via **OpenRouter** no formulário de post; layout do editor em duas colunas alinhadas.

### Documentação

- Guia de actualização [docs/deploy/ATUALIZAR-2-6-3-PARA-2-6-6.md](docs/deploy/ATUALIZAR-2-6-3-PARA-2-6-6.md) (PROD na v2.6.3).

## [2.6.5] — 2026-06-15

### Adicionado

- **add-post-cover-art-prompt:** No formulário **Novo/Editar post**, botão **«Gerar prompt para arte»** (painel lateral, não persistido) e **«Gerar capa»** via **OpenRouter** (`POST /bff/image-generation/generate-openrouter`); preview de capa também em **Novo post**.

## [2.6.4] — 2026-06-15

### Adicionado

- API de integração n8n (`/bff/integrations/*`) com `X-Integration-Key`
- Geração de capa via OpenRouter na integração
- Guia [docs/integrations/N8N-POST-INGEST.md](docs/integrations/N8N-POST-INGEST.md)

### Documentação

- README simplificado, [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md), CHANGELOG na raiz, licença MIT
