# Tasks: schedule-publish-toggle-show-calendar-when-on

## 1. Estado e lógica (PostEdit)

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, adicionar estado `scheduleEnabled` (boolean). Em **novo post**, valor inicial `false`. Ao **carregar post** para edição: se `post.scheduled_publish_at` existir, `scheduleEnabled = true` e preencher data/hora como hoje; se não existir, `scheduleEnabled = false`.
- [x] 1.2 No `handleSubmit`, quando `scheduleEnabled` for false, garantir que o payload usa `scheduled_publish_at: null` e `published` conforme o checkbox (sem usar data/hora). Quando `scheduleEnabled` for true, manter a lógica atual (scheduledIso a partir de data/hora se futura).

## 2. UI: toggle e visibilidade do calendário

- [x] 2.1 Adicionar um **Switch** (toggle) com label "Agendar publicação" na secção de agendamento. Quando `scheduleEnabled` é false, **não** exibir o calendário nem o campo de hora (apenas o toggle e uma descrição breve). Quando `scheduleEnabled` é true, exibir o calendário e o campo de hora como hoje.
- [x] 2.2 Remover o texto "Deixe vazio para publicação imediata" da descrição (reverter a alteração da change clarify-empty-schedule-means-immediate-publish). Ajustar o texto da secção para algo como: "Defina data e hora para publicar automaticamente. Enquanto agendado, o post fica como rascunho." (visível quando o toggle está ligado).

## 3. Spec delta

- [x] 3.1 Em `openspec/changes/schedule-publish-toggle-show-calendar-when-on/specs/post-edit-form/spec.md`, ADDED requirement: o formulário Novo post e Editar post deve ter um toggle "Agendar publicação"; quando desligado (predefinido em novo post), o calendário e o campo de hora não são exibidos e a publicação ao guardar é imediata (conforme checkbox "Publicado"); quando ligado, exibir calendário e hora e permitir agendar. Ao editar post com `scheduled_publish_at`, o toggle deve vir ligado com data/hora preenchidos. Incluir cenários para novo post (toggle off → imediato), toggle on → agendar, e editar post agendado.

## 4. Validação

- [x] 4.1 Executar `openspec validate schedule-publish-toggle-show-calendar-when-on --strict` e corrigir falhas.
