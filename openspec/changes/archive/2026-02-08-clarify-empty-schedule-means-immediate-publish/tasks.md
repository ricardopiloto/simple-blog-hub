# Tasks: clarify-empty-schedule-means-immediate-publish

## 1. Frontend – texto na secção Agendar publicação

- [x] 1.1 Em `frontend/src/pages/PostEdit.tsx`, na secção "Agendar publicação", adicionar texto visível que informe ao autor que **deixar a data e a hora vazios** resulta em **publicação imediata** ao guardar (ex.: "Deixe vazio para publicação imediata"). O texto deve aparecer junto aos controlos de calendário e hora (ex.: no mesmo bloco de descrição ou imediatamente abaixo do label), nas páginas "Novo post" e "Editar post".

## 2. Spec delta

- [x] 2.1 Em `openspec/changes/clarify-empty-schedule-means-immediate-publish/specs/post-edit-form/spec.md`, ADDED requirement: na secção "Agendar publicação" do formulário Novo post e Editar post, a interface deve exibir um texto que deixe explícito que deixar a data e a hora de agendamento vazios significa que o post será publicado imediatamente ao guardar (ex.: "Deixe vazio para publicação imediata"). Incluir um cenário: quando o autor abre o formulário, vê essa indicação na secção de agendamento.

## 3. Validação

- [x] 3.1 Executar `openspec validate clarify-empty-schedule-means-immediate-publish --strict` e corrigir falhas.
