# Change: Ajustar nome do blog para "1noDado RPG" e tagline para "Contos e aventuras"

## Why

Alinhar a identidade do blog ao nome "1noDado RPG" e à tagline "Contos e aventuras", substituindo "Simple Blog Hub" e "Histórias & Ideias" em toda a aplicação e documentação.

## What Changes

- **Nome do blog**: "Simple Blog Hub" → "1noDado RPG" em título da página, meta tags, autor, README, openspec/project.md, Header/Footer (onde hoje aparece "Blog" como marca) e backend/README.
- **Tagline**: "Histórias & Ideias" → "Contos e aventuras" no hero da página inicial (Index.tsx), no título e nas meta descriptions (index.html, README, project.md quando citam a tagline).
- **Arquivos afetados**: `index.html`, `src/pages/Index.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `README.md`, `openspec/project.md`, `backend/README.md`. Nenhuma alteração de lógica ou rotas; apenas texto e marca.

## Impact

- Affected specs: capacidade `branding` (nome e tagline da aplicação).
- Affected code: arquivos listados acima. Build e testes do frontend permanecem válidos.
