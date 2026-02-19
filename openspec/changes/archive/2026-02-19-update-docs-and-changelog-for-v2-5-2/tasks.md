# Tasks: update-docs-and-changelog-for-v2-5-2

## 1. Nova secção no CHANGELOG

- [x] 1.1 Em **docs/changelog/CHANGELOG.md**, inserir no topo (acima de `## [2.5.1]`) a secção **## [2.5.2]** com os seguintes itens (descrição breve por change):
  - **notify-session-expired-and-redirect-to-home:** Ao receber **401 Unauthorized** (sessão expirada ou token inválido), o frontend exibe um **modal** informando que a sessão expirou e que deve autenticar-se novamente; quando o utilizador estava na **área do autor** (`/area-autor` ou subrotas), ao dispensar o modal é **redirecionado para a página inicial** (`/`).
  - **move-story-type-error-below-form-buttons:** No formulário **Novo post** e **Editar post**, o **alerta de História obrigatório** foi movido para **abaixo dos botões** "Criar post"/"Salvar" e "Cancelar"; a **borda vermelha** no toggle da História mantém-se para indicar o campo em erro.
  - **Documentação e versão:** CHANGELOG com secção [2.5.2]; versão no frontend (package.json) definida como 2.5.2; README secção 4 com tag v2.5.2.

## 2. Versão no frontend

- [x] 2.1 Em **frontend/package.json**, alterar o campo `version` de `"2.5.1"` para `"2.5.2"`.

## 3. README

- [x] 3.1 Em **README.md**, na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags de release, adicionar **v2.5.2** (ex.: … `v2.5.1`, `v2.5.2`).

## 4. Spec delta project-docs

- [x] 4.1 Criar **openspec/changes/update-docs-and-changelog-for-v2-5-2/specs/project-docs/spec.md** com um requisito ADDED: para a **release v2.5.2**, a secção **## [2.5.2]** **deve** aparecer **no topo** do CHANGELOG (acima de [2.5.1]) e **deve** listar as changes notify-session-expired-and-redirect-to-home e move-story-type-error-below-form-buttons com descrição breve, e o item de documentação e versão (versão no frontend 2.5.2; README secção 4 com tag v2.5.2). Incluir cenário: quando um utilizador abre o CHANGELOG, encontra a secção [2.5.2] no topo com as alterações desta release.

## 5. Validação

- [x] 5.1 Executar `openspec validate update-docs-and-changelog-for-v2-5-2 --strict` e corrigir até passar.
