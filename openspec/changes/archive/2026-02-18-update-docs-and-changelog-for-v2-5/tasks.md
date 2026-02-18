# Tasks: update-docs-and-changelog-for-v2-5

## 1. Nova secção no CHANGELOG

- [x] 1.1 Em **docs/changelog/CHANGELOG.md**, inserir no topo (acima de `## [2.4.1]`) a secção **## [2.5]** com os seguintes itens (descrição breve por change):
  - **add-rounded-corners-post-cover-images:** Imagens de capa dos posts exibidas com **bordas arredondadas** (ex.: rounded-lg ou rounded-xl) em todos os contextos: destaque na página inicial, cards na lista de artigos, índice da história (grelha e vista de lista/reordenação) e página do artigo; contentor com overflow-hidden quando necessário.
  - **count-views-only-for-published-posts:** **Contagem de visualizações** apenas para posts **publicados**: o contador só é incrementado quando o post está publicado; abertura de rascunho ou agendado por slug não incrementa. O dashboard "Total de visualizações" soma apenas os ViewCount dos posts publicados.
  - **Documentação e versão:** CHANGELOG com secção [2.5]; versão no frontend (package.json) definida como 2.5; README secção 4 com tag v2.5.

## 2. Versão no frontend

- [x] 2.1 Em **frontend/package.json**, alterar o campo `version` de `"2.4.1"` para `"2.5"`.

## 3. README

- [x] 3.1 Em **README.md**, na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags de release, adicionar **v2.5** (ex.: … `v2.4.1`, `v2.5`).

## 4. Spec delta project-docs

- [x] 4.1 Criar **openspec/changes/update-docs-and-changelog-for-v2-5/specs/project-docs/spec.md** com um requisito ADDED: para a **release v2.5**, a secção **## [2.5]** **deve** aparecer **no topo** do CHANGELOG (acima de [2.4.1]) e **deve** listar as changes add-rounded-corners-post-cover-images e count-views-only-for-published-posts com descrição breve, e o item de documentação e versão (versão no frontend 2.5; README secção 4 com tag v2.5). Incluir cenário: quando um utilizador abre o CHANGELOG, encontra a secção [2.5] no topo com as alterações desta release.

## 5. Validação

- [x] 5.1 Executar `openspec validate update-docs-and-changelog-for-v2-5 --strict` e corrigir até passar.
