# Proposal: Publicação agendada de posts (calendário na Área do Autor)

## Summary

Na **Área do Autor**, nas páginas **Novo Post** e **Editar Post**, o autor poderá **agendar** a publicação de um post para uma **data e hora futuras**. O autor preenche o post (título, conteúdo, capa, etc.) e, em vez de marcar "Publicado" imediatamente, escolhe no **calendário** (e hora) quando o post deve ser publicado. O sistema guarda o post como **rascunho** com uma data/hora de agendamento (`ScheduledPublishAt`). Quando essa data/hora for atingida, o sistema **publica automaticamente** o post (define `Published = true` e `PublishedAt`). Exemplo: hoje é 08/Fevereiro; o autor escreve o post e define "Publicar em 10/Fevereiro às 09:00"; o post permanece rascunho até 10/Fevereiro às 09:00, quando passa a publicado.

## Goals

- **Calendário no formulário**: Na página Novo Post (e Editar Post), adicionar um controlo (calendário + hora) para o autor escolher "Publicar em data/hora". Opção clara: publicar **agora** (comportamento atual, checkbox "Publicado") ou **agendar** para uma data/hora futura.
- **Persistência**: Novo campo na base de dados (`ScheduledPublishAt`, DateTime? UTC). Ao guardar com agendamento, o post é persistido com `Published = false` e `ScheduledPublishAt = data/hora escolhida` (em UTC).
- **Publicação automática**: Um processo no backend (ex.: job periódico na API) verifica de tempos a tempos (ex.: a cada minuto) se existem posts com `ScheduledPublishAt <= UtcNow` e `Published == false`; para cada um, define `Published = true`, `PublishedAt = UtcNow` (ou `ScheduledPublishAt`) e limpa `ScheduledPublishAt`.

## Scope

- **In scope**: (1) **API**: Novo campo `ScheduledPublishAt` (DateTime?, UTC) no modelo `Post`; migração EF Core; DTOs e Create/Update request aceitam `scheduled_publish_at` (opcional). (2) **API**: Serviço em background (ex.: `IHostedService` com timer) que periodicamente (ex.: cada 1 minuto) atualiza posts com `ScheduledPublishAt <= DateTime.UtcNow` e `Published == false` para `Published = true`, `PublishedAt = DateTime.UtcNow`, `ScheduledPublishAt = null`. (3) **BFF**: Repassar o campo nas respostas e no create/update. (4) **Frontend**: No formulário Novo Post e Editar Post, adicionar secção "Agendar publicação" com calendário (data) e campo de hora; quando o autor define data/hora futura, ao guardar enviar `published: false` e `scheduled_publish_at` (ISO 8601); quando "Publicado" está marcado e não há agendamento, comportamento atual. Regras: se há agendamento, o post é guardado como rascunho; na Área do autor, posts agendados podem ser mostrados com indicação "Agendado para dd/mm/aaaa HH:mm". (5) **Spec deltas**: post-edit-form (ADDED – agendamento com calendário/hora); post-publishing (ADDED – publicação automática no momento agendado).
- **Out of scope**: Fuso horário configurável na UI (usar UTC no backend; no frontend pode-se usar o fuso local do browser para exibir e enviar em UTC); fila de jobs externa (Redis, Hangfire); notificação ao autor quando o post for publicado.

## Affected code and docs

- **backend/api**: Modelo `Post` (+ `ScheduledPublishAt`); migração; `PostDto`, `CreateOrUpdatePostRequest` (+ `scheduled_publish_at`); `PostsController` Create/Update leem e gravam o campo; novo `ScheduledPublishBackgroundService` (ou equivalente) registado como IHostedService.
- **backend/bff**: ApiClient e BFF repassam o campo.
- **frontend**: `PostEdit.tsx` – estado para data/hora agendada, UI calendário + hora (ex.: componente Calendar existente + input hora); tipos em `api/types.ts`; cliente envia `scheduled_publish_at` quando preenchido. Área do autor (lista de posts): opcionalmente exibir "Agendado para ..." para posts com scheduled_publish_at.
- **openspec/changes/add-scheduled-publish-post/specs/post-edit-form/spec.md**: ADDED – agendamento com calendário e hora.
- **openspec/changes/add-scheduled-publish-post/specs/post-publishing/spec.md**: ADDED – publicação automática no momento agendado.

## Dependencies and risks

- **Timer/background**: A API deve estar a correr para o job executar; se a API estiver parada na hora agendada, o post será publicado na próxima execução do job após o arranque (atraso aceitável para esta versão).
- **UTC**: Armazenar e comparar em UTC; no frontend converter do fuso local do utilizador para UTC ao enviar, e de UTC para local ao exibir.

## Success criteria

- O autor pode, no formulário Novo Post (e Editar Post), escolher uma data e hora futuras para publicação; ao guardar, o post fica como rascunho com agendamento.
- Quando a data/hora agendada é atingida, o post passa automaticamente a publicado (visível na página inicial e no Índice).
- Posts agendados são visíveis na Área do autor com indicação de agendamento (opcional na primeira versão).
- `openspec validate add-scheduled-publish-post --strict` passa.
