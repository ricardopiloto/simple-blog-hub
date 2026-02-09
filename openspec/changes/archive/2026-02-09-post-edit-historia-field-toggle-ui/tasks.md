# Tasks: post-edit-historia-field-toggle-ui

## 1. Frontend – substituir Select por Toggle no campo História

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, remover o uso de `Select`, `SelectTrigger`, `SelectValue`, `SelectContent` e `SelectItem` para o campo "História". Importar `ToggleGroup` e `ToggleGroupItem` de `@/components/ui/toggle-group`.
- [x] 1.2 Renderizar em vez do Select um `ToggleGroup` com `type="single"`, `value={storyType === '' ? undefined : storyType}`, `onValueChange` que chama `setStoryType` (com o valor recebido como `StoryType`) e `setStoryTypeError('')`. Incluir dois `ToggleGroupItem`: um com `value="velho_mundo"` e texto "Velho Mundo", outro com `value="idade_das_trevas"` e texto "Idade das Trevas". Manter o `Label` "História" e a mensagem de erro (`storyTypeError`) abaixo do toggle quando aplicável.
- [x] 1.3 Garantir que o toggle mantém a mesma posição (primeiro campo do formulário, antes do Título), que o estado e a validação no submit permanecem iguais, e que o payload de create/update continua a incluir `story_type`.

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/post-edit-historia-field-toggle-ui/specs/post-edit-form/spec.md`, MODIFIED do requisito "Seleção obrigatória do tipo de história": o campo **deve** ser apresentado como um **toggle** de duas opções (um lado "Velho Mundo", outro "Idade das Trevas"), e não como um select/dropdown. Manter todos os cenários existentes; ajustar a redação onde referir "seleção" para refletir que o controlo é um toggle (dois lados). Adicionar cenário opcional: o autor vê um toggle com dois lados e escolhe um clicando no lado correspondente.

## 3. Validação

- [x] 3.1 Executar `openspec validate post-edit-historia-field-toggle-ui --strict` e corrigir falhas.
