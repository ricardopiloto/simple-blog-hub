# Tasks: update-blog-name-1nodado-rpg

## 1. UI e metadados (nome e tagline)

- [x] 1.1 Em `index.html`, substituir título, description, author e og/twitter: nome "1noDado RPG" e tagline "Contos e aventuras" (ex.: título "1noDado RPG — Contos e aventuras", description mencionando contos e aventuras).
- [x] 1.2 Em `src/pages/Index.tsx`, alterar o h1 do hero de "Histórias & Ideias" para "Contos e aventuras".
- [x] 1.3 Em `src/components/layout/Header.tsx`, alterar o texto do logo/link da marca de "Blog" para "1noDado RPG".
- [x] 1.4 Em `src/components/layout/Footer.tsx`, alterar o texto da marca e o copyright de "Blog" para "1noDado RPG"; ajustar a frase de descrição do footer para alinhar à tagline "Contos e aventuras" se fizer sentido (ex.: "Contos e aventuras de RPG." ou manter tom genérico).

## 2. Documentação

- [x] 2.1 Em `README.md`, alterar o título para "1noDado RPG" e a descrição para usar a tagline "Contos e aventuras" em vez de "Histórias & Ideias".
- [x] 2.2 Em `openspec/project.md`, alterar Purpose e qualquer menção ao nome/tagline para "1noDado RPG" e "Contos e aventuras".
- [x] 2.3 Em `backend/README.md`, alterar referência ao "Simple Blog Hub" para "1noDado RPG".

## 3. Validação

- [x] 3.1 Executar `npm run build` e `npm run test`; confirmar que não há erros.
- [x] 3.2 Verificar em busca no código que não restam "Simple Blog Hub" nem "Histórias & Ideias" como nome ou tagline do produto (exceto em histórico de changes OpenSpec se desejado).
