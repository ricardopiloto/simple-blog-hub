# Tasks: add-scheduled-publish-post

## 1. Modelo e migração (API)

- [x] 1.1 Adicionar propriedade `ScheduledPublishAt` (DateTime?, UTC) ao modelo `Post` em `backend/api/Models/Post.cs`.
- [x] 1.2 Gerar e aplicar migração EF Core para a nova coluna.

## 2. DTOs e Create/Update (API)

- [x] 2.1 Em `PostDto` e `CreateOrUpdatePostRequest`, adicionar `scheduled_publish_at` (string ISO 8601 ou DateTime; opcional). No mapeamento, ler e gravar `ScheduledPublishAt`; ao criar/atualizar, se `scheduled_publish_at` for data futura, garantir `Published = false` e gravar `ScheduledPublishAt`.
- [x] 2.2 Em `PostsController` CreatePost e UpdatePost: aceitar o campo e aplicar a regra (agendamento futuro → rascunho com ScheduledPublishAt).

## 3. Background service (API)

- [x] 3.1 Criar `ScheduledPublishBackgroundService` (IHostedService) que, a cada intervalo (ex.: 1 minuto), consulta posts com `ScheduledPublishAt <= UtcNow` e `Published == false`, atualiza para `Published = true`, `PublishedAt = UtcNow`, `ScheduledPublishAt = null`, e chama `SaveChangesAsync`.
- [x] 3.2 Registar o serviço em `Program.cs` (AddHostedService).

## 4. BFF

- [x] 4.1 Garantir que o BFF repassa `scheduled_publish_at` nas respostas da API e no body de create/update de post para o frontend.

## 5. Frontend – tipos e cliente

- [x] 5.1 Em `frontend/src/api/types.ts`, adicionar `scheduled_publish_at?: string | null` (ISO 8601) ao tipo Post e ao payload de create/update.
- [x] 5.2 No cliente (`createPost`, `updatePost`), incluir `scheduled_publish_at` no body quando preenchido.

## 6. Frontend – formulário Novo Post e Editar Post

- [x] 6.1 Em `PostEdit.tsx`, adicionar estado para data/hora agendada (ex.: data + hora ou um único Date). Adicionar secção "Agendar publicação" com Calendar (componente existente) e campo de hora; lógica: se data/hora futura está preenchida, ao guardar enviar `published: false` e `scheduled_publish_at` (em UTC, ISO 8601).
- [x] 6.2 Garantir que "Publicar agora" (checkbox Publicado) e "Agendar publicação" são mutuamente coerentes: quando o autor escolhe agendamento, o post é guardado como rascunho; ao carregar post para edição, preencher o calendário/hora se `scheduled_publish_at` existir.
- [x] 6.3 (Opcional) Na lista da Área do autor, exibir "Agendado para dd/mm/aaaa HH:mm" para posts com `scheduled_publish_at`.

## 7. Spec deltas

- [x] 7.1 Preencher `openspec/changes/add-scheduled-publish-post/specs/post-edit-form/spec.md` com requisito ADDED (agendamento com calendário e hora) e cenários.
- [x] 7.2 Preencher `openspec/changes/add-scheduled-publish-post/specs/post-publishing/spec.md` com requisito ADDED (publicação automática no momento agendado) e cenários.

## 8. Validação

- [x] 8.1 Executar `openspec validate add-scheduled-publish-post --strict` e corrigir falhas.
