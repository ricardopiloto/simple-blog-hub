# Tasks: fix-frontend-upload-cover-nullish-coalescing-syntax

## 1. Corrigir sintaxe em client.ts

- [x] 1.1 Em `frontend/src/api/client.ts`, na função `uploadCoverImage`, alterar a linha `err = j.error ?? text || res.statusText` para `err = j.error ?? (text || res.statusText)` de modo a satisfazer a regra que exige parênteses ao misturar `??` com `||`.

## 2. Validação

- [x] 2.1 Executar `openspec validate fix-frontend-upload-cover-nullish-coalescing-syntax --strict` e confirmar que o frontend compila (`npm run build` ou `npm run dev` sem erro de sintaxe).
