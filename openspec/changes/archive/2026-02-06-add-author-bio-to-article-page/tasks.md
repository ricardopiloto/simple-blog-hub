# Tasks: Exibir descrição do autor no final da página do artigo

## 1. Backend (verificação)

- [x] 1.1 Confirmar que a resposta pública do post (GET por slug, API e BFF) inclui `author.bio` no DTO (AuthorDto / author no JSON). Se já existir, nenhuma alteração; caso contrário, adicionar o campo à resposta.

## 2. Frontend

- [x] 2.1 Em `PostPage.tsx`, após o bloco de conteúdo do artigo (`dangerouslySetInnerHTML`), exibir uma secção "Descrição do autor" (ou bloco visual equivalente) quando `post.author?.bio` existir: nome do autor, avatar (se houver) e texto da descrição. Utilizar a mesma fonte de dados (`post.author.bio`) que corresponde à descrição configurável na tela de Contas.
- [x] 2.2 Quando o autor não tiver descrição (`bio` nulo ou vazio), não exibir a secção de descrição do autor (evitar bloco vazio).

## 3. Documentação e validação

- [x] 3.1 Atualizar `openspec/project.md` (secção Páginas ou Autores): referir que na página do artigo, após o texto, é exibida a descrição do autor (quando configurada em Contas). Opcional: README.
- [x] 3.2 Build do frontend (e backend se alterado). Validar manualmente: abrir um artigo cujo autor tenha descrição configurada em Contas e confirmar que a descrição aparece no final da página; abrir um artigo cujo autor não tenha descrição e confirmar que não aparece bloco vazio.
