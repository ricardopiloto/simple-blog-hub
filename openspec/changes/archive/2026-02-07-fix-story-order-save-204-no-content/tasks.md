# Tasks: fix-story-order-save-204-no-content

## 1. Corrigir cliente de API (fetchWithAuth)

- [x] 1.1 Em `frontend/src/api/client.ts`, na função `fetchWithAuth`, após verificar que `res.ok` e antes de `return res.json()`, verificar se `res.status === 204` (ou se o corpo está vazio); nesse caso retornar `undefined as T` (ou equivalente) sem chamar `res.json()`.

## 2. Validação

- [x] 2.1 Testar manualmente: abrir Índice da História, autenticar, editar ordem, clicar "Salvar ordem" e confirmar que não aparece o erro e que a ordem é guardada.
- [x] 2.2 Executar `openspec validate fix-story-order-save-204-no-content --strict` se existir spec delta (opcional).
