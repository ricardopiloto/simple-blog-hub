# Tasks: update-docs-and-changelog-for-v2-4-1

## 1. Nova secção no CHANGELOG

- [x] 1.1 Em **docs/changelog/CHANGELOG.md**, inserir no topo (acima de `## [2.4]`) a secção **## [2.4.1]** com os seguintes itens (descrição breve por change):
  - **remove-personagens-menu-link:** Remoção do item "Personagens" do menu superior (desktop e móvel). O título/logo do site (ícone + "noDado RPG") passou a redirecionar para **https://1nodado.com.br** na mesma aba, em vez da página inicial do blog.
  - **adjust-scene-weather-effect-theme-visibility:** Efeito de chuva e neve na página do artigo com **diferenciação por tema**: no modo claro, partículas com cor mais escura (ex.: slate-600) e opacidade maior para boa visibilidade; no modo escuro mantém-se o comportamento e aparência atuais.
  - **Documentação e versão:** CHANGELOG com secção [2.4.1]; versão no frontend (package.json) definida como 2.4.1; README secção 4 com tag v2.4.1.

## 2. Versão no frontend

- [x] 2.1 Em **frontend/package.json**, alterar o campo `version` de `"2.4"` para `"2.4.1"`.

## 3. README

- [x] 3.1 Em **README.md**, na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags de release, adicionar **v2.4.1** (ex.: … `v2.4`, `v2.4.1`).

## 4. Spec delta project-docs

- [x] 4.1 Criar **openspec/changes/update-docs-and-changelog-for-v2-4-1/specs/project-docs/spec.md** com um requisito ADDED: para a **release v2.4.1**, a secção **## [2.4.1]** **deve** aparecer **no topo** do CHANGELOG (acima de [2.4]) e **deve** listar as changes remove-personagens-menu-link e adjust-scene-weather-effect-theme-visibility com descrição breve, e o item de documentação e versão (versão no frontend 2.4.1; README secção 4 com tag v2.4.1). Incluir cenário: quando um utilizador abre o CHANGELOG, encontra a secção [2.4.1] no topo com as alterações desta release.

## 5. Validação

- [x] 5.1 Executar `openspec validate update-docs-and-changelog-for-v2-4-1 --strict` e corrigir até passar.
