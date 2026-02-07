# Tasks: add-cover-size-guidance-and-framing

## 1. Orientação no formulário (PostEdit)

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, adicionar texto de ajuda próximo ao campo "URL da imagem de capa" (e ao upload) informando a proporção recomendada (16:9) e dimensões sugeridas (ex.: 1200×675 px) para não cortar a imagem na visualização.

## 2. Enquadramento na exibição

- [x] 2.1 Em `PostPage.tsx`, `PostCard.tsx` e `StoryIndex.tsx`, garantir que as imagens de capa com aspect 16:9 usem `object-cover` e `object-position: center` (ou classe Tailwind equivalente, ex.: `object-center`) para enquadramento consistente.
- [x] 2.2 Verificar `FeaturedPost.tsx` (aspect 4/3): manter comportamento atual e, se necessário, aplicar também object-center para consistência.

## 3. Spec deltas

- [x] 3.1 Preencher `openspec/changes/add-cover-size-guidance-and-framing/specs/post-edit-form/spec.md` com requisito ADDED (orientação de tamanho/proporção) e cenários.
- [x] 3.2 Preencher `openspec/changes/add-cover-size-guidance-and-framing/specs/post-cover-display/spec.md` com requisito MODIFIED (enquadramento e proporção de exibição) e cenários.

## 4. Validação

- [x] 4.1 Executar `openspec validate add-cover-size-guidance-and-framing --strict` e corrigir qualquer falha.
