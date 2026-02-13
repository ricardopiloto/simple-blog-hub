# post-publishing — delta for fix-scheduled-publish-author-timezone

## MODIFIED Requirements

### Requirement: Publicação automática no momento agendado (MODIFIED)

O sistema **deve** (SHALL) publicar automaticamente os posts que tenham **agendamento** (`scheduled_publish_at` preenchido) quando a **data/hora agendada** for atingida. O momento agendado **deve** ser interpretado como a **hora local do autor**: quando o autor seleciona uma data e hora no formulário (ex.: 10:00), a publicação **deve** ocorrer às 10:00 no fuso horário do utilizador (browser). Para isso, o frontend **deve** enviar a data/hora em formato ISO 8601 **com o offset do fuso** do utilizador (ex.: `2025-02-14T10:00:00-03:00`); a API **deve** interpretar esse valor, converter para UTC e persistir em `ScheduledPublishAt`; um processo em background na API **deve** executar periodicamente (ex.: a cada minuto), identificar posts com `ScheduledPublishAt <= DateTime.UtcNow` e `Published == false`, e para cada um: definir `Published = true`, `PublishedAt` conforme o agendamento, e `ScheduledPublishAt = null`. Após essa atualização, o post **deve** aparecer nas listas públicas (página inicial, Índice da História) como qualquer outro post publicado.

#### Scenario: Post agendado é publicado automaticamente na hora (UTC)

- **Dado** que existe um post com `scheduled_publish_at` = 10/Fevereiro/2026 09:00 UTC e `Published = false`
- **Quando** a data/hora do servidor (UTC) atinge ou ultrapassa 10/Fevereiro/2026 09:00
- **E** o processo em background da API executa (ex.: no próximo ciclo do timer)
- **Então** o post é atualizado para `Published = true`, `PublishedAt` definido, `ScheduledPublishAt = null`
- **E** o post passa a aparecer na página inicial e no Índice da História

#### Scenario: Agendamento na hora local do autor

- **Dado** que o autor está no fuso UTC-3 (ex.: Brasil) e seleciona no formulário 14/Fevereiro/2026 10:00 (hora local)
- **Quando** o frontend envia o payload com `scheduled_publish_at` em ISO 8601 com offset (ex.: `2026-02-14T10:00:00-03:00`)
- **Então** a API converte para UTC (ex.: 13:00 UTC) e persiste em `ScheduledPublishAt`
- **E** quando o relógio do autor indicar 10:00 (e o servidor UTC 13:00), o job em background publica o post
- **E** a publicação ocorre às 10:00 horário local do autor

#### Scenario: Posts agendados no futuro permanecem rascunho

- **Dado** que existe um post com `scheduled_publish_at` = uma data/hora futura (ex.: amanhã às 12:00 UTC) e `Published = false`
- **Quando** o utilizador acede à página inicial ou ao Índice da História
- **Então** esse post **não** aparece nas listas públicas
- **E** apenas após a data/hora agendada e a execução do job em background é que o post passa a publicado
