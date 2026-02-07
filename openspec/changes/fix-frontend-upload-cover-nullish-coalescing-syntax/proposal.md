# Proposal: Corrigir erro de sintaxe no frontend (upload cover — nullish coalescing)

## Summary

O frontend falhava ao compilar (Vite + react-swc) com o erro **"Nullish coalescing operator(??) requires parens when mixing with logical operators"** em `frontend/src/api/client.ts`, na função `uploadCoverImage`: a expressão `j.error ?? text || res.statusText` mistura `??` e `||` sem parênteses, o que o parser/transformador exige. Este change corrige a expressão para `j.error ?? (text || res.statusText)` de modo a que a precedência seja explícita e o build do frontend passe.

## Goals

- **Build do frontend**: O frontend SHALL compilar sem erros de sintaxe. A mensagem de erro do upload (quando o BFF devolve um corpo JSON com `error`) deve continuar a usar `j.error` quando presente; caso contrário, `text` ou `res.statusText`.
- **Sem alteração de comportamento**: A lógica de escolha da mensagem de erro permanece a mesma; apenas a sintaxe é corrigida para cumprir a regra do linter/compilador.

## Scope

- **In scope**: Em `frontend/src/api/client.ts`, na função `uploadCoverImage`, alterar `err = j.error ?? text || res.statusText` para `err = j.error ?? (text || res.statusText)`.
- **Out of scope**: Alterar outras partes do cliente ou do fluxo de upload.

## Affected code and docs

- **frontend/src/api/client.ts**: Uma linha na função `uploadCoverImage` (bloco `if (!res.ok)`).

## Dependencies and risks

- **Nenhum**: Correção localizada de sintaxe; comportamento preservado.

## Success criteria

- O frontend compila com `npm run build` (e `npm run dev`) sem o erro "Nullish coalescing operator(??) requires parens when mixing with logical operators".
- A mensagem de erro exibida quando o upload falha continua a preferir `j.error` do JSON, depois `text` e por fim `res.statusText`.
