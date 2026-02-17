# Proposal: Aba Preview no campo Conteúdo (Markdown) do formulário de post

## Summary

Na página **Novo post** e **Editar post** (formulário de edição de artigo), o campo **Conteúdo (Markdown)** passa a ter **duas abas**: (1) **Escrever** — a área de texto atual onde o autor escreve em Markdown; (2) **Preview** — visualização de como o texto ficará quando publicado (conteúdo Markdown convertido para HTML e exibido com o mesmo estilo da área de texto do artigo). O Preview **não** mostra a imagem de capa nem cabeçalho do post; mostra apenas a área de conteúdo (equivalente ao bloco de texto da página do artigo), para o autor ver formatação, títulos, listas, links, etc.

## Why

- **Experiência do autor:** Ver em tempo real como o Markdown será renderizado reduz erros de formatação e facilita a escrita.
- **Alinhamento ao spec:** O spec content-markdown já indica que "The frontend MAY provide a Markdown preview in the editor"; esta change concretiza essa opção.

## What Changes

- **Frontend (PostEdit.tsx):** O bloco que contém o label "Conteúdo (Markdown)" e o `<Textarea>` passa a ser envolvido por um componente de **abas** (ex.: Tabs do shadcn/Radix já existente no projeto). Aba 1 — "Escrever" (ou "Markdown"): mantém o Textarea atual. Aba 2 — "Preview": área com o conteúdo atual do estado `content` convertido de Markdown para HTML, sanitizado (ex.: DOMPurify) e renderizado com a mesma classe de tipografia usada na página do artigo (ex.: `prose max-w-none`), sem imagem de capa nem cabeçalho.
- **Conversão Markdown → HTML no cliente:** Para o Preview ser possível sem chamar o backend, usar uma biblioteca de Markdown no frontend (ex.: **marked**) para converter o texto da textarea em HTML; em seguida sanitizar com DOMPurify antes de injetar no DOM (mesma abordagem de segurança da página do artigo).
- **Dependência opcional:** Adicionar pacote **marked** (ou equivalente leve) ao frontend para conversão Markdown → HTML apenas na aba Preview.

## Goals

- O autor pode alternar entre "Escrever" e "Preview" no campo Conteúdo.
- No Preview, o texto é exibido com a mesma tipografia e estilos da área de conteúdo da página do artigo (prose), sem capa nem cabeçalho.
- O Preview é atualizado quando o conteúdo da textarea muda (mesmo estado `content`).

## Scope

- **In scope:** Abas Escrever/Preview no formulário de post (Novo e Editar); conversão Markdown → HTML no cliente para o Preview; sanitização com DOMPurify; estilo prose consistente com a página do artigo.
- **Out of scope:** Preview completo da página do artigo (com capa, título, autor); edição WYSIWYG; sincronização scroll entre abas; preview em tempo real enquanto digita na mesma vista (apenas ao mudar para a aba Preview).

## Affected code and docs

- **frontend/src/pages/PostEdit.tsx** — substituir o bloco do Conteúdo (Label + Textarea + texto de ajuda) por Tabs com TabsTrigger "Escrever" e "Preview", TabsContent com Textarea no primeiro e div de preview no segundo.
- **frontend/package.json** — adicionar dependência `marked` (ou similar).
- **openspec/changes/add-markdown-preview-tab-post-edit/specs/post-edit-form/spec.md** — delta ADDED (ou MODIFIED) com requisito e cenários.

## Success criteria

- No formulário Novo post e Editar post, o campo Conteúdo tem duas abas: Escrever e Preview.
- Na aba Escrever, o autor vê e edita o textarea em Markdown como hoje.
- Na aba Preview, o autor vê o conteúdo atual renderizado como HTML com estilo prose, sem capa nem cabeçalho.
- `openspec validate add-markdown-preview-tab-post-edit --strict` passa.
