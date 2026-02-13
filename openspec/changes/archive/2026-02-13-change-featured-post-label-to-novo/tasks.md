# Tasks: change-featured-post-label-to-novo

## 1. Frontend: alterar texto da etiqueta

- [x] 1.1 Em `frontend/src/components/blog/FeaturedPost.tsx`, na etiqueta (badge) exibida acima do título do post, substituir o texto **"Destaque"** por **"Novo"**.

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/change-featured-post-label-to-novo/specs/home-page/spec.md`, ADDED (ou MODIFIED) requirement: na página inicial, o bloco do post em destaque **DEVE** exibir o label **"Novo"** (e não "Destaque"). Cenário: utilizador acede à página inicial → o primeiro bloco (post em destaque) mostra a etiqueta "Novo".

## 3. Validação

- [x] 3.1 Executar `openspec validate change-featured-post-label-to-novo --strict` e corrigir eventuais falhas.
