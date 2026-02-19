# Proposal: Mover alerta de História obrigatório para abaixo dos botões do formulário

## Summary

No formulário **Novo post** (e Editar post), quando o utilizador não seleciona a **História** (Velho Mundo ou Idade das Trevas), o sistema já valida e impede o envio e mostra uma mensagem de erro. Atualmente essa mensagem aparece **junto ao campo História** (logo abaixo do toggle). Este change **move o texto do alerta** para **abaixo dos botões** "Criar post" / "Salvar" e "Cancelar", mantendo a **borda vermelha** no toggle da História para indicar visualmente que o campo está em erro. O utilizador continua a ver que deve escolher a história, mas o aviso fica na parte de baixo do formulário, logo abaixo dos botões de ação.

## Why

- **Pedido do utilizador:** O alerta deve ficar "na parte de baixo, logo abaixo dos botões 'Criar post' e 'Cancelar'", mantendo a borda vermelha no "Toggle box" da história.
- **Consistência:** Agrupar a mensagem de validação da história junto às ações de submissão pode melhorar a descoberta do erro ao tentar guardar.

## What Changes

- **Frontend (PostEdit.tsx):** (1) **Remover** o parágrafo de erro (`storyTypeError`) que está imediatamente abaixo do ToggleGroup do campo "História". (2) **Manter** a borda vermelha no ToggleGroup quando `storyTypeError` está definido (classe `border-destructive`). (3) **Inserir** o mesmo texto de erro (`storyTypeError`) **abaixo** do bloco dos botões "Criar post"/"Salvar" e "Cancelar", ainda dentro do `<form>`, por exemplo logo após o `<div className="flex gap-2">` que contém os botões.

## Goals

- Quando o utilizador submete o formulário sem ter selecionado História, o **toggle** continua com **borda vermelha**.
- A **mensagem de alerta** ("Deve escolher a história" ou equivalente) passa a aparecer **abaixo dos botões** "Criar post"/"Salvar" e "Cancelar", e não junto ao campo História.

## Scope

- **In scope:** Apenas a posição do texto de erro no formulário Novo post / Editar post (PostEdit.tsx); spec delta em post-edit-form.
- **Out of scope:** Alterar o texto da mensagem; alterar a validação ou a API; outros formulários.

## Affected code and docs

- **frontend/src/pages/PostEdit.tsx** — remover o `<p>` de `storyTypeError` de junto ao ToggleGroup; adicionar o bloco que exibe `storyTypeError` abaixo dos botões do formulário.
- **openspec/changes/move-story-type-error-below-form-buttons/specs/post-edit-form/spec.md** — delta que descreve a posição do alerta (abaixo dos botões) e a borda vermelha no toggle.

## Dependencies and risks

- **Dependências:** Nenhuma.
- **Riscos:** Nenhum.

## Success criteria

- No formulário Novo post, ao submeter sem selecionar História, o toggle mantém borda vermelha e a mensagem de erro aparece **abaixo** dos botões "Criar post" e "Cancelar".
- No formulário Editar post, o mesmo comportamento: borda vermelha no toggle e mensagem abaixo dos botões "Salvar" e "Cancelar".
- `openspec validate move-story-type-error-below-form-buttons --strict` passa.
