# Design: Agendamento na timezone do autor

## 1. Problema

- O formulário de edição usa `scheduledDate` (YYYY-MM-DD) e `scheduledTime` (HH:mm). Para enviar à API, o código faz `new Date(\`${scheduledDate}T${scheduledTime}\`)` e depois `toISOString()`.
- A string `"YYYY-MM-DDTHH:mm"` **sem sufixo de timezone** é interpretada de forma **inconsistente** entre browsers: em alguns como **hora local**, noutros como **UTC**. Assim, o mesmo par data+hora pode resultar em instantes UTC diferentes conforme o ambiente, causando desvios (ex.: 3 horas).
- O utilizador espera: "agendar para 10:00" = publicar às 10:00 **no meu horário**. O servidor e o job usam UTC; portanto é necessário que o cliente comunique de forma inequívoca o instante pretendido no fuso do autor.

## 2. Solução

- **Cliente**: Enviar a data/hora agendada em **ISO 8601 com offset explícito** (ex.: `2025-02-14T10:00:00-03:00` para 10:00 em UTC-3). Assim não há ambiguidade: o servidor sabe exatamente qual instante UTC corresponde à escolha do autor.
- **Construção no frontend**: A partir de `scheduledDate` e `scheduledTime` (que representam a intenção do autor em hora local), construir um `Date` em hora local (ex.: `new Date(year, monthIndex, day, hour, minute)`) e depois formatar manualmente como ISO com offset usando `getTimezoneOffset()` (em minutos; offset = -getTimezoneOffset() para o sufixo ±HH:mm).
- **Servidor**: Manter o armazenamento em UTC. `DateTime.TryParse` em .NET aceita ISO 8601 com offset e, com `ToUniversalTime()`, converte para UTC. O `ParseScheduledPublishAt` atual já usa `RoundtripKind` e converte para UTC; basta garantir que strings com offset (ex.: `-03:00`) são aceites (o parser .NET já as trata).
- **Job em background**: Sem alterações; continua a comparar `ScheduledPublishAt <= DateTime.UtcNow`.

## 3. Fluxo resumido

| Passo | Quem | Ação |
|-------|------|------|
| 1 | Autor | Seleciona 14/02/2025 10:00 no formulário (hora local do browser). |
| 2 | Frontend | Constrói ISO com offset, ex.: `2025-02-14T10:00:00-03:00`. Envia em `scheduled_publish_at`. |
| 3 | API | Parse → instante UTC (ex.: 13:00 UTC). Persiste em `Post.ScheduledPublishAt`. |
| 4 | Job | A cada minuto: `ScheduledPublishAt <= UtcNow` → quando 13:00 UTC chega (10:00 no Brasil), publica. |
| 5 | Exibição | Ao carregar o post, a API devolve `scheduled_publish_at` em ISO UTC (ex.: `2025-02-14T13:00:00Z`). O frontend faz `new Date(iso)` e usa `getHours()`/`getMinutes()` → 10:00 no browser (local), correto. |

## 4. Detalhe da construção do ISO no frontend

- Entrada: `scheduledDate` = "2025-02-14", `scheduledTime` = "10:00".
- Criar `Date` em local: `const d = new Date(2025, 1, 14, 10, 0)` (mês 0-based).
- Offset em minutos: `const offsetMin = -d.getTimezoneOffset();` (ex.: 180 para UTC-3).
- Formato ±HH:mm: `const sign = offsetMin >= 0 ? '+' : '-'; const h = Math.floor(Math.abs(offsetMin) / 60); const m = Math.abs(offsetMin) % 60; const offsetStr = \`${sign}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}\`;`
- ISO local com offset: `const y = d.getFullYear(); ... \`${y}-${mm}-${dd}T${hh}:${min}:00${offsetStr}\``.
- Enviar essa string no payload; não usar `toISOString()` para o agendamento.

## 5. API: ParseScheduledPublishAt

- .NET `DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)` aceita ISO 8601 com "K" (kind): strings com "Z" ou com offset (ex.: "-03:00") são parseadas e o resultado tem `Kind` adequado. Chamar `ToUniversalTime()` no resultado garante UTC antes de persistir. Nenhuma alteração pode ser necessária; validar com uma string de teste `2025-02-14T10:00:00-03:00` e confirmar que o valor persistido é 13:00 UTC.
