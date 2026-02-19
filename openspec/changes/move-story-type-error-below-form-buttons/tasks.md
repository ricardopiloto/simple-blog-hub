# Tasks: move-story-type-error-below-form-buttons

## 1. Mover mensagem de erro de História para abaixo dos botões

- [x] 1.1 Em **frontend/src/pages/PostEdit.tsx**, **remover** o bloco que exibe `storyTypeError` imediatamente abaixo do ToggleGroup do campo "História" (o `<p className="text-sm text-destructive">` que mostra `storyTypeError`).
- [x] 1.2 No mesmo ficheiro, **manter** a borda vermelha no ToggleGroup quando há erro: a classe condicional `storyTypeError && 'border-destructive'` no ToggleGroup do campo História deve permanecer inalterada.
- [x] 1.3 **Inserir** o bloco que exibe a mensagem de erro de História (**somente quando** `storyTypeError` estiver definido) **logo abaixo** do `<div className="flex gap-2">` que contém os botões "Criar post"/"Salvar" e "Cancelar", ainda dentro do `</form>`. Ou seja: após os botões e antes do `</form>`, mostrar `<p className="text-sm text-destructive">{storyTypeError}</p>` quando `storyTypeError` for não vazio.

## 2. Spec delta post-edit-form

- [x] 2.1 Criar **openspec/changes/move-story-type-error-below-form-buttons/specs/post-edit-form/spec.md** com um requisito **MODIFIED** (ou ADDED) aplicável ao requisito de "Seleção obrigatória do tipo de história": quando a validação falha por o autor não ter selecionado História, o sistema SHALL (1) manter a **borda vermelha** no toggle (Velho Mundo / Idade das Trevas) para indicar o campo em erro; (2) exibir a **mensagem de alerta** (ex.: "Deve escolher a história") **abaixo dos botões de ação** do formulário (Criar post/Salvar e Cancelar), e não junto ao campo História. Cenário: autor submete Novo post sem escolher História → o toggle mostra borda vermelha e a mensagem aparece abaixo dos botões "Criar post" e "Cancelar".

## 3. Validação

- [x] 3.1 Executar `openspec validate move-story-type-error-below-form-buttons --strict` e corrigir até passar.
