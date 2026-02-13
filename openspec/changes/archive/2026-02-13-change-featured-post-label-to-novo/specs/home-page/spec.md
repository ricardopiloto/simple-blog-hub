# home-page Specification (delta: change-featured-post-label-to-novo)

## Purpose
Spec delta for change change-featured-post-label-to-novo. Base spec: openspec/specs/home-page/spec.md

## ADDED Requirements

### Requirement: Label do post em destaque na página inicial é "Novo" (SHALL)

Na **página inicial** (`/`), o bloco que exibe o **post em destaque** (o primeiro da lista ordenada por data de criação, i.e. o último post criado entre os publicados) **DEVE** (SHALL) exibir a etiqueta (badge) visível **"Novo"**, e não "Destaque". O critério de qual post aparece nesse bloco permanece inalterado; apenas o **texto da etiqueta** exibida ao utilizador é "Novo".

#### Scenario: Utilizador vê a etiqueta "Novo" no post em destaque

- **Dado** que existem posts publicados e o utilizador acede à página inicial
- **Quando** a página é renderizada
- **Então** o primeiro bloco (post em destaque) exibe a etiqueta **"Novo"** acima do título do post
- **E** esse bloco continua a ser o post com data de criação mais recente entre os publicados
