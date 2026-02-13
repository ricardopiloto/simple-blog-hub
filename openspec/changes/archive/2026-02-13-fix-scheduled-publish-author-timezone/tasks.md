# Tasks: fix-scheduled-publish-author-timezone

Lista ordenada de itens de trabalho.

## 1. Frontend: enviar data/hora agendada com offset do fuso

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, no `handleSubmit`, substituir a construção de `scheduledIso` que usa `new Date(\`${scheduledDate}T${scheduledTime}\`).toISOString()` por uma que construa um ISO 8601 com **offset explícito** do fuso do browser (ex.: função helper que, a partir de `scheduledDate` e `scheduledTime`, cria um `Date` em hora local com `new Date(year, monthIndex, day, hour, minute)` e formata como `YYYY-MM-DDTHH:mm:ss±HH:mm` usando `getTimezoneOffset()`). Garantir que a string é válida e que o instante é futuro antes de enviar.

## 2. API: garantir parse de ISO com offset

- [x] 2.1 Em `backend/api/Controllers/PostsController.cs`, em `ParseScheduledPublishAt`, confirmar que strings ISO 8601 com offset (ex.: `2025-02-14T10:00:00-03:00`) são corretamente parseadas e convertidas para UTC (ex.: `DateTime.TryParse` com estilo que aceite offset; resultado com `ToUniversalTime()` antes de retornar). Se o código atual já tratar offset, adicionar um comentário ou teste manual; caso contrário, usar `DateTimeStyles.AdjustToUniversal` ou equivalente para garantir conversão para UTC.

## 3. Spec delta post-publishing

- [x] 3.1 Em `openspec/changes/fix-scheduled-publish-author-timezone/specs/post-publishing/spec.md`, adicionar MODIFIED requirement: o momento agendado **DEVE** ser interpretado como a **hora local do autor**; o frontend **DEVE** enviar a data/hora em ISO 8601 com o offset do fuso do utilizador; a API **DEVE** converter para UTC e persistir; o job em background **DEVE** comparar com `DateTime.UtcNow`. Cenário: autor no fuso UTC-3 agenda para 10:00 → o cliente envia instante com offset -03:00; a API armazena o UTC equivalente; a publicação ocorre às 10:00 horário local do autor.

## 4. Validação

- [x] 4.1 Executar `openspec validate fix-scheduled-publish-author-timezone --strict` e corrigir eventuais falhas. Verificação manual: agendar um post para daqui a alguns minutos (ex.: 10:00 no fuso local) e confirmar que a publicação ocorre às 10:00 no relógio do autor.
