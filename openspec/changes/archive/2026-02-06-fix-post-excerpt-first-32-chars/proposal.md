# Change: Resumo automático com os primeiros 32 caracteres do conteúdo

## Why

No formulário de criação/edição de posts, o campo Resumo deve ser preenchido automaticamente com os primeiros 32 caracteres do texto digitado no Conteúdo. Atualmente o comportamento está incorreto (apenas o primeiro caractere ou lógica inconsistente). Corrigir para que o resumo reflita exatamente os primeiros 32 caracteres do conteúdo.

## What Changes

- No frontend (PostEdit): ao alterar o campo Conteúdo, o campo Resumo deve ser atualizado para os primeiros 32 caracteres do conteúdo (trimados se desejado). Garantir que a lógica use `content.slice(0, 32)` (ou equivalente) e que o resumo seja atualizado conforme o usuário digita, para manter os 32 primeiros caracteres em sincronia com o conteúdo.
- Nenhuma alteração de API ou contrato; apenas comportamento do formulário.

## Impact

- Affected specs: capacidade **post-edit-form** (requisito de resumo automático).
- Affected code: `src/pages/PostEdit.tsx` (handler do campo conteúdo e/ou lógica do resumo).
