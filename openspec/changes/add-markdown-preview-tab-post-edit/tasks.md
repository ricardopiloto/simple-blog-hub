# Tasks: add-markdown-preview-tab-post-edit

## 1. Dependência Markdown no frontend

- [x] 1.1 Adicionar pacote **marked** (ou equivalente) ao projeto frontend para conversão Markdown → HTML. Garantir que a versão escolhida é compatível com o uso em browser (ex.: marked com opções seguras).

## 2. Abas Escrever / Preview no campo Conteúdo

- [x] 2.1 Em `frontend/src/pages/PostEdit.tsx`, no bloco do campo "Conteúdo (Markdown)" (Label, Textarea, texto de ajuda): envolver em um componente de abas (Tabs do shadcn: Tabs, TabsList, TabsTrigger, TabsContent). Aba "Escrever" (ou "Markdown"): manter o Label "Conteúdo (Markdown)", o Textarea com id `post-content` e o texto de ajuda abaixo. Aba "Preview": TabsContent com uma área (ex.: div com altura mínima e scroll) que exibe o conteúdo do estado `content` convertido de Markdown para HTML, sanitizado com DOMPurify, e renderizado com a classe `prose max-w-none` (ou equivalente à página do artigo) para que o aspecto seja o da área de texto do post. Não incluir imagem de capa nem cabeçalho no Preview.

## 3. Conversão e sanitização no Preview

- [x] 3.1 Na aba Preview, usar a biblioteca de Markdown para converter `content` (string) em HTML. Em seguida sanitizar o HTML com DOMPurify antes de usar `dangerouslySetInnerHTML`. Tratar conteúdo vazio (ex.: mostrar mensagem discreta "Nada para previsualizar" ou área em branco).

## 4. Spec delta post-edit-form

- [x] 4.1 Em `openspec/changes/add-markdown-preview-tab-post-edit/specs/post-edit-form/spec.md`, adicionar requisito ADDED: o formulário de novo post e de edição de post SHALL oferecer, no campo Conteúdo (Markdown), **duas abas**: (1) **Escrever** — área de texto para editar o Markdown; (2) **Preview** — visualização do conteúdo atual renderizado como na área de texto da página do artigo (Markdown convertido para HTML, mesma tipografia), sem imagem de capa nem cabeçalho. Cenários: autor alterna para Preview e vê o conteúdo renderizado; autor altera texto na aba Escrever, muda para Preview e vê a atualização.

## 5. Tamanho e scroll da área Preview

- [x] 5.1 Em modo Preview, manter a caixa de conteúdo com o **mesmo tamanho** da área de escrita (mesma altura e largura). Quando o texto for longo, exibir **barra de rolagem** dentro da área (overflow-y-auto), da mesma forma que na área de texto. Em `PostEdit.tsx`, o container da aba Preview deve usar altura fixa equivalente à textarea (ex.: min-h e h iguais, overflow-y-auto e overflow-x-hidden).

## 6. Validação

- [x] 6.1 Executar `openspec validate add-markdown-preview-tab-post-edit --strict` e corrigir até passar.
