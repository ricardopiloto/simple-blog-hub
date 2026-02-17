# Tasks: post-page-cover-transparent-bg-and-comments

## 1. Fundo transparente no contentor da capa

- [x] 1.1 Em `frontend/src/pages/PostPage.tsx`, no contentor da imagem de capa (div com `aspect-[16/9] rounded-xl overflow-hidden bg-muted`), substituir `bg-muted` por fundo transparente (ex.: `bg-transparent` ou remover a classe de fundo), de forma que as faixas (letterboxing/pillarboxing) quando a imagem não preenche o 16:9 fiquem transparentes.

## 2. Comentários de secção em PostPage.tsx

- [x] 2.1 Em `frontend/src/pages/PostPage.tsx`, adicionar ou reforçar comentários que identifiquem cada secção: (1) estado de loading (skeleton); (2) estado de erro / artigo não encontrado; (3) link "Voltar para artigos"; (4) cabeçalho do artigo (título, autor, data, visualizações); (5) bloco da imagem de capa (16:9, object-contain); (6) conteúdo HTML do post; (7) secção de bio do autor (quando existir); (8) navegação anterior/próximo por ordem da história. Manter comentários concisos e em linha com o código existente onde já existam (ex.: {/* Cover Image */}).

## 3. Spec delta post-cover-display

- [x] 3.1 Em `openspec/changes/post-page-cover-transparent-bg-and-comments/specs/post-cover-display/spec.md`, adicionar MODIFIED ao requisito "Na página do artigo a capa é exibida com object-contain para caber sem cortar": o contentor 16:9 SHALL ter **fundo transparente** (e não fundo neutro/muted) nas faixas quando a imagem não preenche todo o 16:9. Atualizar o cenário correspondente (faixas com fundo transparente em vez de "fundo neutro (ex.: cor muted)").

## 4. Validação

- [x] 4.1 Executar `openspec validate post-page-cover-transparent-bg-and-comments --strict` e corrigir até passar.
