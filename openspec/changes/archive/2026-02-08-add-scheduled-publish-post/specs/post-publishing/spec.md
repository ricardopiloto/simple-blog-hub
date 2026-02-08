# post-publishing — delta for add-scheduled-publish-post

## ADDED Requirements

### Requirement: Publicação automática no momento agendado

O sistema **deve** (SHALL) publicar automaticamente os posts que tenham **agendamento** (`scheduled_publish_at` preenchido) quando a **data/hora agendada** for atingida (em UTC). Um processo em background na API **deve** executar periodicamente (ex.: a cada minuto), identificar posts com `ScheduledPublishAt <= DateTime.UtcNow` e `Published == false`, e para cada um: definir `Published = true`, `PublishedAt = DateTime.UtcNow` (ou o valor de `ScheduledPublishAt`), e `ScheduledPublishAt = null`. Após essa atualização, o post **deve** aparecer nas listas públicas (página inicial, Índice da História) como qualquer outro post publicado.

#### Scenario: Post agendado é publicado automaticamente na hora

- **Dado** que existe um post com `scheduled_publish_at` = 10/Fevereiro/2026 09:00 UTC e `Published = false`
- **Quando** a data/hora do servidor (UTC) atinge ou ultrapassa 10/Fevereiro/2026 09:00
- **E** o processo em background da API executa (ex.: no próximo ciclo do timer)
- **Então** o post é atualizado para `Published = true`, `PublishedAt` definido, `ScheduledPublishAt = null`
- **E** o post passa a aparecer na página inicial e no Índice da História

#### Scenario: Posts agendados no futuro permanecem rascunho

- **Dado** que existe um post com `scheduled_publish_at` = uma data/hora futura (ex.: amanhã às 12:00 UTC) e `Published = false`
- **Quando** o utilizador acede à página inicial ou ao Índice da História
- **Então** esse post **não** aparece nas listas públicas
- **E** apenas após a data/hora agendada e a execução do job em background é que o post passa a publicado
