# Tasks: persist-story-order-when-saving-index

## 1. Spec delta

- [x] 1.1 Preencher `openspec/changes/persist-story-order-when-saving-index/specs/story-index/spec.md` com requisito ADDED que exija a persistência da coluna `StoryOrder` no banco quando o utilizador autenticado salva a ordem no Índice da História ("Salvar ordem"), com cenário que descreva a persistência.

## 2. Verificação do fluxo (opcional)

- [x] 2.1 Confirmar que o frontend (StoryIndex) chama `updateStoryOrder` ao clicar em "Salvar ordem" e que o BFF e a API atualizam `Posts.StoryOrder`; corrigir qualquer gap encontrado.

## 3. Validação

- [x] 3.1 Executar `openspec validate persist-story-order-when-saving-index --strict` e corrigir falhas.
