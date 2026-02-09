# Design: Campo História como toggle

## Alteração de UI

- **Antes**: Select (dropdown) com placeholder "Selecione a história" e duas opções (Velho Mundo, Idade das Trevas).
- **Depois**: Toggle de duas opções lado a lado — um lado "Velho Mundo", outro "Idade das Trevas" (ex.: `ToggleGroup` com `type="single"` e dois `ToggleGroupItem`).

## Comportamento preservado

- Estado: `storyType` continua `'' | 'velho_mundo' | 'idade_das_trevas'`; em novo post inicia vazio; ao carregar post para edição, preencher com `post.story_type`.
- Validação no submit: se `storyType` não for um dos dois valores, impedir envio e mostrar mensagem (ex.: "Selecione a história (Velho Mundo ou Idade das Trevas).").
- Payload: `story_type` continua a ser enviado no create/update.
- Posição: o bloco do campo "História" permanece o primeiro do formulário, antes do "Título".

## Componente

- Usar o `ToggleGroup` existente em `@/components/ui/toggle-group.tsx` com `type="single"`, `value={storyType === '' ? undefined : storyType}`, `onValueChange` para atualizar `storyType` e limpar `storyTypeError`. Dois `ToggleGroupItem` com `value="velho_mundo"` e `value="idade_das_trevas"` e labels "Velho Mundo" e "Idade das Trevas". O `ToggleGroup` do Radix com `type="single"` permite valor vazio (nenhum selecionado) quando `value` é undefined.
