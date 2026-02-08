# Design: Publicação agendada de posts

## Decisões

### Modelo de dados

- **ScheduledPublishAt** (DateTime?, UTC): quando preenchido, o post está agendado e deve permanecer `Published = false` até essa data/hora. Após a publicação automática, o campo é limpo (`null`) e `PublishedAt` é definido.

### Regras de negócio no Create/Update

- Se o cliente envia `scheduled_publish_at` com data/hora futura: ignorar ou sobrescrever `published` para `false` no servidor; guardar `ScheduledPublishAt`. O post não aparece nas listas públicas até à hora agendada.
- Se o cliente envia `scheduled_publish_at` no passado ou null e `published == true`: comportamento atual (publicar imediatamente).
- Se o autor remove o agendamento (limpa data/hora) e mantém rascunho: `ScheduledPublishAt = null`, `Published = false`.

### Background job (API)

- **IHostedService** com um timer (ex.: `PeriodicTimer` de 1 em 1 minuto): em cada execução, consultar posts onde `ScheduledPublishAt != null && ScheduledPublishAt <= DateTime.UtcNow && Published == false`; para cada um, atualizar `Published = true`, `PublishedAt = DateTime.UtcNow` (ou `ScheduledPublishAt` para consistência), `ScheduledPublishAt = null`; `SaveChanges`. Evitar sobrecarga: uma única query e batch update.

### Frontend: calendário e hora

- **Data**: Usar o componente Calendar existente (react-day-picker) dentro de um Popover; o autor seleciona o dia.
- **Hora**: Input type="time" ou campo numérico (HH:mm); combinar com a data para formar um DateTime em UTC (assumir fuso local do browser para a interpretação "10/Fev 09:00" = 09:00 no fuso do utilizador, converter para UTC ao enviar).
- **UX**: Opção "Publicar agora" (checkbox Publicado, como hoje) vs "Agendar publicação" (calendário + hora). Se "Agendar" estiver preenchido, ao guardar o post fica como rascunho com agendamento; o checkbox "Publicado" pode ficar desativado ou ser ignorado quando há data agendada.

### Fuso horário

- Backend: sempre UTC. Frontend: enviar em ISO 8601 (ex.: `scheduled_publish_at: "2026-02-10T09:00:00.000Z"`). O autor escolhe data/hora no seu fuso; o frontend converte para UTC antes de enviar (ex.: `new Date(year, month-1, day, hour, minute)` em local, depois `.toISOString()`).
