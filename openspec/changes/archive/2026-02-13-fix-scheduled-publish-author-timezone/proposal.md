# Proposal: Agendamento de publicação na timezone do autor

## Summary

Atualmente, ao agendar uma publicação para as 10:00 (horário local do autor), o sistema pode deslocar o momento para outra hora (ex.: 13:00), devido à interpretação inconsistente de data/hora entre o browser e o servidor. Em JavaScript, a string `"YYYY-MM-DDTHH:mm"` sem indicador de fuso é interpretada de forma **ambígua** (em alguns browsers como UTC, noutros como hora local), o que causa o desvio. Este change garante que a **hora agendada seja sempre a hora local do autor**: se o autor agendar para 10:00, a publicação ocorre às 10:00 no fuso horário do autor. A solução consiste em o frontend enviar a data/hora agendada em formato ISO 8601 **com offset explícito** do fuso do utilizador (ex.: `2025-02-14T10:00:00-03:00`); a API interpreta e armazena em UTC; o job em background continua a comparar com `DateTime.UtcNow`. Sem alterações de esquema na base de dados.

## Why

- **Problema**: O autor agenda para 10:00 AM (expectativa: publicar às 10:00 no seu fuso) e o sistema publica noutra hora (ex.: 13:00), devido à diferença entre a máquina do utilizador e o servidor e à interpretação inconsistente de strings sem timezone.
- **Objetivo**: A hora escolhida no formulário (data + hora local) deve corresponder ao momento real da publicação no fuso do autor.

## What Changes

- **Frontend**: Ao construir o valor de `scheduled_publish_at` para enviar à API, usar a data/hora local selecionada pelo autor e formatá-la em ISO 8601 **com o offset do fuso** (ex.: `getTimezoneOffset()` e construir string `±HH:mm`), em vez de depender de `new Date("YYYY-MM-DDTHH:mm").toISOString()` (que pode variar conforme o browser).
- **API**: Garantir que `ParseScheduledPublishAt` interpreta corretamente ISO 8601 com offset (ex.: `-03:00`) e converte para UTC para persistência; o job em background mantém comparação em UTC.
- **Spec**: Requisito em post-publishing atualizado para exigir que o momento agendado seja interpretado como hora local do autor (via offset enviado pelo cliente) e armazenado em UTC.

## Goals

- **Hora do autor**: Quando o autor seleciona uma data e hora no formulário de agendamento (ex.: 10:00), a publicação **DEVE** ocorrer às 10:00 no fuso horário do utilizador (browser). O frontend **DEVE** enviar a data/hora com o offset do fuso (ISO 8601); a API **DEVE** converter para UTC e persistir; o job em background **DEVE** continuar a usar UTC para a comparação.
- **Consistência**: Eliminar a ambiguidade da string sem timezone; todos os clientes enviam explicitamente o offset, garantindo o mesmo comportamento em qualquer browser ou fuso.

## Scope

- **In scope**: (1) **Frontend** (`PostEdit.tsx`): ao montar `scheduled_publish_at` para o payload, construir um ISO string com a data/hora local e o offset do fuso (ex.: função que, a partir de `scheduledDate` + `scheduledTime`, produz `YYYY-MM-DDTHH:mm:ss±HH:mm` usando o timezone do browser). (2) **API** (`PostsController.cs`): assegurar que `ParseScheduledPublishAt` trata corretamente strings com offset (e.g. `DateTime.TryParse` com `DateTimeStyles.RoundtripKind` ou `AdjustToUniversal` conforme necessário) e grava UTC. (3) **Spec post-publishing**: requisito MODIFIED — publicação agendada no momento correto no fuso do autor (cliente envia offset; servidor armazena UTC).
- **Out of scope**: Alterar o esquema da base de dados; suportar múltiplos fusos por autor (perfil com timezone); alterar a exibição de datas noutras partes da aplicação para além da consistência do agendamento.

## Affected code and docs

- **frontend/src/pages/PostEdit.tsx**: Construção de `scheduledIso` no `handleSubmit`: em vez de `new Date(\`${scheduledDate}T${scheduledTime}\`).toISOString()`, usar uma construção que inclua o offset do fuso (ex.: obter ano/mês/dia/hora/minuto a partir dos campos e formatar com `formatOffset(-date.getTimezoneOffset())`).
- **backend/api/Controllers/PostsController.cs**: `ParseScheduledPublishAt` — confirmar que strings ISO com offset (ex.: `2025-02-14T10:00:00-03:00`) são parseadas e convertidas para UTC; em .NET, `DateTime.TryParse` com estilo adequado já suporta offset; garantir que o resultado é sempre `DateTimeKind.Utc` antes de persistir.
- **openspec/changes/fix-scheduled-publish-author-timezone/specs/post-publishing/spec.md**: Delta MODIFIED no requisito de publicação automática no momento agendado.

## Dependencies and risks

- **Nenhum**: Alteração localizada no frontend (formato do payload) e na API (parse já suporta offset; possível verificação). O job `ScheduledPublishBackgroundService` não precisa de alteração (continua a comparar `ScheduledPublishAt <= DateTime.UtcNow`).
- **Compatibilidade**: Posts já agendados no banco têm `ScheduledPublishAt` em UTC; após o fix, novos agendamentos continuarão a ser armazenados em UTC; a única mudança é a forma como o valor é derivado a partir da escolha do autor.

## Success criteria

- O autor, no fuso horário do browser (ex.: Brasil UTC-3), agenda uma publicação para 10:00; após guardar, a publicação ocorre às 10:00 horário local (e não às 13:00 ou 07:00).
- O frontend envia `scheduled_publish_at` em ISO 8601 com offset (ex.: `2025-02-14T10:00:00-03:00`); a API persiste o instante equivalente em UTC; o job em background publica no momento correto.
- Ao reabrir o post para edição, a data/hora agendada exibida corresponde à que o autor escolheu (a API devolve UTC em ISO; o frontend já usa `new Date(iso)` e exibe com getHours/getMinutes, que são em local — desde que o valor armazenado seja o UTC correto, a exibição permanece correta).
- `openspec validate fix-scheduled-publish-author-timezone --strict` passa.
